from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse
from app.schemas.crop import CropCreate, CropResponse
from app.middleware.auth_middleware import get_current_user
from app.database import get_db
from datetime import datetime
from bson import ObjectId
from typing import List

router = APIRouter(prefix="/farmer", tags=["Farmer"])

@router.post("/farms", status_code=status.HTTP_201_CREATED)
async def create_farm(farm_data: FarmCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    farm_doc = {
        **farm_data.dict(),
        "user_id": str(current_user["_id"]),
        "created_at": datetime.utcnow()
    }
    result = await db.farms.insert_one(farm_doc)
    farm_doc["id"] = str(result.inserted_id)
    return farm_doc

@router.get("/farms")
async def get_my_farms(current_user: dict = Depends(get_current_user)):
    db = get_db()
    farms = await db.farms.find({"user_id": str(current_user["_id"])}).to_list(100)
    for farm in farms:
        farm["id"] = str(farm["_id"])
        del farm["_id"]
    return farms

@router.get("/farms/{farm_id}")
async def get_farm(farm_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    farm = await db.farms.find_one({"_id": ObjectId(farm_id), "user_id": str(current_user["_id"])})
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    farm["id"] = str(farm["_id"])
    del farm["_id"]
    return farm

@router.put("/farms/{farm_id}")
async def update_farm(farm_id: str, farm_data: FarmUpdate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    update_data = {k: v for k, v in farm_data.dict().items() if v is not None}
    await db.farms.update_one(
        {"_id": ObjectId(farm_id), "user_id": str(current_user["_id"])},
        {"$set": update_data}
    )
    return {"message": "Farm updated successfully"}

@router.post("/crops", status_code=status.HTTP_201_CREATED)
async def create_crop(crop_data: CropCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    crop_doc = {
        **crop_data.dict(),
        "created_at": datetime.utcnow()
    }
    result = await db.crops.insert_one(crop_doc)
    crop_doc["id"] = str(result.inserted_id)
    return crop_doc

@router.get("/crops/{farm_id}")
async def get_farm_crops(farm_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    crops = await db.crops.find({"farm_id": farm_id}).to_list(100)
    for crop in crops:
        crop["id"] = str(crop["_id"])
        del crop["_id"]
    return crops
