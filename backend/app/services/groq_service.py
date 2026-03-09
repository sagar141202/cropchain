from groq import Groq
from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

LANGUAGE_INSTRUCTIONS = {
    "en": "Respond in English.",
    "hi": "हिंदी में जवाब दें।",
    "te": "తెలుగులో సమాధానం ఇవ్వండి.",
    "kn": "ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ.",
    "ta": "தமிழில் பதிலளிக்கவும்.",
    "mr": "मराठीत उत्तर द्या."
}

async def generate_proposal(
    farmer_name: str,
    crop_name: str,
    area_acres: float,
    predicted_yield: float,
    investment_ask: float,
    roi_percent: float,
    state: str,
    language: str = "en"
) -> str:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])

    prompt = f"""You are an agricultural investment proposal writer helping Indian farmers.
{lang_instruction}

Write a professional investor pitch proposal for the following farm:

Farmer: {farmer_name}
Crop: {crop_name}
Farm Size: {area_acres} acres
State: {state}
Predicted Yield: {predicted_yield} quintals (ML verified)
Investment Required: ₹{investment_ask:,.0f}
Expected ROI: {roi_percent}%

The proposal should include:
1. Executive Summary
2. Farm & Crop Details
3. ML-Verified Yield Prediction
4. Financial Projections & ROI
5. Risk Mitigation
6. Call to Action

Make it professional, data-driven, and compelling for urban investors.
Keep it under 500 words."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=800,
        temperature=0.7
    )
    return response.choices[0].message.content

async def negotiation_coach(
    question: str,
    context: str,
    language: str = "en"
) -> str:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])

    prompt = f"""You are a negotiation coach helping Indian farmers deal with investors and middlemen.
{lang_instruction}

Farm context: {context}

The farmer is asking: {question}

Provide a coached response that:
1. Directly answers the question
2. Gives specific talking points
3. Includes negotiation tactics
4. Is confident and professional
Keep response under 300 words."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        temperature=0.7
    )
    return response.choices[0].message.content

async def generate_price_negotiation_script(
    crop_name: str,
    offered_price: float,
    modal_price: float,
    deviation_percent: float,
    language: str = "en"
) -> str:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])

    prompt = f"""You are helping an Indian farmer negotiate a better price with a middleman.
{lang_instruction}

Situation:
- Crop: {crop_name}
- Middleman offered: ₹{offered_price}/quintal
- Fair market price: ₹{modal_price}/quintal
- Farmer is being underpaid by: {deviation_percent}%

Write a negotiation script the farmer can use RIGHT NOW when talking to the middleman.
Include:
1. Opening statement
2. Price justification points
3. Counter-offer strategy
4. Walk-away threat (mention APMC mandi alternative)
Keep it conversational and practical. Under 250 words."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400,
        temperature=0.7
    )
    return response.choices[0].message.content
