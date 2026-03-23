from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import users_collection
from models import UserSignup, UserLogin
from auth import hash_password, verify_password, create_token

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root
@app.get("/")
async def root():
    return {"message": "API running 🚀"}


# ✅ Signup Route
@app.post("/signup")
async def signup(user: UserSignup):
    existing_user = await users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(user.password)

    await users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    })

    # ✅ create token immediately
    token = create_token({"email": user.email})

    return {
        "message": "User created successfully",
        "token": token
    }


# ✅ Login Route
@app.post("/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_token({"email": user.email})

    return {
        "message": "Login successful",
        "token": token
    }