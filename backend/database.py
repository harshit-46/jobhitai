import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
db = client["jobhitai"]

def get_db():
    return db

users_collection    = db["users"]
resumes_collection  = db["resumes"]     # separate collection for resume storage
created_resume_collection = db["built_resumes"]