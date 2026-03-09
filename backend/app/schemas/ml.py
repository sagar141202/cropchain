from pydantic import BaseModel
from typing import Optional

class YieldPredictRequest(BaseModel):
    crop_name: str
    area_acres: float
    soil_type: str
    irrigation_type: str
    season: str
    state: str
    avg_rainfall: Optional[float] = None
    avg_temp: Optional[float] = None

class YieldPredictResponse(BaseModel):
    predicted_yield: float
    confidence_min: float
    confidence_max: float
    unit: str = "quintals"
    crop_name: str
    area_acres: float

class FairPriceRequest(BaseModel):
    crop_name: str
    market_name: str
    state: str
    offered_price: float

class FairPriceResponse(BaseModel):
    crop_name: str
    offered_price: float
    modal_price: float
    deviation_percent: float
    is_anomaly: bool
    severity: str
    anomaly_score: float
    recommendation: str
