# Real_Estate/Real_Estate_Routes.py
from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from models.Real_Estate import Real_Estate
from Real_Estate.Real_Estate_Functions import (
    get_all_real_estate_data,
    get_real_estate_by_type_data,
    add_or_update_real_estate_data,
    get_real_estate_by_id,
    get_real_estate_by_user_id_data,
    update_real_estate_status_data,
    delete_real_estate_data  # Imported the new delete function
)

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

@router.get("/", response_model=List[Real_Estate])
def get_all_real_estate():
    return get_all_real_estate_data()

@router.get("/type/{type}", response_model=List[Real_Estate])
def get_real_estate_by_type(type: str):
    properties = get_real_estate_by_type_data(type)
    if not properties:
        raise HTTPException(status_code=404, detail=f"No properties found with type: {type}")
    return properties

@router.get("/user/{user_id}", response_model=List[Real_Estate])
def get_real_estate_by_user_id(user_id: str):
    return get_real_estate_by_user_id_data(user_id)

@router.post("/add_or_update")
def add_or_update_real_estate(item: Real_Estate):
    data = item.dict()
    success = add_or_update_real_estate_data(data)
    if success:
        return {"message": "Property added or updated successfully", "data": data}
    else:
        return {"message": "Item already exists and is up to date", "data": data}

@router.get("/{id}", response_model=Real_Estate)
def get_property_by_id(id: str):
    property = get_real_estate_by_id(id)
    if not property:
        raise HTTPException(status_code=404, detail="Item not found")
    return property

@router.patch("/{id}/status")
def update_status(id: str, status_update: StatusUpdate):
    success = update_real_estate_status_data(id, status_update.status)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update status")
    return {"message": f"Status updated to {status_update.status}"}

# NEW: Route to delete an item
@router.delete("/{id}")
def delete_item(id: str, user_id: str):
    success = delete_real_estate_data(id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to delete. Item not found or unauthorized.")
    return {"message": "Real Estate item deleted successfully"}