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