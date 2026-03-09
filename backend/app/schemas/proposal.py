from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProposalCreate(BaseModel):
    crop_id: Optional[str] = None
    title: str
    description: str
    amount_requested: float
    expected_yield: float
    roi_percent: float
    language: str = "en"

class ProposalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    amount_requested: Optional[float] = None
    status: Optional[str] = None

class ProposalResponse(BaseModel):
    id: str
    farmer_id: str
    crop_id: Optional[str] = None
    title: str
    description: str
    amount_requested: float
    expected_yield: float
    roi_percent: float
    status: str
    language: str
    generated_pitch: Optional[str] = None
    created_at: datetime
