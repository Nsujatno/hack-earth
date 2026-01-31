import os
from supabase import create_client, Client
from dotenv import load_dotenv
from fastapi import Header, HTTPException
from pinecone import Pinecone


load_dotenv()

url: str = os.getenv("SUPABASE_URL", "")
key: str = os.getenv("SUPABASE_KEY", "")
pinecone_api_key: str = os.getenv("PINECONE_API_KEY", "")


# Initialize Supabase client
supabase: Client = create_client(url, key)

# Initialize Pinecone client
pc = Pinecone(api_key=pinecone_api_key)


def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    
    token = authorization.split(" ")[1]
    
    try:
        user = supabase.auth.get_user(token)
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
