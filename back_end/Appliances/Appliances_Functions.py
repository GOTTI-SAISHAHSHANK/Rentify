# Appliances/Appliances_Functions.py
from mongo_details.mongo_details import backend_db
from bson import ObjectId

Appliances_collection = backend_db["Appliances"]

def appliance_serializer(item) -> dict:
    return {
        "id": str(item["_id"]),
        "user_id": item.get("user_id", ""),
        "title": item.get("title"),
        "price": item.get("price"),
        "type": item.get("type"),
        "status": item.get("status", "available"), # Added status
        "location": item.get("location", "N/A"),
        "brand": item.get("brand"),
        "condition": item.get("condition"),
        "description": item.get("description"),
        "image_url": item.get("image_url"),
        "amenities": item.get("amenities", []),
        "owner_name": item.get("owner_name", "N/A"),
        "owner_phone": item.get("owner_phone", "N/A"),
        "owner_email": item.get("owner_email", "N/A")
    }

def get_all_appliances_data():
    data = []
    for doc in Appliances_collection.find({}): data.append(appliance_serializer(doc))
    return data

def get_appliances_by_type_data(type: str):
    data = []
    for doc in Appliances_collection.find({"type": type}): data.append(appliance_serializer(doc))
    return data

def get_appliances_by_user_id_data(user_id: str):
    data = []
    for doc in Appliances_collection.find({"user_id": user_id}): data.append(appliance_serializer(doc))
    return data

def add_or_update_appliance_data(data: dict):
    result = Appliances_collection.update_one({"title": data["title"]}, {"$set": data}, upsert=True)
    return result.upserted_id or result.modified_count > 0

def get_appliance_by_id(id: str):
    try:
        doc = Appliances_collection.find_one({"_id": ObjectId(id)})
        return appliance_serializer(doc) if doc else None
    except:
        return None

# NEW: Function to update just the status
def update_appliance_status_data(id: str, new_status: str):
    try:
        result = Appliances_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": new_status}}
        )
        return result.modified_count > 0
    except:
        return False