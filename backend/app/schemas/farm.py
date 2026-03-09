from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FarmCreate(BaseModel):
    name: str
    location: str
    area_acres: float
    soil_type: str
    irrigation_type: str
    lat: Optional[float] = None
    lng: Optional[float] = None

class FarmUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    area_acres: Optional[float] = None
    soil_type: Optional[str] = None
    irrigation_type: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class FarmResponse(BaseModel):
    id: str
    user_id: str
    name: str
    location: str
    area_acres: float
    soil_type: str
    irrigation_type: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    created_at: datetime
