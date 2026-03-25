from pydantic import BaseModel, EmailStr

# Signup Model
class UserSignup(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str


# Login Model
class UserLogin(BaseModel):
    identifier: str
    password: str