# Vehicles/Vehicles_Functions.py
from mongo_details.mongo_details import backend_db
from bson import ObjectId

Vehicles_collection = backend_db["Vehicles"]

def vehicle_serializer(item) -> dict:
    return {
        "id": str(item["_id"]),
        "user_id": item.get("user_id", ""),
        "title": item.get("title"),
        "price": item.get("price"),
        "type": item.get("type"),
        "status": item.get("status", "available"), # Added status
        "location": item.get("location", "N/A"),
        "mileage": item.get("mileage", 0),
        "engine": item.get("engine", "N/A"),
        "condition": item.get("condition"),
        "description": item.get("description"),
        "image_url": item.get("image_url"),
        "amenities": item.get("amenities", []),
        "owner_name": item.get("owner_name", "N/A"),
        "owner_phone": item.get("owner_phone", "N/A"),
        "owner_email": item.get("owner_email", "N/A")
    }

def get_all_vehicles_data():
    vehicles = []
    for doc in Vehicles_collection.find({}): vehicles.append(vehicle_serializer(doc))
    return vehicles

def get_vehicles_by_type_data(vehicle_type: str):
    vehicles = []
    for doc in Vehicles_collection.find({"type": vehicle_type}): vehicles.append(vehicle_serializer(doc))
    return vehicles

def get_vehicles_by_user_id_data(user_id: str):
    vehicles = []
    for doc in Vehicles_collection.find({"user_id": user_id}): vehicles.append(vehicle_serializer(doc))
    return vehicles

def add_or_update_vehicle_data(vehicle_data: dict):
    result = Vehicles_collection.update_one({"title": vehicle_data["title"]}, {"$set": vehicle_data}, upsert=True)
    return result.upserted_id or result.modified_count > 0

def get_vehicle_by_id(id: str):
    try:
        document = Vehicles_collection.find_one({"_id": ObjectId(id)})
        return vehicle_serializer(document) if document else None
    except:
        return None

def update_vehicle_status_data(id: str, new_status: str):
    try:
        result = Vehicles_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": new_status}}
        )
        return result.modified_count > 0
    except:
        return False