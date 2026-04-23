# routes/profile.py

from fastapi import APIRouter, HTTPException, Depends
from database import users_collection
from auth import get_current_user
from models import ProfileResponse, ProfileUpdate

router = APIRouter()


def format_joined(created_at) -> str:
    """Convert MongoDB datetime or ISO string to 'Month YYYY'."""
    if not created_at:
        return ""
    try:
        if hasattr(created_at, "strftime"):
            # it's a datetime object
            return created_at.strftime("%B %Y")
        # it's a string — parse it
        from datetime import datetime
        dt = datetime.fromisoformat(str(created_at))
        return dt.strftime("%B %Y")
    except Exception:
        return str(created_at)


# ── GET /api/profile ───────────────────────────────────────────────────────────

@router.get("", response_model=ProfileResponse)
async def get_profile(current_user=Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": current_user["sub"]})

    if not db_user:
        raise HTTPException(404, "User not found.")

    resumes = db_user.get("resumes", [])

    return {
        # Identity
        "name":         db_user.get("name", ""),
        "email":        db_user.get("email", ""),
        "username":     db_user.get("username"),
        "avatar":       db_user.get("avatar"),
        "role":         db_user.get("role"),
        "bio":          db_user.get("bio"),
        "joined":       format_joined(db_user.get("created_at")),

        # Contact
        "phone":        db_user.get("phone"),
        "location":     db_user.get("location"),

        # Links
        "linkedin":     db_user.get("linkedin"),
        "github":       db_user.get("github"),
        "portfolio":    db_user.get("portfolio"),

        # Skills
        "skills":       db_user.get("skills", []),

        # Resume stats — derived from array
        "resume_count": len(resumes),

        # Auth
        "providers":    db_user.get("providers", ["local"]),
    }


# ── PUT /api/profile ───────────────────────────────────────────────────────────

@router.put("")
async def update_profile(data: ProfileUpdate, current_user=Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": current_user["sub"]})

    if not db_user:
        raise HTTPException(404, "User not found.")

    # Only update fields that were actually sent (not None)
    updates = {k: v for k, v in data.model_dump().items() if v is not None}

    if not updates:
        raise HTTPException(400, "No fields to update.")

    await users_collection.update_one(
        {"_id": db_user["_id"]},
        {"$set": updates}
    )

    return {"message": "Profile updated successfully."}