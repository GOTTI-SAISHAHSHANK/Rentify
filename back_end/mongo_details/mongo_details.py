import os
from pymongo import MongoClient
from pymongo.errors import PyMongoError


def get_mongo_client():
    try:
        # This looks for a secret variable called MONGO_URI on Render. 
        # If it doesn't find one, it falls back to your local database.
        uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
        client = MongoClient(uri)

        # Test the connection
        client.admin.command('ping')
        print("Connected to MongoDB successfully!")
        return client

    except (PyMongoError, ValueError) as e:
        print(f"Connection error: {e}")
        raise e


mongo_client = get_mongo_client()
backend_db = mongo_client["rentify"]