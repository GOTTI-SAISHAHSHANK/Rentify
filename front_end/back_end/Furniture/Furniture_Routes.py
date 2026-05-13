# Furniture/Furniture_Routes.py
from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from models.Furniture import Furniture
from Furniture.Furniture_Functions import (
    get_all_furniture_data,
    get_furniture_by_type_data,
    add_or_update_furniture_data,
    get_furniture_by_id,
    get_furniture_by_user_id_data,
    update_furniture_status_data
)

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

@router.get("/", response_model=List[Furniture])
def get_all_furniture():
    return get_all_furniture_data()

@router.get("/type/{type}", response_model=List[Furniture])
def get_furniture_by_type(type: str):
    furniture = get_furniture_by_type_data(type)
    if not furniture:
        raise HTTPException(status_code=404, detail=f"No furniture found with type: {type}")
    return furniture

@router.get("/user/{user_id}", response_model=List[Furniture])
def get_furniture_by_user_id(user_id: str):
    return get_furniture_by_user_id_data(user_id)

@router.post("/add_or_update")
def add_or_update_furniture(item: Furniture):
    data = item.dict()
    success = add_or_update_furniture_data(data)
    if success:
        return {"message": "Furniture added or updated successfully", "data": data}
    else:
        return {"message": "Item already exists and is up to date", "data": data}

@router.get("/{id}", response_model=Furniture)
def get_single_furniture(id: str):
    item = get_furniture_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.patch("/{id}/status")
def update_status(id: str, status_update: StatusUpdate):
    success = update_furniture_status_data(id, status_update.status)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update status")
    return {"message": f"Status updated to {status_update.status}"}