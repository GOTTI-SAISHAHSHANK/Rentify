# models/Real_Estate.py
from pydantic import BaseModel
from typing import List, Optional

class Real_Estate(BaseModel):
    id: Optional[str] = None
    user_id: str  # Fixed: changed from int to str
    title: str
    price: str
    type: str
    status: Optional[str] = "available" # Added status
    location: str
    bedrooms: int # Fixed: changed from str to int
    bathrooms: int # Fixed: changed from str to int
    area: int # Fixed: changed from str to int
    description: str
    image_url: str
    amenities: Optional[List[str]] = []
    owner_name: Optional[str] = "Hidden"
    owner_phone: Optional[str] = "Hidden"
    owner_email: Optional[str] = "Hidden"