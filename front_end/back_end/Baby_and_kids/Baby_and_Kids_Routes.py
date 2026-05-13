# Baby_and_kids/Baby_and_Kids_Routes.py
from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from models.Baby_and_Kids import BabyAndKids
from Baby_and_kids.Baby_and_Kids_Functions import (
    get_all_baby_and_kids_data,
    get_baby_and_kids_by_type_data,
    add_or_update_baby_and_kids_data,
    get_baby_and_kids_by_id,
    get_baby_and_kids_by_user_id_data,
    update_baby_and_kids_status_data
)

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

@router.get("/", response_model=List[BabyAndKids])
def get_all_baby_and_kids():
    return get_all_baby_and_kids_data()

@router.get("/type/{type}", response_model=List[BabyAndKids])
def get_baby_and_kids_by_type(type: str):
    items = get_baby_and_kids_by_type_data(type)
    if not items:
        raise HTTPException(status_code=404, detail=f"No items found with type: {type}")
    return items

@router.get("/user/{user_id}", response_model=List[BabyAndKids])
def get_baby_and_kids_by_user_id(user_id: str):
    return get_baby_and_kids_by_user_id_data(user_id)

@router.post("/add_or_update")
def add_or_update_baby_and_kids(item: BabyAndKids):
    data = item.dict()
    success = add_or_update_baby_and_kids_data(data)
    if success:
        return {"message": "Item added or updated successfully", "data": data}
    else:
        return {"message": "Item already exists and is up to date", "data": data}

@router.get("/{id}", response_model=BabyAndKids)
def get_single_baby_item(id: str):
    item = get_baby_and_kids_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.patch("/{id}/status")
def update_status(id: str, status_update: StatusUpdate):
    success = update_baby_and_kids_status_data(id, status_update.status)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update status")
    return {"message": f"Status updated to {status_update.status}"}