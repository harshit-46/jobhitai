from pydantic import BaseModel, EmailStr

# Signup Model
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str


# Login Model
class UserLogin(BaseModel):
    email: EmailStr
    password: str