# Real_Estate/Real_Estate_Functions.py
from mongo_details.mongo_details import backend_db
from bson import ObjectId

Real_Estate_collection = backend_db["Real_Estate"]

def real_estate_serializer(item) -> dict:
    return {
        "id": str(item["_id"]),
        "user_id": item.get("user_id", ""),
        "title": item.get("title"),
        "price": item.get("price"),
        "type": item.get("type"),
        "status": item.get("status", "available"),
        "location": item.get("location", "N/A"),
        "bedrooms": item.get("bedrooms", 0),
        "bathrooms": item.get("bathrooms", 0),
        "area": item.get("area", 0),
        "description": item.get("description"),
        "image_url": item.get("image_url"),
        "amenities": item.get("amenities", []),
        "owner_name": item.get("owner_name", "Property Owner"),
        "owner_phone": item.get("owner_phone", "N/A"),
        "owner_email": item.get("owner_email", "N/A")
    }

def get_all_real_estate_data():
    properties = []
    cursor = Real_Estate_collection.find({})
    for document in cursor:
        properties.append(real_estate_serializer(document))
    return properties

def get_real_estate_by_type_data(property_type: str):
    properties = []
    cursor = Real_Estate_collection.find({"type": property_type})
    for document in cursor:
        properties.append(real_estate_serializer(document))
    return properties

def get_real_estate_by_user_id_data(user_id: str):
    properties = []
    cursor = Real_Estate_collection.find({"user_id": user_id})
    for document in cursor:
        properties.append(real_estate_serializer(document))
    return properties

def add_or_update_real_estate_data(property_data: dict):
    result = Real_Estate_collection.update_one(
        {"title": property_data["title"]},
        {"$set": property_data},
        upsert=True
    )
    if result.upserted_id or result.modified_count > 0:
        return True
    return False

def get_real_estate_by_id(id: str):
    try:
        document = Real_Estate_collection.find_one({"_id": ObjectId(id)})
        if document:
            return real_estate_serializer(document)
        return None
    except:
        return None

def update_real_estate_status_data(id: str, new_status: str):
    try:
        result = Real_Estate_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": new_status}}
        )
        return result.modified_count > 0
    except:
        return False

# NEW: Function to delete an item verifying the user_id
def delete_real_estate_data(id: str, user_id: str):
    try:
        result = Real_Estate_collection.delete_one({"_id": ObjectId(id), "user_id": user_id})
        return result.deleted_count > 0
    except:
        return False