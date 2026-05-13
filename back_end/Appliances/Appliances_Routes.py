# Appliances/Appliances_Routes.py
from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from models.Appliances import Appliances
from Appliances.Appliances_Functions import (
    get_all_appliances_data,
    get_appliances_by_type_data,
    add_or_update_appliance_data,
    get_appliance_by_id,
    get_appliances_by_user_id_data,
    update_appliance_status_data,
    delete_appliance_data  # Imported the new delete function
)

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

@router.get("/", response_model=List[Appliances])
def get_all(): return get_all_appliances_data()

@router.get("/type/{type}", response_model=List[Appliances])
def get_by_type(type: str): return get_appliances_by_type_data(type)

@router.get("/user/{user_id}", response_model=List[Appliances])
def get_by_user_id(user_id: str): return get_appliances_by_user_id_data(user_id)

@router.post("/add_or_update")
def add_update(item: Appliances):
    add_or_update_appliance_data(item.dict())
    return {"message": "Success"}

@router.get("/{id}", response_model=Appliances)
def get_one(id: str):
    item = get_appliance_by_id(id)
    if not item: raise HTTPException(status_code=404, detail="Not Found")
    return item

@router.patch("/{id}/status")
def update_status(id: str, status_update: StatusUpdate):
    success = update_appliance_status_data(id, status_update.status)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update status. Item may not exist or status is already set.")
    return {"message": f"Status updated to {status_update.status}"}

# NEW: Route to delete an item
@router.delete("/{id}")
def delete_item(id: str, user_id: str):
    success = delete_appliance_data(id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to delete. Item not found or unauthorized.")
    return {"message": "Appliance deleted successfully"}