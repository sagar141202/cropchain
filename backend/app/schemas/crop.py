from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CropCreate(BaseModel):
    farm_id: str
    crop_name: str
    season: str
    sowing_date: Optional[str] = None
    harvest_date: Optional[str] = None
    area_planted: float
    actual_yield: Optional[float] = None

class CropResponse(BaseModel):
    id: str
    farm_id: str
    crop_name: str
    season: str
    sowing_date: Optional[str] = None
    harvest_date: Optional[str] = None
    area_planted: float
    actual_yield: Optional[float] = None
    created_at: datetime
