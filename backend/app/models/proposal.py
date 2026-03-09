from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class ProposalModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    farmer_id: str
    crop_id: Optional[str] = None
    title: str
    description: str
    amount_requested: float
    expected_yield: float
    roi_percent: float
    status: str = "draft"
    language: str = "en"
    generated_pitch: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
