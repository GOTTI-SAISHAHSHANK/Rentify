# Package/Package_Functions.py
from mongo_details.mongo_details import backend_db
from bson import ObjectId

Package_collection = backend_db["Package"]

def package_serializer(item) -> dict:
    return {
        "id": str(item["_id"]),
        "user_id": item.get("user_id", ""),
        "title": item.get("title"),
        "price": item.get("price"),
        "type": item.get("type"),
        "status": item.get("status", "available"), # Added status
        "location": item.get("location"),
        "brand": item.get("brand"),
        "condition": item.get("condition"),
        "description": item.get("description"),
        "image_url": item.get("image_url"),
        "amenities": item.get("amenities", []),
        "owner_name": item.get("owner_name", "Hidden"),
        "owner_phone": item.get("owner_phone", "Hidden"),
        "owner_email": item.get("owner_email", "Hidden")
    }

def get_all_packages_data():
    packages = []
    cursor = Package_collection.find({})
    for document in cursor:
        packages.append(package_serializer(document))
    return packages

def get_packages_by_type_data(package_type: str):
    packages = []
    cursor = Package_collection.find({"type": package_type})
    for document in cursor:
        packages.append(package_serializer(document))
    return packages

def get_packages_by_user_id_data(user_id: str):
    packages = []
    cursor = Package_collection.find({"user_id": user_id})
    for document in cursor:
        packages.append(package_serializer(document))
    return packages

def add_or_update_package_data(package_data: dict):
    result = Package_collection.update_one(
        {"title": package_data["title"]},
        {"$set": package_data},
        upsert=True
    )
    if result.upserted_id or result.modified_count > 0:
        return True
    return False

def get_package_by_id(id: str):
    try:
        document = Package_collection.find_one({"_id": ObjectId(id)})
        if document:
            return package_serializer(document)
        return None
    except:
        return None

def update_package_status_data(id: str, new_status: str):
    try:
        result = Package_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": new_status}}
        )
        return result.modified_count > 0
    except:
        return False