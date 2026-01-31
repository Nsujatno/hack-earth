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
        # User extraction logic...
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

from agent.graph import app as agent_app

@app.post('/roadmap')
def generate_roadmap_endpoint(survey: UserSurveyInput, user = Depends(get_current_user)):
    """
    Trigger the AI Agent to generate a roadmap based on survey data.
    """
    try:
        # User extraction logic
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
        
        print(f"Starting Agent for {survey.zip_code}...")
        
        # Initialize state
        initial_state = {
            "user_profile": survey.model_dump(),
            "observations": [],
            "search_queries": [],
            "documents": [],
            "retry_count": 0,
            "final_roadmap": None
        }
        
        # Run Graph
        result = agent_app.invoke(initial_state)
        roadmap = result.get("final_roadmap")
        
        if roadmap:
            from db import save_roadmap
            # Extract summary and savings for easier querying
            summary_text = roadmap.get("summary_text", "")
            total_savings = roadmap.get("total_projected_savings_yearly", 0)
            
            save_roadmap(user_id, roadmap, summary_text, total_savings)
            print(f"Roadmap saved for user {user_id}")
        
        return roadmap
    except Exception as e:
        print(f"Agent Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


