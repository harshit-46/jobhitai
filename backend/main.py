from fastapi import FastAPI, HTTPException, Response, Request, Depends
from fastapi.middleware.cors import CORSMiddleware

from database import users_collection
from models import UserSignup, UserLogin
from auth import hash_password, verify_password, create_token, get_current_user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "API running 🚀"}

@app.get("/api/me")
async def get_me(user=Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": user["sub"]})

    return {
        "name": db_user["name"],
        "email": db_user["email"]
    }

# 📝 Signup
@app.post("/api/signup")
async def signup(user: UserSignup, response: Response):
    existing_user = await users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(user.password)

    await users_collection.insert_one({
        "name": user.name,
        "username" : user.username,
        "email": user.email,
        "password": hashed_password
    })

    token = create_token({"sub": user.email})

    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=False,    
        samesite="lax",
        max_age=60 * 60 * 24,
        path="/"
    )

    return {"message": "User created successfully"}

@app.post("/api/login")
async def login(user: UserLogin, response: Response):

    # 🔍 find by email OR username
    db_user = await users_collection.find_one({
        "$or": [
            {"email": user.identifier},
            {"username": user.identifier}  # or username field
        ]
    })

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_token({"sub": db_user[email]})

    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
        max_age = 60*60*24
    )

    return {"message": "Login successful"}

@app.get("/api/dashboard")
async def dashboard(user=Depends(get_current_user)):
    return {
        "message": f"Welcome {user['sub']}"
    }

@app.post("/api/logout")
async def logout(response: Response):
    response.delete_cookie("token" , path="/")
    return {"message": "Logged out successfully"}