# models/Baby_and_Kids.py
from pydantic import BaseModel
from typing import List, Optional

class BabyAndKids(BaseModel):
    id: Optional[str] = None # Added missing ID
    user_id: str # Fixed: changed from int to str
    title: str
    price: str
    type: str
    status: Optional[str] = "available"
    location: Optional[str] = "N/A"
    brand: Optional[str] = "N/A"
    condition: str
    description: str
    image_url: str
    amenities: Optional[List[str]] = []
    owner_name: Optional[str] = "Hidden"
    owner_phone: Optional[str] = "Hidden"
    owner_email: Optional[str] = "Hidden"