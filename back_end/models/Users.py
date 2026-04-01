from pydantic import BaseModel, EmailStr

class Users(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str