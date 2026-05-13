# models/Vehicles.py
from pydantic import BaseModel
from typing import List, Optional

class Vehicle(BaseModel):
    id: Optional[str] = None
    user_id: str  # Fixed: changed from int to str
    title: str
    price: str
    type: str
    status: Optional[str] = "available" # Added status
    location: str
    mileage: int  # Fixed: changed from str to int
    engine: str
    condition: str
    description: str
    image_url: str
    amenities: Optional[List[str]] = []
    owner_name: Optional[str] = "Hidden"
    owner_phone: Optional[str] = "Hidden"
    owner_email: Optional[str] = "Hidden"