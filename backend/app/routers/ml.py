from fastapi import APIRouter, HTTPException, Depends
from app.schemas.ml import YieldPredictRequest, YieldPredictResponse, FairPriceRequest, FairPriceResponse
from app.services.ml_service import predict_yield, detect_price_anomaly
from app.services.weather_service import get_weather_data, get_state_coordinates
from app.services.market_service import get_market_price
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/ml", tags=["ML Models"])

@router.post("/predict-yield", response_model=YieldPredictResponse)
async def predict_crop_yield(
    request: YieldPredictRequest,
    current_user: dict = Depends(get_current_user)
):
    avg_rainfall = request.avg_rainfall
    avg_temp = request.avg_temp

    if avg_rainfall is None or avg_temp is None:
        lat, lng = get_state_coordinates(request.state)
        try:
            weather = await get_weather_data(lat, lng)
            avg_rainfall = weather["avg_rainfall_mm"]
            avg_temp = weather["avg_temp_celsius"]
        except Exception:
            avg_rainfall = avg_rainfall or 800.0
            avg_temp = avg_temp or 25.0

    result = predict_yield(
        crop_name=request.crop_name,
        area_acres=request.area_acres,
        soil_type=request.soil_type,
        irrigation_type=request.irrigation_type,
        season=request.season,
        avg_rainfall=avg_rainfall,
        avg_temp=avg_temp
    )

    return {
        **result,
        "crop_name": request.crop_name,
        "area_acres": request.area_acres
    }

@router.post("/fair-price", response_model=FairPriceResponse)
async def check_fair_price(
    request: FairPriceRequest,
    current_user: dict = Depends(get_current_user)
):
    market_data = get_market_price(request.crop_name)
    if not market_data:
        raise HTTPException(status_code=404, detail=f"No market data for {request.crop_name}")

    modal_price = market_data["modal_price"]
    result = detect_price_anomaly(
        offered_price=request.offered_price,
        modal_price=modal_price,
        crop_name=request.crop_name
    )

    return {
        "crop_name": request.crop_name,
        "offered_price": request.offered_price,
        **result
    }
