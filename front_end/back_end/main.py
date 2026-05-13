# main.py
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from Appliances.Appliances_Routes import router as appliances_router
from Electronics.Electronics_Routes import router as electronics_router
from Furniture.Furniture_Routes import router as furniture_router
from Baby_and_kids.Baby_and_Kids_Routes import router as baby_and_kids_router
from Package.Package_Routes import router as package_router
from Real_Estate.Real_Estate_Routes import router as real_estate_router
from Vehicles.Vehicles_Routes import router as vehicles_router
from Auth.Auth_Routes import router as auth_router

app = FastAPI(
    title="Rentify API", # Updated title based on your DB name
    description="API for managing rental products",
    version="1.0.0",
)

# Include the Appliances router
# This creates routes like /appliances/ and /appliances/{type}
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(appliances_router, prefix="/appliances", tags=["Appliances"])
app.include_router(electronics_router, prefix="/electronics", tags=["Electronics"])
app.include_router(furniture_router, prefix="/furniture", tags=["Furniture"])
app.include_router(baby_and_kids_router, prefix="/baby_and_kids", tags=["Baby and Kids"])
app.include_router(package_router, prefix="/package", tags=["Package"])
app.include_router(real_estate_router, prefix="/real_estate", tags=["Real Estate"])
app.include_router(vehicles_router, prefix="/vehicles", tags=["Vehicles"])


origins = [
    "http://localhost:5174",  # Your Vite Frontend
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="localhost", port=6555, reload=True)