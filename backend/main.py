from fastapi import FastAPI, HTTPException, Response, Depends
from fastapi.middleware.cors import CORSMiddleware

from database import users_collection
from models import UserSignup, UserLogin
from auth import hash_password, verify_password, create_token, get_current_user

from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse
import os





config = Config('.env')

oauth = OAuth(config)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("JWT_SECRET_KEY")
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
    
    if db_user["provider"] != "local":
        raise HTTPException(status_code=400, detail=f"Use {db_user['provider']} login instead")

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")
    

    token = create_token({"sub": db_user["email"]})

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


# GOOGLE
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# GITHUB
oauth.register(
    name='github',
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)


@app.get("/auth/google")
async def login_google(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@app.get("/auth/google/callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    email = user_info["email"]

    # check DB
    user = await users_collection.find_one({"email": email})

    if not user:
        user = {
            "name": user_info["name"],
            "email": email,
            "provider": "google",
            "avatar": user_info.get("picture")
        }
        await users_collection.insert_one(user)

    jwt_token = create_token({"sub": email})

    response = RedirectResponse(url="http://localhost:5173/dashboard")

    response.set_cookie(
        key="token",
        value=jwt_token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
        max_age=60*60*24
    )

    return response


@app.get("/auth/github")
async def login_github(request: Request):
    redirect_uri = request.url_for("github_callback")
    return await oauth.github.authorize_redirect(request, redirect_uri)


@app.get("/auth/github/callback")
async def github_callback(request: Request):
    token = await oauth.github.authorize_access_token(request)

    resp = await oauth.github.get("user", token=token)
    user_data = resp.json()

    email = user_data.get("email")

    # GitHub may not return email directly
    if not email:
        resp = await oauth.github.get("user/emails", token=token)
        emails = resp.json()
        email = next((e["email"] for e in emails if e["primary"]), None)

    user = await users_collection.find_one({"email": email})

    if not user:
        user = {
            "name": user_data["login"],
            "email": email,
            "provider": "github",
            "avatar": user_data["avatar_url"]
        }
        await users_collection.insert_one(user)

    jwt_token = create_token({"sub": email})

    response = RedirectResponse(url="http://localhost:5173/dashboard")

    response.set_cookie(
        key="token",
        value=jwt_token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
        max_age=60*60*24
    )

    return response