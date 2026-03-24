from fastapi import FastAPI, HTTPException, Response, Request, Depends
from fastapi.middleware.cors import CORSMiddleware

from database import users_collection
from models import UserSignup, UserLogin
from auth import hash_password, verify_password, create_token, get_current_user

app = FastAPI()

# 🌐 CORS (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ Root
@app.get("/")
async def root():
    return {"message": "API running 🚀"}


# 📝 Signup
@app.post("/api/signup")
async def signup(user: UserSignup, response: Response):
    existing_user = await users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(user.password)

    await users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    })

    token = create_token({"email": user.email})

    # 🍪 Set cookie
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=False,       # True in production (HTTPS)
        samesite="lax",
        max_age=60 * 60 * 24  # 1 day
    )

    return {"message": "User created successfully"}


# 🔐 Login
@app.post("/api/login")
async def login(user: UserLogin, response: Response):
    db_user = await users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_token({"email": user.email})

    # 🍪 Set cookie
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24
    )

    return {"message": "Login successful"}


# 🔒 Protected Route
@app.get("/dashboard")
async def dashboard(user=Depends(get_current_user)):
    return {
        "message": f"Welcome {user['sub']}"
    }


# 🚪 Logout
@app.post("/logout")
async def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out successfully"}