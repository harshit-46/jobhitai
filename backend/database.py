from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection URL
MONGO_URL = "mongodb://localhost:27017"

# Create client
client = AsyncIOMotorClient(MONGO_URL)

# Database name
db = client["jobhit_ai"]

# Collections
users_collection = db["users"]