import os
from datetime import datetime
from supabase import create_client, Client
from src.config import SUPABASE_URL, SUPABASE_KEY
import bcrypt

url: str = SUPABASE_URL
key: str = SUPABASE_KEY
supabase: Client = create_client(url, key)

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    if not hashed_password.startswith("$2b$"):
        raise ValueError("Stored password is not a valid bcrypt hash. It may be in plain text.")
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def insert_user(username: str, password: str, name: str, email: str):
    try:
        # Check if username already exists
        existing_user = get_user_by_username(username)
        if existing_user:
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
            return {"message": "User successfully created."}
        else:
            return {"error": "Failed to insert user."}
    except Exception as e:
        return {"error": f"An error occurred: {e}"}

def get_user_by_username(username: str):
    try:
        response = supabase.table("user_info").select("*").eq("username", username).execute()
        users = response.data  
        if not isinstance(users, list):
            raise TypeError(f"Expected list, got {type(users)}: {users}")
        if len(users) == 0:
            return None
        print("Returned user: ", users[0])
        return users[0]
    except Exception as e:
        return {"error": f"An error occurred while fetching user: {e}"}

def update_password(username: str, new_password: str):
    try:
        hashed_password = hash_password(new_password)
        response = supabase.table("user_info").update({"password": hashed_password}).eq("username", username).execute()
        return {"message": "Password updated successfully."} if response.status_code == 200 else {"error": "Failed to update password."}
    except Exception as e:
        return {"error": f"An error occurred: {e}"}
    
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