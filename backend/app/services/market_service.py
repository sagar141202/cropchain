from typing import Optional
from datetime import datetime

MOCK_MARKET_PRICES = {
    "wheat": {"modal": 2200, "min": 1900, "max": 2500, "unit": "quintal"},
    "rice": {"modal": 2800, "min": 2400, "max": 3200, "unit": "quintal"},
    "maize": {"modal": 1800, "min": 1500, "max": 2100, "unit": "quintal"},
    "cotton": {"modal": 6500, "min": 5800, "max": 7200, "unit": "quintal"},
    "sugarcane": {"modal": 350, "min": 300, "max": 400, "unit": "quintal"},
    "soybean": {"modal": 4200, "min": 3800, "max": 4600, "unit": "quintal"},
    "groundnut": {"modal": 5500, "min": 4800, "max": 6200, "unit": "quintal"},
    "tomato": {"modal": 1200, "min": 800, "max": 1800, "unit": "quintal"},
    "onion": {"modal": 1500, "min": 1000, "max": 2200, "unit": "quintal"},
    "potato": {"modal": 1100, "min": 800, "max": 1500, "unit": "quintal"},
    "mustard": {"modal": 5200, "min": 4800, "max": 5600, "unit": "quintal"},
    "chickpea": {"modal": 5800, "min": 5200, "max": 6400, "unit": "quintal"},
    "turmeric": {"modal": 8500, "min": 7500, "max": 9500, "unit": "quintal"},
    "chilli": {"modal": 9000, "min": 7500, "max": 11000, "unit": "quintal"},
}

def get_market_price(crop_name: str) -> Optional[dict]:
    key = crop_name.lower().strip()
    price_data = MOCK_MARKET_PRICES.get(key)
    if not price_data:
        return None
    return {
        "crop_name": crop_name,
        "modal_price": price_data["modal"],
        "min_price": price_data["min"],
        "max_price": price_data["max"],
        "unit": price_data["unit"],
        "source": "Agmarknet (mock)",
        "date": datetime.utcnow().strftime("%Y-%m-%d")
    }

def calculate_roi(
    predicted_yield: float,
    crop_name: str,
    investment_amount: float,
    input_costs: float
) -> dict:
    price_data = get_market_price(crop_name)
    if not price_data:
        modal_price = 2000
    else:
        modal_price = price_data["modal_price"]

    expected_revenue = predicted_yield * (modal_price / 100)
    net_profit = expected_revenue - input_costs
    roi_percent = ((net_profit) / investment_amount * 100) if investment_amount > 0 else 0

    return {
        "expected_revenue": round(expected_revenue, 2),
        "input_costs": round(input_costs, 2),
        "net_profit": round(net_profit, 2),
        "roi_percent": round(roi_percent, 2),
        "modal_price_per_quintal": modal_price,
        "predicted_yield_quintals": predicted_yield
    }
