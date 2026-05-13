import bcrypt
from mongo_details.mongo_details import backend_db

# Connect to Users collection
Users_collection = backend_db["Users"]


# Helper: Hash a password
def get_password_hash(password):
    # bcrypt requires bytes, so we encode the password
    pwd_bytes = password.encode('utf-8')
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    # Return as string for storage in MongoDB
    return hashed_password.decode('utf-8')


# Helper: Verify a password
def verify_password(plain_password, hashed_password):
    # Encode plain password to bytes
    plain_password_bytes = plain_password.encode('utf-8')
    # Encode hashed password to bytes (it comes as string from DB)
    hashed_password_bytes = hashed_password.encode('utf-8')

    # Check if they match
    return bcrypt.checkpw(plain_password_bytes, hashed_password_bytes)


# Helper: Convert MongoDB doc to dictionary
def user_serializer(user) -> dict:
    return {
        "id": str(user["_id"]),
        "firstName": user.get("firstName"),
        "lastName": user.get("lastName"),
        "email": user.get("email"),
        "phone": user.get("phone", "N/A")
    }

# --- Main Functions ---

def check_email_exists(email: str) -> bool:
    """Check if an email is already registered in the database."""
    user = Users_collection.find_one({"email": email})
    return user is not None


def create_user(user_data: dict):
    # Check if user already exists
    existing_user = Users_collection.find_one({"email": user_data["email"]})
    if existing_user:
        return False  # Email already taken

    # Hash the password before saving
    user_data["password"] = get_password_hash(user_data["password"])

    Users_collection.insert_one(user_data)
    return True


def authenticate_user(email, password):
    user = Users_collection.find_one({"email": email})
    if not user:
        return None  # User not found

    # Use the new verify function
    if not verify_password(password, user["password"]):
        return None  # Wrong password

    return user_serializer(user)