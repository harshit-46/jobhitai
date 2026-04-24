from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List


class UserSignup(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    identifier: str
    password: str


class UserBase(BaseModel):
    name: str
    email: EmailStr
    username: Optional[str] = None
    avatar: Optional[str] = None


# ── User stored in MongoDB ─────────────────────────────────────────────────────
class UserInDB(UserBase):
    password: Optional[str] = None
    providers: List[str] = Field(default=["local"])
    is_verified: bool = False
    verification_token: Optional[str] = None
    reset_token: Optional[str] = None
    reset_token_expiry: Optional[str] = None
    created_at: Optional[str] = None

    # Profile fields
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    role: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    skills: List[str] = Field(default=[])

    # Quick flag — avoids querying resumes collection on every auth check
    has_resume: bool = False


# ── Resume document — stored in resumes collection ────────────────────────────
class ResumeInDB(BaseModel):
    user_id: str                    # str(_id) of the user
    filename: str                   # original file name shown in UI
    url: str                        # Cloudinary secure_url
    cloudinary_public_id: str       # needed for deletion
    uploaded_at: str                # ISO datetime string


# ── Resume response returned to frontend ──────────────────────────────────────
class ResumeResponse(BaseModel):
    resume_id: str                  # str(_id) of the resume document
    user_id: str
    filename: str
    url: str
    uploaded_at: str


# ── Lightweight — used in auth context ────────────────────────────────────────
class UserResponse(BaseModel):
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    has_resume: bool = False


# ── Full profile — used only on profile page ──────────────────────────────────
class ProfileResponse(BaseModel):
    name: str
    email: EmailStr
    username: Optional[str] = None
    avatar: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    joined: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    skills: List[str] = Field(default=[])
    resume_count: int = 0
    providers: List[str] = Field(default=["local"])


# ── Profile update payload ────────────────────────────────────────────────────
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    skills: Optional[List[str]] = None