# Vehicles/Vehicles_Routes.py
from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from models.Vehicles import Vehicle
from Vehicles.Vehicles_Functions import (
    get_all_vehicles_data,
    get_vehicles_by_type_data,
    add_or_update_vehicle_data,
    get_vehicle_by_id,
    get_vehicles_by_user_id_data,
    update_vehicle_status_data,
    delete_vehicle_data  # Imported the new delete function
)

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

@router.get("/", response_model=List[Vehicle])
def get_all_vehicles():
    return get_all_vehicles_data()

@router.get("/type/{type}", response_model=List[Vehicle])
def get_vehicle_by_type(type: str):
    return get_vehicles_by_type_data(type)

@router.get("/user/{user_id}", response_model=List[Vehicle])
def get_vehicle_by_user_id(user_id: str):
    return get_vehicles_by_user_id_data(user_id)

@router.post("/add_or_update")
def add_or_update_vehicle(item: Vehicle):
    success = add_or_update_vehicle_data(item.dict())
    return {"message": "Success", "data": item.dict()}

@router.get("/{id}", response_model=Vehicle)
def get_single_vehicle(id: str):
    item = get_vehicle_by_id(id)
    if not item: raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.patch("/{id}/status")
def update_status(id: str, status_update: StatusUpdate):
    success = update_vehicle_status_data(id, status_update.status)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update status")
    return {"message": f"Status updated to {status_update.status}"}

# NEW: Route to delete an item
@router.delete("/{id}")
def delete_item(id: str, user_id: str):
    success = delete_vehicle_data(id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to delete. Item not found or unauthorized.")
    return {"message": "Vehicle deleted successfully"}