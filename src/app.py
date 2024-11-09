from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel
from datetime import datetime
from src.database import insert_user, get_user_by_username, update_password, hash_password, verify_password
from src.email_service import generate_otp, send_otp, is_otp_expired
from supabase import create_client, Client
from src.config import SUPABASE_URL, SUPABASE_KEY, OTP_EXPIRATION_TIME
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

url: str = SUPABASE_URL
key: str = SUPABASE_KEY
supabase: Client = create_client(url, key)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User models
class SignUpModel(BaseModel):
    username: str
    password: str
    email: str
    name: str

class LoginModel(BaseModel):
    username: str
    password: str

class VerifyOTPModel(BaseModel):
    username: str
    otp: str

# Global variable for storing OTP and its generation time for simplicity (should use a database in production)
otp_store = {}

@app.post("/signup")
async def sign_up(user: SignUpModel):
    existing_user = get_user_by_username(user.username)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists.")
    
    try:
        # Hash the password
        hashed_password = hash_password(user.password)
        insert_user(user.username, hashed_password, user.name, user.email)
        
        # Generate OTP and send email
        otp = generate_otp()
        otp_store[user.username] = {"otp": otp, "timestamp": datetime.now()}
        
        send_otp(user.email, otp)
        
        logger.info(f"User {user.username} created and OTP sent.")
        return {"message": "User created successfully. Please verify your OTP."}
    except Exception as e:
        logger.error(f"Error during signup for {user.username}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error.")

@app.post("/verify-otp")
async def verify_otp(verify_data: VerifyOTPModel):
    user_data = otp_store.get(verify_data.username)
    if not user_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP not found. Please request a new OTP.")
    
    if user_data["otp"] != verify_data.otp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP.")
    
    if is_otp_expired(user_data["timestamp"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired. Please request a new OTP.")
    
    try:
        response = supabase.table("user_info").update({"is_verified": True}).eq("username", verify_data.username).execute()
        if response.status_code == 200:
            logger.info(f"User {verify_data.username} successfully verified.")
            return {"message": "OTP verified successfully. Your account is now verified."}
        else:
            raise Exception("Failed to update user verification status.")
    except Exception as e:
        logger.error(f"Error verifying OTP for {verify_data.username}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error.")

@app.post("/login")
async def login(user: LoginModel):
    existing_user = get_user_by_username(user.username)
    
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials. User not found.")
    if not existing_user.get("is_verified", False):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account not verified. Please verify your OTP.")
    
    if verify_password(user.password, existing_user["password"]):
        logger.info(f"User {user.username} logged in successfully.")
        return {"message": "Login successful."}
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials. Password is incorrect.")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
