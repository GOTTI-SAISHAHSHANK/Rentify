# Package/Package_Routes.py
from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from models.Package import Package
from Package.Package_Functions import (
    get_all_packages_data,
    get_packages_by_type_data,
    add_or_update_package_data,
    get_package_by_id,
    get_packages_by_user_id_data,
    update_package_status_data
)

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

@router.get("/", response_model=List[Package])
def get_all_packages():
    return get_all_packages_data()

@router.get("/type/{type}", response_model=List[Package])
def get_package_by_type(type: str):
    packages = get_packages_by_type_data(type)
    if not packages:
        raise HTTPException(status_code=404, detail=f"No packages found with type: {type}")
    return packages

@router.get("/user/{user_id}", response_model=List[Package])
def get_package_by_user_id(user_id: str):
    return get_packages_by_user_id_data(user_id)

@router.post("/add_or_update")
def add_or_update_package(item: Package):
    data = item.dict()
    success = add_or_update_package_data(data)
    if success:
        return {"message": "Package added or updated successfully", "data": data}
    else:
        return {"message": "Item already exists and is up to date", "data": data}

@router.get("/{id}", response_model=Package)
def get_single_package(id: str):
    item = get_package_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.patch("/{id}/status")
def update_status(id: str, status_update: StatusUpdate):
    success = update_package_status_data(id, status_update.status)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update status")
    return {"message": f"Status updated to {status_update.status}"}