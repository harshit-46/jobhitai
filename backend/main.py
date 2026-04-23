from fastapi import FastAPI, HTTPException, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import os
import secrets

from database import users_collection
from models import UserSignup, UserLogin
from auth import hash_password, verify_password, create_token, get_current_user

from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse

from pydantic import BaseModel

from utils.email import send_verification_email , send_reset_email

from routes.resume import router as resumebuilder_router
from routes.career import router as career_router
from routes.ml_routes import router as ml_router
from routes.resume_upload import router as resume_upload_router

# ---------------- CONFIG ----------------
config = Config('.env')
oauth = OAuth(config)

FRONTEND_URL = os.getenv("FRONTEND_URL")

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- SESSION (FIXED) ----------------
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("JWT_SECRET_KEY"),
    same_site="none",     
    https_only=True       
)

# ---------------- ROUTES (UNCHANGED) ----------------
app.include_router(resumebuilder_router, prefix="/resume-builder", tags=["resume"])
app.include_router(career_router, prefix="/api/career", tags=["career"])
app.include_router(ml_router)
app.include_router(resume_upload_router, prefix="/api/resume", tags=["resume-upload"])

# ---------------- UTILS ----------------
def generate_token():
    return secrets.token_urlsafe(32)

# ---------------- SCHEMAS ----------------
class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ---------------- ROOT ----------------
@app.get("/")
async def root():
    return {"message": "API running"}

# ---------------- SIGNUP ----------------
@app.post("/api/signup")
async def signup(user: UserSignup):
    existing_user = await users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(400, "User already exists")

    hashed_password = hash_password(user.password)
    verification_token = generate_token()

    await users_collection.insert_one({
        "name": user.name,
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "providers": ["local"],
        "is_verified": False,
        "verification_token": verification_token,
        "created_at": datetime.utcnow()
    })

    try:
        send_verification_email(user.email, verification_token, FRONTEND_URL)
    except Exception as e:
        print("Email error:", e)

    return {"message": "Signup successful. Please verify your email"}

# ---------------- LOGIN ----------------
@app.post("/api/login")
async def login(user: UserLogin, response: Response):
    db_user = await users_collection.find_one({
        "$or": [
            {"email": user.identifier},
            {"username": user.identifier}
        ]
    })

    if not db_user:
        raise HTTPException(400, "User not found")

    if "password" not in db_user:
        raise HTTPException(
            400,
            f"This account is associated with {db_user['providers'][0]} login"
        )

    if not db_user.get("is_verified", False):
        raise HTTPException(400, "Please verify your email")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(400, "Invalid password")

    token = create_token({"sub": db_user["email"]})

    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=60 * 60 * 24
    )

    return {"message": "Login successful"}

# ---------------- VERIFY EMAIL ----------------
@app.get("/api/verify-email")
async def verify_email(token: str):
    user = await users_collection.find_one({"verification_token": token})

    if not user:
        raise HTTPException(400, "Invalid or expired token")

    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"is_verified": True},
            "$unset": {"verification_token": ""}
        }
    )

    return {"message": "Email verified successfully"}

# ---------------- FORGOT PASSWORD ----------------
@app.post("/api/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    user = await users_collection.find_one({"email": data.email})

    # ✅ security (don’t reveal existence)
    if not user:
        return {"message": "If this email exists, a reset link has been sent"}

    token = generate_token()

    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "reset_token": token,
                "reset_expires": datetime.utcnow() + timedelta(minutes=30)
            }
        }
    )

    send_reset_email(data.email, token, FRONTEND_URL)

    return {"message": "Reset email sent"}

# ---------------- RESET PASSWORD ----------------
@app.post("/api/reset-password")
async def reset_password(data: ResetPasswordRequest):
    user = await users_collection.find_one({"reset_token": data.token})

    if not user:
        raise HTTPException(400, "Invalid token")

    if datetime.utcnow() > user["reset_expires"]:
        raise HTTPException(400, "Token expired")

    hashed = hash_password(data.new_password)

    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"password": hashed},
            "$unset": {"reset_token": "", "reset_expires": ""}
        }
    )

    return {"message": "Password updated successfully"}

# ---------------- ME ----------------
@app.get("/api/me")
async def get_me(user=Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": user["sub"]})

    if not db_user:
        raise HTTPException(404, "User not found")

    return {
        "name": db_user["name"],
        "email": db_user["email"],
        "has_resume": db_user.get("has_resume", False)
    }

# ---------------- LOGOUT ----------------
@app.post("/api/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="token",
        path="/",
        secure=True,
        samesite="none",
        httponly=True
    )
    return {"message": "Logged out successfully"}

# ---------------- GOOGLE ----------------
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@app.get("/auth/google")
async def login_google(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/google/callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)

    resp = await oauth.google.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        token=token
    )
    user_info = resp.json()

    email = user_info["email"]

    user = await users_collection.find_one({"email": email})

    if not user:
        await users_collection.insert_one({
            "name": user_info["name"],
            "email": email,
            "providers": ["google"],
            "avatar": user_info.get("picture"),
            "is_verified": True,
            "created_at": datetime.utcnow()
        })

    jwt_token = create_token({"sub": email})

    response = RedirectResponse(url=f"{FRONTEND_URL}/dashboard")

    response.set_cookie(
        key="token",
        value=jwt_token,
        httponly=True,
        secure=True,
        samesite="none"
    )

    return response

# ---------------- GITHUB ----------------
oauth.register(
    name='github',
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)

@app.get("/auth/github")
async def github_login(request: Request):
    redirect_uri = request.url_for("github_callback")
    return await oauth.github.authorize_redirect(request, redirect_uri)

@app.get("/auth/github/callback")
async def github_callback(request: Request):
    token = await oauth.github.authorize_access_token(request)

    resp = await oauth.github.get("user", token=token)
    user_data = resp.json()

    email = user_data.get("email")

    if not email:
        resp = await oauth.github.get("user/emails", token=token)
        emails = resp.json()
        email = next((e["email"] for e in emails if e["primary"]), None)

    user = await users_collection.find_one({"email": email})

    if not user:
        await users_collection.insert_one({
            "name": user_data["login"],
            "email": email,
            "providers": ["github"],
            "avatar": user_data["avatar_url"],
            "created_at": datetime.utcnow()
        })

    jwt_token = create_token({"sub": email})

    response = RedirectResponse(f"{FRONTEND_URL}/dashboard")

    response.set_cookie(
        key="token",
        value=jwt_token,
        httponly=True,
        secure=True,
        samesite="none"
    )

    return response