# Furniture/Furniture_Functions.py
from mongo_details.mongo_details import backend_db
from bson import ObjectId

Furniture_collection = backend_db["Furniture"]

def furniture_serializer(item) -> dict:
    return {
        "id": str(item["_id"]),
        "user_id": item.get("user_id", ""),
        "title": item.get("title"),
        "price": item.get("price"),
        "type": item.get("type"),
        "status": item.get("status", "available"),
        "location": item.get("location", "N/A"),
        "length": item.get("length", 0),
        "breadth": item.get("breadth", 0),
        "height": item.get("height", 0),
        "condition": item.get("condition"),
        "description": item.get("description"),
        "image_url": item.get("image_url"),
        "amenities": item.get("amenities", []),
        "owner_name": item.get("owner_name", "Hidden"),
        "owner_phone": item.get("owner_phone", "Hidden"),
        "owner_email": item.get("owner_email", "Hidden")
    }

def get_all_furniture_data():
    furniture_list = []
    cursor = Furniture_collection.find({})
    for document in cursor:
        furniture_list.append(furniture_serializer(document))
    return furniture_list

def get_furniture_by_type_data(furniture_type: str):
    furniture_list = []
    cursor = Furniture_collection.find({"type": furniture_type})
    for document in cursor:
        furniture_list.append(furniture_serializer(document))
    return furniture_list

def get_furniture_by_user_id_data(user_id: str):
    furniture_list = []
    cursor = Furniture_collection.find({"user_id": user_id})
    for document in cursor:
        furniture_list.append(furniture_serializer(document))
    return furniture_list

def add_or_update_furniture_data(furniture_data: dict):
    result = Furniture_collection.update_one(
        {"title": furniture_data["title"]},
        {"$set": furniture_data},
        upsert=True
    )
    if result.upserted_id or result.modified_count > 0:
        return True
    return False

def get_furniture_by_id(id: str):
    try:
        document = Furniture_collection.find_one({"_id": ObjectId(id)})
        if document:
            return furniture_serializer(document)
        return None
    except:
        return None

def update_furniture_status_data(id: str, new_status: str):
    try:
        result = Furniture_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": new_status}}
        )
        return result.modified_count > 0
    except:
        return False

# NEW: Function to delete an item verifying the user_id
def delete_furniture_data(id: str, user_id: str):
    try:
        result = Furniture_collection.delete_one({"_id": ObjectId(id), "user_id": user_id})
        return result.deleted_count > 0
    except:
        return False