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

PDF_MIME = "application/pdf"


def serialize_resume(doc) -> dict:
    return {
        "resume_id":  str(doc["_id"]),
        "user_id":    str(doc["user_id"]),
        "filename":   doc["filename"],
        "url":        doc["url"],
        "mime_type":  doc.get("mime_type", "application/pdf"),
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
    is_pdf  = file.content_type == PDF_MIME

    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    public_id = f"jobhitai/resumes/{user_id}/{timestamp}"

    # 4. Upload to Cloudinary
    # PDFs use resource_type="image" — enables inline rendering in browser
    # DOC/DOCX use resource_type="raw" — no rendering support
    try:
        result = cloudinary.uploader.upload(
            contents,
            resource_type="image" if is_pdf else "raw",
            public_id=public_id,
            overwrite=False,
            use_filename=False,
            # Keep pdf format explicitly so Cloudinary doesn't rename it
            format="pdf" if is_pdf else None,
            access_mode="public"
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
        "mime_type":            file.content_type,
        "uploaded_at":          datetime.utcnow().isoformat(),
    }

    insert_result = await resumes_collection.insert_one(resume_doc)

    # 6. Update has_resume flag
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


# ── List ───────────────────────────────────────────────────────────────────────

@router.get("/list")
async def list_resumes(current_user=Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found.")

    user_id = str(db_user["_id"])
    cursor  = resumes_collection.find(
        {"user_id": user_id},
        sort=[("uploaded_at", -1)]
    )
    resumes = [serialize_resume(r) async for r in cursor]

    return {"resumes": resumes, "count": len(resumes)}


# ── Delete ─────────────────────────────────────────────────────────────────────

@router.delete("/delete/{resume_id}")
async def delete_resume(resume_id: str, current_user=Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found.")

    user_id = str(db_user["_id"])

    try:
        resume = await resumes_collection.find_one({
            "_id":     ObjectId(resume_id),
            "user_id": user_id,
        })
    except Exception:
        raise HTTPException(400, "Invalid resume ID.")

    if not resume:
        raise HTTPException(404, "Resume not found.")

    # Determine resource_type for Cloudinary deletion
    is_pdf        = resume.get("mime_type", PDF_MIME) == PDF_MIME
    resource_type = "image" if is_pdf else "raw"

    try:
        cloudinary.uploader.destroy(
            resume["cloudinary_public_id"],
            resource_type=resource_type
        )
    except Exception as e:
        print("Cloudinary delete error:", e)

    await resumes_collection.delete_one({"_id": ObjectId(resume_id)})

    # Flip has_resume if no resumes left
    remaining = await resumes_collection.count_documents({"user_id": user_id})
    if remaining == 0:
        await users_collection.update_one(
            {"_id": db_user["_id"]},
            {"$set": {"has_resume": False}}
        )

    return {"message": "Resume deleted successfully."}