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

class UserInDB(UserBase):
    password: Optional[str] = None

    providers: List[str] = Field(default=["local"])

    is_verified: bool = False

    verification_token: Optional[str] = None
    reset_token: Optional[str] = None
    reset_token_expiry: Optional[str] = None

    has_resume: bool = False
    resume_filename: Optional[str] = None
    resume_url: Optional[str] = None   

    created_at: Optional[str] = None

class UserResponse(BaseModel):
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    has_resume : bool = False
    resume_filename: Optional[str] = None
    resume_url: Optional[str] = None       







"""


# models.py

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


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


# ── Resume entry ───────────────────────────────────────────────────────────────
class ResumeEntry(BaseModel):
    resume_id: str
    filename: str
    url: str
    cloudinary_public_id: str
    uploaded_at: str


# ── Full user stored in MongoDB ────────────────────────────────────────────────
class UserInDB(UserBase):
    password: Optional[str] = None
    providers: List[str] = Field(default=["local"])
    is_verified: bool = False
    verification_token: Optional[str] = None
    reset_token: Optional[str] = None
    reset_token_expiry: Optional[str] = None
    created_at: Optional[str] = None

    # ── Profile fields ─────────────────────────────────────────────────────────
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    role: Optional[str] = None          # job title e.g. "Software Engineer"
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    skills: List[str] = Field(default=[])

    # ── Resume array ───────────────────────────────────────────────────────────
    resumes: List[ResumeEntry] = Field(default=[])


# ── What /api/me returns (lightweight — used in auth context) ──────────────────
class UserResponse(BaseModel):
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    has_resume: bool = False


# ── What /api/profile returns (full — used on profile page only) ───────────────
class ProfileResponse(BaseModel):
    # Identity
    name: str
    email: EmailStr
    username: Optional[str] = None
    avatar: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    joined: Optional[str] = None        # formatted from created_at

    # Contact
    phone: Optional[str] = None
    location: Optional[str] = None

    # Links
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None

    # Skills
    skills: List[str] = Field(default=[])

    # Resume stats (derived)
    resume_count: int = 0

    # Auth
    providers: List[str] = Field(default=["local"])


# ── What PUT /api/profile accepts ─────────────────────────────────────────────
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



"""