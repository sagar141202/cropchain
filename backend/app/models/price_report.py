from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class PriceReportModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    crop_name: str
    market_name: str
    state: str
    date: str
    modal_price: float
    min_price: float
    max_price: float
    offered_price: Optional[float] = None
    is_anomaly: bool = False
    anomaly_score: Optional[float] = None
    severity: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
