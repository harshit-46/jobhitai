from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from auth import get_current_user
from database import users_collection

router = APIRouter()

# ─────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────

class SocialLinks(BaseModel):
    github:    Optional[str] = ""
    linkedin:  Optional[str] = ""
    portfolio: Optional[str] = ""
    twitter:   Optional[str] = ""

class ProfileUpdate(BaseModel):
    name:       Optional[str]         = None
    headline:   Optional[str]         = None   # e.g. "Frontend Dev | Open to work"
    bio:        Optional[str]         = None
    location:   Optional[str]         = None
    college:    Optional[str]         = None
    skills:     Optional[List[str]]   = None
    socials:    Optional[SocialLinks] = None
    avatar:     Optional[str]         = None   # Cloudinary URL after upload

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password:     str

# ─────────────────────────────────────────────
# GET /api/profile
# ─────────────────────────────────────────────

@router.get("")
async def get_profile(
    current_user: dict = Depends(get_current_user),
):
    user = await users_collection.find_one(
        {"email": current_user["sub"]},
        {"_id": 0, "password": 0, "verification_token": 0,
        "reset_token": 0, "reset_expires": 0}
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ─────────────────────────────────────────────
# PUT /api/profile
# ─────────────────────────────────────────────

@router.put("")
async def update_profile(
    data: ProfileUpdate,
    current_user: dict = Depends(get_current_user),
):
    update_fields = {}

    if data.name      is not None: update_fields["name"]     = data.name.strip()
    if data.headline  is not None: update_fields["headline"] = data.headline.strip()
    if data.bio       is not None: update_fields["bio"]      = data.bio.strip()
    if data.location  is not None: update_fields["location"] = data.location.strip()
    if data.college   is not None: update_fields["college"]  = data.college.strip()
    if data.avatar    is not None: update_fields["avatar"]   = data.avatar.strip()
    if data.skills    is not None: update_fields["skills"]   = [s.strip() for s in data.skills if s.strip()]
    if data.socials   is not None: update_fields["socials"]  = data.socials.model_dump()

    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    await users_collection.update_one(
        {"email": current_user["sub"]},
        {"$set": update_fields}
    )
    return {"message": "Profile updated successfully"}

# ─────────────────────────────────────────────
# POST /api/profile/change-password
# ─────────────────────────────────────────────

@router.post("/change-password")
async def change_password(
    data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
):
    from auth import verify_password, hash_password

    user = await users_collection.find_one({"email": current_user["sub"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # OAuth users have no password
    if "password" not in user:
        raise HTTPException(
            status_code=400,
            detail="Password change is not available for social login accounts"
        )

    if not verify_password(data.current_password, user["password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")

    await users_collection.update_one(
        {"email": current_user["sub"]},
        {"$set": {"password": hash_password(data.new_password)}}
    )
    return {"message": "Password changed successfully"}

# ─────────────────────────────────────────────
# DELETE /api/profile/account
# ─────────────────────────────────────────────

@router.delete("/account")
async def delete_account(
    current_user: dict = Depends(get_current_user),
):
    from database import get_db
    import inspect

    user = await users_collection.find_one({"email": current_user["sub"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete user document
    await users_collection.delete_one({"email": current_user["sub"]})

    return {"message": "Account deleted successfully"}