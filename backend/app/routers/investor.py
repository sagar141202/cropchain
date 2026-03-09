from fastapi import APIRouter, HTTPException, Depends, status
from app.middleware.auth_middleware import get_current_user
from app.database import get_db
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel

router = APIRouter(prefix="/investor", tags=["Investor"])

class InvestmentCreate(BaseModel):
    proposal_id: str
    amount: float

@router.get("/proposals")
async def browse_proposals(current_user: dict = Depends(get_current_user)):
    db = get_db()
    proposals = await db.proposals.find({"status": "open"}).to_list(100)
    for p in proposals:
        p["id"] = str(p["_id"])
        del p["_id"]
    return proposals

@router.get("/proposals/{proposal_id}")
async def get_proposal_detail(proposal_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    proposal = await db.proposals.find_one({"_id": ObjectId(proposal_id)})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    proposal["id"] = str(proposal["_id"])
    del proposal["_id"]
    return proposal

@router.post("/invest", status_code=status.HTTP_201_CREATED)
async def invest_in_proposal(
    investment: InvestmentCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    proposal = await db.proposals.find_one({"_id": ObjectId(investment.proposal_id)})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    if proposal["status"] != "open":
        raise HTTPException(status_code=400, detail="Proposal is not open for investment")

    investment_doc = {
        "investor_id": str(current_user["_id"]),
        "proposal_id": investment.proposal_id,
        "amount": investment.amount,
        "status": "active",
        "created_at": datetime.utcnow()
    }
    result = await db.investments.insert_one(investment_doc)
    await db.proposals.update_one(
        {"_id": ObjectId(investment.proposal_id)},
        {"$set": {"status": "funded"}}
    )
    return {"message": "Investment successful", "investment_id": str(result.inserted_id)}

@router.get("/portfolio")
async def get_portfolio(current_user: dict = Depends(get_current_user)):
    db = get_db()
    investments = await db.investments.find(
        {"investor_id": str(current_user["_id"])}
    ).to_list(100)
    for inv in investments:
        inv["id"] = str(inv["_id"])
        del inv["_id"]
    return investments
