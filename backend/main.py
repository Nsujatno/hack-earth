from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from db import supabase, get_current_user
from models import UserCredentials
from fastapi import FastAPI, Depends, HTTPException


app = FastAPI()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/signup")
def signup(credentials: UserCredentials):
    try:
        response = supabase.auth.sign_up({
            "email": credentials.email,
            "password": credentials.password,
        })
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/login")
def login(credentials: UserCredentials):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password,
        })
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

