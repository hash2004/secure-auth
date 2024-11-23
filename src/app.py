# src/app.py

from fastapi import FastAPI, HTTPException, Depends, status, Form
from pydantic import BaseModel
from datetime import datetime, timedelta
from src.database import insert_user, get_user_by_username, update_password, hash_password, verify_password, insert_log
from src.email_service import generate_otp, send_otp, is_otp_expired
from supabase import create_client, Client
from src.config import SUPABASE_URL, SUPABASE_KEY, OTP_EXPIRATION_TIME
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import jwt
from jwt import PyJWTError
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Initialize FastAPI app and CORS middleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url: str = SUPABASE_URL
key: str = SUPABASE_KEY
supabase: Client = create_client(url, key)

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

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Utility function to create access tokens
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)  # Default expiry
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency to get the current user
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception
    user = get_user_by_username(username)
    if user is None:
        raise credentials_exception
    return user

# In-memory OTP store (replace with persistent storage in production)
otp_store = {}

@app.post("/signup")
async def sign_up(user: SignUpModel):
    existing_user = get_user_by_username(user.username)
    if existing_user:
        insert_log("WARNING", "User already exists.", user.username)
        raise HTTPException(status_code=400, detail="User already exists.")
    
    # Hash the password
    hashed_password = hash_password(user.password)
    insert_user(user.username, hashed_password, user.name, user.email)
    
    # Generate OTP and send email
    otp = generate_otp()
    otp_store[user.username] = {"otp": otp, "timestamp": datetime.now()}
    
    send_otp(user.email, otp)
    insert_log("INFO", "User signed up successfully.", user.username)

    return {"message": "User created successfully. Please verify your OTP."}

@app.post("/verify-otp")
async def verify_otp(verify_data: VerifyOTPModel):
    user_data = otp_store.get(verify_data.username)
    if not user_data:
        insert_log("WARNING", "OTP not found.", verify_data.username)
        raise HTTPException(status_code=400, detail="OTP not found. Please request a new OTP.")
    
    # Check OTP validity
    if user_data["otp"] != verify_data.otp:
        insert_log("WARNING", "Invalid OTP.", verify_data.username)
        raise HTTPException(status_code=400, detail="Invalid OTP.")
    
    if is_otp_expired(user_data["timestamp"]):
        insert_log("WARNING", "OTP expired.", verify_data.username)
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new OTP.")
    
    # Mark user as verified
    response = supabase.table("user_info").update({"is_verified": True}).eq("username", verify_data.username).execute()
    insert_log("INFO", "OTP verified successfully.", verify_data.username)
    return {"message": "OTP verified successfully. Your account is now verified."}

@app.post("/login")
async def login(user: LoginModel):
    existing_user = get_user_by_username(user.username)
    
    if not existing_user:
        insert_log("WARNING", "Invalid credentials. User not found.", user.username)
        raise HTTPException(status_code=400, detail="Invalid credentials. User not found.")
    if not existing_user.get("is_verified", False):
        insert_log("WARNING", "Account not verified.", user.username)
        raise HTTPException(status_code=403, detail="Account not verified. Please verify your OTP.")
    if verify_password(user.password, existing_user["password"]):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username},
            expires_delta=access_token_expires
        )
        insert_log("INFO", "Login successful.", user.username)
        return {"message": "Login successful.", "token": access_token}
    else:
        insert_log("WARNING", "Invalid credentials. Password is incorrect.", user.username)
        raise HTTPException(status_code=400, detail="Invalid credentials. Password is incorrect.")

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_username(form_data.username)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials. User not found.")
    if not user.get("is_verified", False):
        raise HTTPException(status_code=403, detail="Account not verified. Please verify your OTP.")
    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials. Password is incorrect.")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/protected-route")
async def protected_route(current_user: dict = Depends(get_current_user)):
    return {"message": f"Hello, {current_user['name']}! This is a protected route."}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
