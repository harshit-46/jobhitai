"""

from fastapi import FastAPI, HTTPException, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from database import users_collection
from models import UserSignup, UserLogin
from auth import hash_password, verify_password, create_token, get_current_user

from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse
import os

from routes.resume import router as resumebuilder_router # Resume Builder

# -------------------- CONFIG --------------------
config = Config('.env')
oauth = OAuth(config)

prodURL = "https://jobhitai.vercel.app/dashboard"

app = FastAPI()

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://jobhitai.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- SESSION --------------------
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("JWT_SECRET_KEY")
)

#Registering routes
app.include_router(resumebuilder_router , prefix="/resume-builder", tags=["resume"])

# -------------------- ROOT --------------------
@app.get("/")
async def root():
    return {"message": "API running 🚀"}

# -------------------- GET ME --------------------
@app.get("/api/me")
async def get_me(user=Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": user["sub"]})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "name": db_user["name"],
        "email": db_user["email"]
    }

# -------------------- SIGNUP --------------------
@app.post("/api/signup")
async def signup(user: UserSignup, response: Response):
    try:
        existing_user = await users_collection.find_one({"email": user.email})

        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_password = hash_password(user.password)

        await users_collection.insert_one({
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "providers": ["local"],  # ✅ updated
            "password": hashed_password,
            "created_at": datetime.utcnow()
        })

        token = create_token({"sub": user.email})

        response.set_cookie(
            key="token",
            value=token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=60 * 60 * 24,
            path="/"
        )

        return {"message": "User created successfully"}

    except Exception as e:
        print("Signup Error:", e)
        raise HTTPException(status_code=500, detail="Signup failed")
@app.post("/api/login")
async def login(user: UserLogin, response: Response):
    try:
        db_user = await users_collection.find_one({
            "$or": [
                {"email": user.identifier},
                {"username": user.identifier}
            ]
        })

        # ✅ Check user exists
        if not db_user:
            raise HTTPException(status_code=400, detail="User not found")

        # ✅ Check if local login allowed
        if "local" not in db_user.get("providers", []):
            raise HTTPException(
                status_code=400,
                detail="This account uses Google/GitHub login"
            )

        # ✅ Ensure password exists
        if "password" not in db_user:
            raise HTTPException(
                status_code=400,
                detail="Password login not available for this account"
            )

        # ✅ Verify password
        if not verify_password(user.password, db_user["password"]):
            raise HTTPException(status_code=400, detail="Invalid password")

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

    except HTTPException:
        raise
    except Exception as e:
        print("Login Error:", e)
        raise HTTPException(status_code=500, detail="Login failed")

# -------------------- DASHBOARD --------------------
@app.get("/api/dashboard")
async def dashboard(user=Depends(get_current_user)):
    return {
        "message": f"Welcome {user['sub']}"
    }

# -------------------- LOGOUT --------------------
@app.post("/api/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="token",
        path="/",
        samesite="none",
        secure=True
    )
    return {"message": "Logged out successfully"}

# -------------------- GOOGLE AUTH --------------------
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

# -------------------- GOOGLE CALLBACK --------------------
@app.get("/auth/google/callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    email = user_info["email"]

    user = await users_collection.find_one({"email": email})

    if user:
        # ✅ LINK GOOGLE if not already linked
        if "google" not in user.get("providers", []):
            await users_collection.update_one(
                {"email": email},
                {"$push": {"providers": "google"}}
            )
    else:
        # ✅ CREATE NEW USER
        user = {
            "name": user_info["name"],
            "email": email,
            "providers": ["google"],
            "avatar": user_info.get("picture"),
            "created_at": datetime.utcnow()
        }
        await users_collection.insert_one(user)

    jwt_token = create_token({"sub": email})

    response = RedirectResponse(
        url= prodURL
    )

    response.set_cookie(
        key="token",
        value=jwt_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=60 * 60 * 24
    )

    return response

# -------------------- GITHUB AUTH --------------------
oauth.register(
    name='github',
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)

# -------------------- GITHUB CALLBACK --------------------
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

    if user:
        # ✅ LINK GITHUB
        if "github" not in user.get("providers", []):
            await users_collection.update_one(
                {"email": email},
                {"$push": {"providers": "github"}}
            )
    else:
        # ✅ CREATE NEW USER
        user = {
            "name": user_data["login"],
            "email": email,
            "providers": ["github"],
            "avatar": user_data["avatar_url"],
            "created_at": datetime.utcnow()
        }
        await users_collection.insert_one(user)

    jwt_token = create_token({"sub": email})

    response = RedirectResponse(
        url= prodURL
    )

    response.set_cookie(
        key="token",
        value=jwt_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=60 * 60 * 24
    )

    return response

"""


