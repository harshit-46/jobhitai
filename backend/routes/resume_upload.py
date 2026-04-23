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