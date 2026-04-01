# Baby_and_kids/Baby_and_Kids_Functions.py
from mongo_details.mongo_details import backend_db
from bson import ObjectId

Baby_and_kids_collection = backend_db["Baby_and_kids"]

def baby_and_kids_serializer(item) -> dict:
    return {
        "id": str(item["_id"]),
        "user_id": item.get("user_id", ""),
        "title": item.get("title"),
        "price": item.get("price"),
        "type": item.get("type"),
        "status": item.get("status", "available"), # Added status
        "location": item.get("location", "N/A"),
        "brand": item.get("brand", "N/A"),
        "condition": item.get("condition"),
        "description": item.get("description"),
        "image_url": item.get("image_url"),
        "amenities": item.get("amenities", []),
        "owner_name": item.get("owner_name", "Hidden"),
        "owner_phone": item.get("owner_phone", "Hidden"),
        "owner_email": item.get("owner_email", "Hidden")
    }

def get_all_baby_and_kids_data():
    items_list = []
    cursor = Baby_and_kids_collection.find({})
    for document in cursor:
        items_list.append(baby_and_kids_serializer(document))
    return items_list

def get_baby_and_kids_by_type_data(item_type: str):
    items_list = []
    cursor = Baby_and_kids_collection.find({"type": item_type})
    for document in cursor:
        items_list.append(baby_and_kids_serializer(document))
    return items_list

def get_baby_and_kids_by_user_id_data(user_id: str):
    items_list = []
    cursor = Baby_and_kids_collection.find({"user_id": user_id})
    for document in cursor:
        items_list.append(baby_and_kids_serializer(document))
    return items_list

def add_or_update_baby_and_kids_data(item_data: dict):
    result = Baby_and_kids_collection.update_one(
        {"title": item_data["title"]},
        {"$set": item_data},
        upsert=True
    )
    if result.upserted_id or result.modified_count > 0:
        return True
    return False

def get_baby_and_kids_by_id(id: str):
    try:
        document = Baby_and_kids_collection.find_one({"_id": ObjectId(id)})
        if document:
            return baby_and_kids_serializer(document)
        return None
    except:
        return None

def update_baby_and_kids_status_data(id: str, new_status: str):
    try:
        result = Baby_and_kids_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": new_status}}
        )
        return result.modified_count > 0
    except:
        return False