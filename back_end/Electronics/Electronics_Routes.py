# Electronics/Electronics_Routes.py
from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from models.Electronics import Electronics
from Electronics.Electronics_Functions import (
    get_all_electronics_data,
    get_electronics_by_type_data,
    add_or_update_electronics_data,
    get_electronic_by_id,
    get_electronics_by_user_id_data,
    update_electronics_status_data
)

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

@router.get("/", response_model=List[Electronics])
def get_all(): return get_all_electronics_data()

@router.get("/type/{type}", response_model=List[Electronics])
def get_by_type(type: str): return get_electronics_by_type_data(type)

@router.get("/user/{user_id}", response_model=List[Electronics])
def get_by_user_id(user_id: str): return get_electronics_by_user_id_data(user_id)

@router.post("/add_or_update")
def add_update(item: Electronics):
    add_or_update_electronics_data(item.dict())
    return {"message": "Success"}

@router.get("/{id}", response_model=Electronics)
def get_one(id: str):
    item = get_electronic_by_id(id)
    if not item: raise HTTPException(status_code=404, detail="Not Found")
    return item

@router.patch("/{id}/status")
def update_status(id: str, status_update: StatusUpdate):
    success = update_electronics_status_data(id, status_update.status)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update status")
    return {"message": f"Status updated to {status_update.status}"}