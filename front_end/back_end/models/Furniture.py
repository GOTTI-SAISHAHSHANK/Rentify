# models/Furniture.py
from pydantic import BaseModel
from typing import List, Optional

class Furniture(BaseModel):
    id: Optional[str] = None # Added missing ID
    user_id: str # Fixed: changed from int to str
    title: str
    price: str
    type: str
    status: Optional[str] = "available"
    location: Optional[str] = "N/A"
    length: int
    breadth: int
    height: int
    condition: str
    description: str
    image_url: str
    amenities: Optional[List[str]] = []
    owner_name: Optional[str] = "Hidden"
    owner_phone: Optional[str] = "Hidden"
    owner_email: Optional[str] = "Hidden"