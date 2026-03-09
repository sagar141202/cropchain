from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_db():
    try:
        db_instance.client = AsyncIOMotorClient(settings.MONGODB_URI)
        db_instance.db = db_instance.client.cropchain
        await db_instance.client.admin.command("ping")
        logger.info("✅ Connected to MongoDB Atlas successfully")
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        raise e

async def disconnect_db():
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB connection closed")

def get_db():
    return db_instance.db
