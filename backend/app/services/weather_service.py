import httpx
from typing import Optional
from app.config import settings

async def get_weather_data(lat: float, lng: float) -> dict:
    url = settings.OPEN_METEO_BASE_URL
    params = {
        "latitude": lat,
        "longitude": lng,
        "daily": "precipitation_sum,temperature_2m_max,temperature_2m_min",
        "timezone": "Asia/Kolkata",
        "past_days": 90
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, timeout=10.0)
        response.raise_for_status()
        data = response.json()

    daily = data.get("daily", {})
    precipitation = daily.get("precipitation_sum", [])
    temp_max = daily.get("temperature_2m_max", [])
    temp_min = daily.get("temperature_2m_min", [])

    avg_rainfall = sum(p for p in precipitation if p is not None) / max(len(precipitation), 1)
    avg_temp_max = sum(t for t in temp_max if t is not None) / max(len(temp_max), 1)
    avg_temp_min = sum(t for t in temp_min if t is not None) / max(len(temp_min), 1)
    avg_temp = (avg_temp_max + avg_temp_min) / 2

    return {
        "avg_rainfall_mm": round(avg_rainfall, 2),
        "avg_temp_celsius": round(avg_temp, 2),
        "avg_temp_max": round(avg_temp_max, 2),
        "avg_temp_min": round(avg_temp_min, 2),
        "data_days": len(precipitation)
    }

def get_state_coordinates(state: str) -> tuple:
    state_coords = {
        "andhra_pradesh": (15.9129, 79.7400),
        "haryana": (29.0588, 76.0856),
        "punjab": (31.1471, 75.3412),
        "maharashtra": (19.7515, 75.7139),
        "karnataka": (15.3173, 75.7139),
        "tamil_nadu": (11.1271, 78.6569),
        "telangana": (18.1124, 79.0193),
        "uttar_pradesh": (26.8467, 80.9462),
        "madhya_pradesh": (22.9734, 78.6569),
        "rajasthan": (27.0238, 74.2179),
        "gujarat": (22.2587, 71.1924),
        "west_bengal": (22.9868, 87.8550),
        "bihar": (25.0961, 85.3131),
        "odisha": (20.9517, 85.0985),
    }
    return state_coords.get(state.lower().replace(" ", "_"), (20.5937, 78.9629))
