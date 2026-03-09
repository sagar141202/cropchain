from fastapi import APIRouter, HTTPException, Depends, status
from app.middleware.auth_middleware import get_current_user
from app.database import get_db
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/proposals", tags=["Proposals"])

class ProposalCreate(BaseModel):
    title: str
    description: str
    crop_name: str
    area_acres: float
    expected_yield: float
    amount_requested: float
    roi_percent: float
    language: str = "en"
    generated_pitch: Optional[str] = None

class ProposalPublish(BaseModel):
    proposal_id: str

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_proposal(
    data: ProposalCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") != "farmer":
        raise HTTPException(status_code=403, detail="Farmer access required")
    db = get_db()
    doc = {
        "farmer_id": str(current_user["_id"]),
        "farmer_name": current_user.get("name", ""),
        "farmer_state": current_user.get("state", ""),
        "title": data.title,
        "description": data.description,
        "crop_name": data.crop_name,
        "area_acres": data.area_acres,
        "expected_yield": data.expected_yield,
        "amount_requested": data.amount_requested,
        "roi_percent": data.roi_percent,
        "language": data.language,
        "generated_pitch": data.generated_pitch,
        "status": "draft",
        "created_at": datetime.utcnow(),
    }
    result = await db.proposals.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc

@router.post("/publish")
async def publish_proposal(
    data: ProposalPublish,
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") != "farmer":
        raise HTTPException(status_code=403, detail="Farmer access required")
    db = get_db()
    proposal = await db.proposals.find_one({
        "_id": ObjectId(data.proposal_id),
        "farmer_id": str(current_user["_id"])
    })
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    await db.proposals.update_one(
        {"_id": ObjectId(data.proposal_id)},
        {"$set": {"status": "open"}}
    )
    return {"message": "Published", "proposal_id": data.proposal_id}

@router.get("/my")
async def get_my_proposals(current_user: dict = Depends(get_current_user)):
    db = get_db()
    proposals = await db.proposals.find(
        {"farmer_id": str(current_user["_id"])}
    ).sort("created_at", -1).to_list(50)
    for p in proposals:
        p["id"] = str(p["_id"])
        del p["_id"]
    return proposals

@router.delete("/{proposal_id}")
async def delete_proposal(
    proposal_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    result = await db.proposals.delete_one({
        "_id": ObjectId(proposal_id),
        "farmer_id": str(current_user["_id"])
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"message": "Deleted"}
