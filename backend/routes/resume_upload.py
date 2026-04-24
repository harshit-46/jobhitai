"""

# routes/resume_upload.py

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from database import users_collection
from auth import get_current_user
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

# 🔥 Optional: for resume text extraction
import pdfplumber
import docx

router = APIRouter()

load_dotenv()

# ── Config ───────────────────────────────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

ALLOWED_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

ALLOWED_EXTENSIONS = (".pdf", ".doc", ".docx")
MAX_SIZE_MB = 5


# ── Resume Text Extraction ───────────────────────────────────────────────

def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


def extract_text_from_docx(file):
    doc = docx.Document(file)
    return "\n".join([para.text for para in doc.paragraphs])


def extract_resume_text(file: UploadFile):
    filename = file.filename.lower()

    file.file.seek(0)

    try:
        if filename.endswith(".pdf"):
            return extract_text_from_pdf(file.file)

        elif filename.endswith(".docx"):
            return extract_text_from_docx(file.file)

        else:
            return ""

    except Exception as e:
        print("Text extraction error:", e)
        return ""


# ── Upload Resume ────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    # 1. Validate file type (MIME + extension)
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Only PDF or Word documents are allowed.")

    filename = file.filename.lower()
    if not filename.endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(400, "Invalid file extension.")

    # 2. Validate file size (without loading full file permanently)
    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(400, f"File must be under {MAX_SIZE_MB} MB.")

    # Reset pointer after reading
    file.file.seek(0)

    # 3. Get user
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found.")

    # 4. Extract text (🔥 IMPORTANT FEATURE)
    resume_text = extract_resume_text(file)

    # Reset pointer again before upload
    file.file.seek(0)

    # 5. Upload to Cloudinary (memory safe)
    try:
        result = cloudinary.uploader.upload(
            file.file,
            resource_type="raw",
            folder="jobhitai/resumes",
            public_id=f"resume_{db_user['_id']}",
            overwrite=True,
            use_filename=False,
        )
    except Exception as e:
        print("Cloudinary error:", e)
        raise HTTPException(500, "Failed to upload file. Try again.")

    resume_url = result["secure_url"]

    # 6. Save to DB (🔥 upgraded)
    await users_collection.update_one(
        {"_id": db_user["_id"]},
        {"$set": {
            "has_resume": True,
            "resume_url": resume_url,
            "resume_filename": file.filename,
            "resume_text": resume_text,   # 🔥 key addition
        }}
    )

    return {
        "message": "Resume uploaded successfully.",
        "resume_url": resume_url,
        "filename": file.filename,
        "text_length": len(resume_text)  # debug / optional
    }


# ── Resume Status ────────────────────────────────────────────────────────

@router.get("/status")
async def resume_status(current_user=Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found.")

    return {
        "has_resume": db_user.get("has_resume", False),
        "resume_filename": db_user.get("resume_filename"),
        "resume_url": db_user.get("resume_url"),
    }


# ── Delete Resume ────────────────────────────────────────────────────────

@router.delete("/delete")
async def delete_resume(current_user=Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found.")

    if not db_user.get("has_resume"):
        raise HTTPException(400, "No resume found.")

    # Delete from Cloudinary
    try:
        cloudinary.uploader.destroy(
            f"jobhitai/resumes/resume_{db_user['_id']}",
            resource_type="raw"
        )
    except Exception as e:
        print("Cloudinary delete error:", e)

    # Remove from DB
    await users_collection.update_one(
        {"_id": db_user["_id"]},
        {"$set": {
            "has_resume": False,
            "resume_url": None,
            "resume_filename": None,
            "resume_text": None,   # 🔥 clear text also
        }}
    )

    return {"message": "Resume deleted successfully."}


"""






# routes/resume_upload.py

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from database import users_collection, resumes_collection
from auth import get_current_user
import cloudinary
import cloudinary.uploader
import os
from datetime import datetime
from bson import ObjectId

router = APIRouter()

# ── Cloudinary config ──────────────────────────────────────────────────────────
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

ALLOWED_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}
MAX_SIZE_MB = 5


def serialize_resume(doc) -> dict:
    """Convert MongoDB resume document to JSON-serializable dict."""
    return {
        "resume_id": str(doc["_id"]),
        "user_id":   str(doc["user_id"]),
        "filename":  doc["filename"],
        "url":       doc["url"],
        "uploaded_at": doc["uploaded_at"],
    }


# ── Upload ─────────────────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    # 1. Validate type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Only PDF or Word documents are accepted.")

    # 2. Validate size
    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(400, f"File must be under {MAX_SIZE_MB} MB.")

    # 3. Get user
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found.")

    user_id = str(db_user["_id"])

    # 4. Upload to Cloudinary
    # Each file gets a unique path: jobhitai/resumes/{user_id}/{timestamp}
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    public_id = f"jobhitai/resumes/{user_id}/{timestamp}"

    try:
        # detect resource type based on file
        resource_type = "image" if file.content_type == "application/pdf" else "raw"

        result = cloudinary.uploader.upload(
        contents,
        resource_type=resource_type,
        public_id=public_id,
        overwrite=False,
        use_filename=False,
        format="pdf" if file.content_type == "application/pdf" else None,
    )
    except Exception as e:
        print("Cloudinary error:", e)
        raise HTTPException(500, "Failed to upload file. Please try again.")

    # 5. Insert into resumes collection
    resume_doc = {
        "user_id":              user_id,
        "filename":             file.filename,
        "url":                  result["secure_url"],
        "cloudinary_public_id": public_id,
        "uploaded_at":          datetime.utcnow().isoformat(),
    }

    insert_result = await resumes_collection.insert_one(resume_doc)

    # 6. Update has_resume flag on user (quick flag — no need to query resumes)
    await users_collection.update_one(
        {"_id": db_user["_id"]},
        {"$set": {"has_resume": True}}
    )

    return {
        "message": "Resume uploaded successfully.",
        "resume": {
            "resume_id": str(insert_result.inserted_id),
            **{k: v for k, v in resume_doc.items() if k != "_id"},
        }
    }


# ── List all resumes for current user ─────────────────────────────────────────

@router.get("/list")
async def list_resumes(current_user=Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found.")

    user_id = str(db_user["_id"])

    cursor = resumes_collection.find(
        {"user_id": user_id},
        sort=[("uploaded_at", -1)]      # newest first
    )
    resumes = [serialize_resume(r) async for r in cursor]

    return {"resumes": resumes, "count": len(resumes)}


# ── Delete a specific resume ───────────────────────────────────────────────────

@router.delete("/delete/{resume_id}")
async def delete_resume(resume_id: str, current_user=Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found.")

    user_id = str(db_user["_id"])

    # Find the resume — ensure it belongs to this user
    try:
        resume = await resumes_collection.find_one({
            "_id": ObjectId(resume_id),
            "user_id": user_id,
        })
    except Exception:
        raise HTTPException(400, "Invalid resume ID.")

    if not resume:
        raise HTTPException(404, "Resume not found.")

    # Delete from Cloudinary
    try:
        cloudinary.uploader.destroy(
            resume["cloudinary_public_id"],
            resource_type="raw"
        )
    except Exception as e:
        print("Cloudinary delete error:", e)

    # Delete from resumes collection
    await resumes_collection.delete_one({"_id": ObjectId(resume_id)})

    # If no resumes left, flip has_resume flag back to False
    remaining = await resumes_collection.count_documents({"user_id": user_id})
    if remaining == 0:
        await users_collection.update_one(
            {"_id": db_user["_id"]},
            {"$set": {"has_resume": False}}
        )

    return {"message": "Resume deleted successfully."}