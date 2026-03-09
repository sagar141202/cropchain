from fastapi import APIRouter, HTTPException
from app.services.market_service import get_market_price, calculate_roi

router = APIRouter(prefix="/market", tags=["Market"])

@router.get("/price/{crop_name}")
async def get_crop_price(crop_name: str):
    data = get_market_price(crop_name)
    if not data:
        raise HTTPException(status_code=404, detail=f"No price data for {crop_name}")
    return data

@router.get("/prices")
async def get_all_prices():
    from app.services.market_service import MOCK_MARKET_PRICES
    return [
        {"crop_name": k, "modal_price": v["modal"], "min_price": v["min"],
         "max_price": v["max"], "unit": v["unit"]}
        for k, v in MOCK_MARKET_PRICES.items()
    ]

@router.post("/roi")
async def calculate_crop_roi(
    crop_name: str,
    predicted_yield: float,
    investment_amount: float,
    input_costs: float
):
    return calculate_roi(predicted_yield, crop_name, investment_amount, input_costs)
