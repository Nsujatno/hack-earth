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


def save_roadmap(user_id: str, roadmap: dict, summary: str = None, total_savings: float = None):
    try:
        data = {
            "user_id": user_id,
            "roadmap_data": roadmap,
            "summary": summary,
            "total_savings": total_savings
        }
        response = supabase.table("agent_roadmaps").insert(data).execute()
        return response
    except Exception as e:
        print(f"Error saving roadmap: {e}")
        # We don't necessarily want to fail the whole request if saving fails, but logging is good.
        # Ideally, we should maybe re-raise or handle. For now, let's print.
        raise e

def get_roadmap(user_id: str):
    try:
        response = supabase.table("agent_roadmaps") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .limit(1) \
            .execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error fetching roadmap: {e}")
        return None
