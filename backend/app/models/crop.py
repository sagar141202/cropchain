from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date
from bson import ObjectId
from app.models.user import PyObjectId

class CropModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    farm_id: str
    crop_name: str
    season: str
    sowing_date: Optional[str] = None
    harvest_date: Optional[str] = None
    area_planted: float
    actual_yield: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
