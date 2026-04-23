"""

# Claude version only upload
# routes/resume_upload.py

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from database import users_collection
from auth import get_current_user
import cloudinary
import cloudinary.uploader
import os

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


# ── Upload endpoint ────────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    # 1. Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Only PDF or Word documents are accepted.")

    # 2. Validate file size
    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(400, f"File must be under {MAX_SIZE_MB} MB.")

    # 3. Get user from DB
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found.")

    # 4. Upload to Cloudinary
    # raw resource_type handles PDF/DOC files (not images)
    # public_id scoped per user so each upload overwrites the previous one
    try:
        result = cloudinary.uploader.upload(
            contents,
            resource_type="raw",
            folder="jobhitai/resumes",
            public_id=f"resume_{db_user['_id']}",
            overwrite=True,
            use_filename=False,
        )
    except Exception as e:
        print("Cloudinary error:", e)
        raise HTTPException(500, "Failed to upload file. Please try again.")

    resume_url = result["secure_url"]

    # 5. Update user document
    await users_collection.update_one(
        {"_id": db_user["_id"]},
        {"$set": {
            "has_resume": True,
            "resume_url": resume_url,
            "resume_filename": file.filename,
        }}
    )

    return {
        "message": "Resume uploaded successfully.",
        "resume_url": resume_url,
        "filename": file.filename,
    }


# ── Get resume status ──────────────────────────────────────────────────────────

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


# ── Delete resume ──────────────────────────────────────────────────────────────

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

    # Clear from DB
    await users_collection.update_one(
        {"_id": db_user["_id"]},
        {"$set": {
            "has_resume": False,
            "resume_url": None,
            "resume_filename": None,
        }}
    )

    return {"message": "Resume deleted successfully."}


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