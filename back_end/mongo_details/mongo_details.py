from pymongo import MongoClient
from pymongo.errors import PyMongoError


def get_mongo_client():
    try:
        # # Get environment variables
        # mongo_username = urllib.parse.quote_plus(os.getenv("MONGO_USERNAME", ""))
        # mongo_password = urllib.parse.quote_plus(os.getenv("MONGO_PASSWORD", ""))
        # mongo_server = os.getenv("MONGO_SERVER", "")

        # If credentials are missing, raise an error to trigger fallback
        # if not mongo_username or not mongo_password or not mongo_server:
        #     raise ValueError("Missing MongoDB credentials or server")

        # Construct secure URI
        # uri = f"mongodb://{mongo_username}:{mongo_password}@{mongo_server}/?authSource=admin"
        uri = "mongodb://localhost:27017/"
        client = MongoClient(uri)
        # Attempt a test command to confirm the connection works
        client.admin.command('ping')
        print("Connected to remote MongoDB.")
        return client

    except (PyMongoError, ValueError) as e:
        print(f"Connection error or missing credentials: {e}")
        print("Falling back to local MongoDB on localhost:27017...")
        return MongoClient("mongodb://localhost:27017")


mongo_client = get_mongo_client()

backend_db = mongo_client["rentify_backend_dev"]
