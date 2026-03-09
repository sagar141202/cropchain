from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.groq_service import generate_proposal, negotiation_coach, generate_price_negotiation_script
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/coach", tags=["Groq AI Coach"])

class ProposalRequest(BaseModel):
    crop_name: str
    area_acres: float
    predicted_yield: float
    investment_ask: float
    roi_percent: float
    state: str
    language: str = "en"

class CoachRequest(BaseModel):
    question: str
    context: str
    language: str = "en"

class NegotiationRequest(BaseModel):
    crop_name: str
    offered_price: float
    modal_price: float
    deviation_percent: float
    language: str = "en"

@router.post("/generate-proposal")
async def create_proposal(
    request: ProposalRequest,
    current_user: dict = Depends(get_current_user)
):
    pitch = await generate_proposal(
        farmer_name=current_user["name"],
        crop_name=request.crop_name,
        area_acres=request.area_acres,
        predicted_yield=request.predicted_yield,
        investment_ask=request.investment_ask,
        roi_percent=request.roi_percent,
        state=request.state,
        language=request.language
    )
    return {"proposal": pitch, "language": request.language}

@router.post("/negotiate")
async def get_negotiation_advice(
    request: CoachRequest,
    current_user: dict = Depends(get_current_user)
):
    advice = await negotiation_coach(
        question=request.question,
        context=request.context,
        language=request.language
    )
    return {"advice": advice, "language": request.language}

@router.post("/price-script")
async def get_price_script(
    request: NegotiationRequest,
    current_user: dict = Depends(get_current_user)
):
    script = await generate_price_negotiation_script(
        crop_name=request.crop_name,
        offered_price=request.offered_price,
        modal_price=request.modal_price,
        deviation_percent=request.deviation_percent,
        language=request.language
    )
    return {"script": script, "language": request.language}
