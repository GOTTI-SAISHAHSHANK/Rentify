# Auth/Auth_Routes.py
from fastapi import APIRouter, HTTPException, Query
from models.Users import Users, UserLogin
from Auth.Auth_Functions import create_user, authenticate_user, check_email_exists

router = APIRouter()

@router.get("/check-email")
def check_email(email: str = Query(..., description="The email to check")):
    exists = check_email_exists(email)
    return {"exists": exists}


@router.post("/register")
def register_user(user: Users):
    success = create_user(user.dict())
    if not success:
        raise HTTPException(status_code=400, detail="Email already registered")
    return {"message": "User registered successfully"}


@router.post("/login")
def login_user(user: UserLogin):
    user_data = authenticate_user(user.email, user.password)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # In a real app, you would return a JWT Token here.
    # For now, we return the user info to store in the frontend.
    return {"message": "Login successful", "user": user_data}