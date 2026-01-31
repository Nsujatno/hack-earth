from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from db import supabase, get_current_user
from models import UserCredentials, UserSurveyInput
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


@app.post('/survey')
def save_survey(survey: UserSurveyInput, user = Depends(get_current_user)):
    try:
        if isinstance(user, tuple):
            user_obj = user[0]
        else:
            user_obj = user

        if hasattr(user_obj, "user") and user_obj.user:
            user_id = user_obj.user.id
        elif hasattr(user_obj, "id"):
             user_id = user_obj.id
        else:
            raise HTTPException(status_code=400, detail=f"Could not extract user ID from {type(user_obj)}")

        survey_data = survey.model_dump()
        survey_data['user_id'] = user_id
        
        response = supabase.table('user_surveys').upsert(survey_data).execute()
        return response
    except Exception as e:
        print(f"Error in save_survey: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

