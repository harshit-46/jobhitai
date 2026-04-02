import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI")

#if not MONGO_URI:
    #raise Exception("MONGO_URI is not set in environment variables")

client = AsyncIOMotorClient(MONGO_URI)
db = client["jobhitai"]

def get_db():
    return db

users_collection = db["users"]