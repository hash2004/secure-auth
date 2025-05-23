import os
from datetime import datetime
from supabase import create_client, Client
from src.config import SUPABASE_URL, SUPABASE_KEY
import bcrypt
import logging
import uuid

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

url: str = SUPABASE_URL
key: str = SUPABASE_KEY
supabase: Client = create_client(url, key)

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    if not hashed_password.startswith("$2b$"):
        logger.error("Stored password is not a valid bcrypt hash. It may be in plain text.")
        raise ValueError("Stored password is not a valid bcrypt hash.")
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def insert_user(username: str, password: str, name: str, email: str):
    try:
        # Check if username already exists
        existing_user = get_user_by_username(username)
        if existing_user:
            logger.warning(f"User {username} already exists.")
            return {"error": "User with this username already exists."}
        
        timestamp = datetime.now().isoformat()
        response = supabase.table("user_info").insert({
            "username": username,
            "password": password,
            "name": name,
            "is_verified": False,
            "email": email,
            "created_at": timestamp
        }).execute()
        
        if response.status_code == 201:
            logger.info(f"User {username} successfully created.")
            return {"message": "User successfully created."}
        else:
            logger.error(f"Failed to insert user {username}. Status code: {response.status_code}")
            return {"error": "Failed to insert user."}
    except Exception as e:
        logger.error(f"An error occurred while inserting user {username}: {e}")
        return {"error": f"An error occurred: {e}"}

def get_user_by_username(username: str):
    try:
        response = supabase.table("user_info").select("*").eq("username", username).execute()
        users = response.data  
        if not isinstance(users, list):
            raise TypeError(f"Expected list, got {type(users)}: {users}")
        if len(users) == 0:
            logger.warning(f"User {username} not found.")
            return None
        logger.info(f"Retrieved user: {username}")
        return users[0]
    except Exception as e:
        logger.error(f"An error occurred while fetching user {username}: {e}")
        return {"error": f"An error occurred while fetching user: {e}"}

def update_password(username: str, new_password: str):
    try:
        hashed_password = hash_password(new_password)
        response = supabase.table("user_info").update({"password": hashed_password}).eq("username", username).execute()
        if response.status_code == 200:
            logger.info(f"Password for {username} updated successfully.")
            return {"message": "Password updated successfully."}
        else:
            logger.error(f"Failed to update password for {username}. Status code: {response.status_code}")
            return {"error": "Failed to update password."}
    except Exception as e:
        logger.error(f"An error occurred while updating password for {username}: {e}")
        return {"error": f"An error occurred: {e}"}

def insert_log(level: str, message: str, user: str = None, details: dict = None):
    try:

        logger.info("logging")
        
        response = supabase.table("logs").insert({
            "timestamp": datetime.now().isoformat(),
            "level": level,
            "message": message,
            "user": user,
            "details": details
        }).execute()
        
        logger.info("logging2")
        if response.status_code == 201:
            logger.info("logging successful")
            return {"message": "Log entry created successfully."}
        else:
            logger.error("logging failed")
            return {"error": "Failed to create log entry."}
    except Exception as e:
        return {"error": f"An error occurred: {e}"}
    
    
        response = supabase.table("user_info").insert({
            "username": username,
            "password": password,
            "name": name,
            "is_verified": False,
            "email": email,
            "created_at": timestamp
        }).execute()    
"""
# Example of usage
# Insert a new user with hashed password
print("Inserting a new user...")
insert_user("hashims", "tests", "Nadeem", "nadeemhashim7@gmail.com")

# Verify the user's password after rehashing
user = get_user_by_username("hashims")
if user:
    is_correct_password = verify_password("tests", user['password'])
    print(f"Password verification result: {is_correct_password}")
"""