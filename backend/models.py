"""

# Lst working File

from pydantic import BaseModel, EmailStr, Field
from typing import Optional

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

    provider: str = Field(default="local")  

    provider_id: Optional[str] = None

    is_verified: Optional[bool] = False
    created_at: Optional[str] = None

class UserResponse(BaseModel):
    name: str
    email: EmailStr
    avatar: Optional[str] = None

"""

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

    created_at: Optional[str] = None


class UserResponse(BaseModel):
    name: str
    email: EmailStr
    avatar: Optional[str] = None