from fastapi import FastAPI, HTTPException, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os

from database import users_collection
from models import UserSignup, UserLogin
from auth import hash_password, verify_password, create_token, get_current_user

from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse

from routes.resume import router as resumebuilder_router
from routes.career import router as career_router

# ---------------- CONFIG ----------------
config = Config('.env')
oauth = OAuth(config)

FRONTEND_URL = os.getenv("FRONTEND_URL")

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- SESSION ----------------
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("JWT_SECRET_KEY")
)

# ---------------- ROUTES ----------------
app.include_router(resumebuilder_router, prefix="/resume-builder", tags=["resume"])
app.include_router(career_router , prefix="/career" , tags=["career"])

# ---------------- ROOT ----------------
@app.get("/")
async def root():
    return {"message": "API running 🚀"}

# ---------------- AUTH ----------------
@app.post("/api/signup")
async def signup(user: UserSignup, response: Response):
    existing_user = await users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(user.password)

    await users_collection.insert_one({
        "name": user.name,
        "username": user.username,
        "email": user.email,
        "providers": ["local"],
        "password": hashed_password,
        "created_at": datetime.utcnow()
    })

    token = create_token({"sub": user.email})

    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=60 * 60 * 24
    )

    return {"message": "User created successfully"}


@app.post("/api/login")
async def login(user: UserLogin, response: Response):
    db_user = await users_collection.find_one({
        "$or": [
            {"email": user.identifier},
            {"username": user.identifier}
        ]
    })

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

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


@app.get("/api/me")
async def get_me(user=Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": user["sub"]})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "name": db_user["name"],
        "email": db_user["email"]
    }


@app.post("/api/logout")
async def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out successfully"}


# -------------------- GOOGLE AUTH --------------------
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

# -------------------- GOOGLE CALLBACK --------------------
@app.get("/auth/google/callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    email = user_info["email"]

    user = await users_collection.find_one({"email": email})

    if user:
        # ✅ LINK GOOGLE if not already linked
        if "google" not in user.get("providers", []):
            await users_collection.update_one(
                {"email": email},
                {"$push": {"providers": "google"}}
            )
    else:
        # ✅ CREATE NEW USER
        user = {
            "name": user_info["name"],
            "email": email,
            "providers": ["google"],
            "avatar": user_info.get("picture"),
            "created_at": datetime.utcnow()
        }
        await users_collection.insert_one(user)

    jwt_token = create_token({"sub": email})

    response = RedirectResponse(
        url= "https://jobhitai.vercel.app/dashboard"
    )

    response.set_cookie(
        key="token",
        value=jwt_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=60 * 60 * 24
    )

    return response

# -------------------- GITHUB AUTH --------------------
oauth.register(
    name='github',
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)

# -------------------- GITHUB CALLBACK --------------------
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

    if user:
        # ✅ LINK GITHUB
        if "github" not in user.get("providers", []):
            await users_collection.update_one(
                {"email": email},
                {"$push": {"providers": "github"}}
            )
    else:
        # ✅ CREATE NEW USER
        user = {
            "name": user_data["login"],
            "email": email,
            "providers": ["github"],
            "avatar": user_data["avatar_url"],
            "created_at": datetime.utcnow()
        }
        await users_collection.insert_one(user)

    jwt_token = create_token({"sub": email})

    response = RedirectResponse(
        url= "https://jobhitai.vercel.app/dashboard"
    )

    response.set_cookie(
        key="token",
        value=jwt_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=60 * 60 * 24
    )

    return response