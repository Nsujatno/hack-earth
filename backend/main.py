from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from db import supabase, get_current_user
from models import UserCredentials, UserSurveyInput
from fastapi import FastAPI, Depends, HTTPException
from langchain_google_genai import ChatGoogleGenerativeAI
import json
import os


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
            recommendations = roadmap.get("recommendations", [])
            filtered_recommendations = []
            
            for rec in recommendations:
                try:
                    roi = rec.get("roi_years")
                    monthly_savings = rec.get("estimated_monthly_savings", 0)
                    
                    if roi is not None and (isinstance(roi, (int, float)) and roi > 30):
                        continue
                        
                    if monthly_savings <= 0:
                        continue
                        
                    filtered_recommendations.append(rec)
                except Exception as e:
                    print(f"Error filtering item {rec.get('name')}: {e}")
                    continue
            
            roadmap["recommendations"] = filtered_recommendations
            
            new_total_yearly = sum(r.get("estimated_monthly_savings", 0) * 12 for r in filtered_recommendations)
            roadmap["total_projected_savings_yearly"] = new_total_yearly
            

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



@app.get('/dashboard')
def get_dashboard_data(user = Depends(get_current_user)):
    try:
        # User extraction logic (reused)
        if isinstance(user, tuple):
             user_obj = user[0]
        else:
             user_obj = user

        if hasattr(user_obj, "user") and user_obj.user:
            user_id = user_obj.user.id
        elif hasattr(user_obj, "id"):
             user_id = user_obj.id
        else:
            raise HTTPException(status_code=400, detail=f"Could not extract user ID")

        from db import get_roadmap
        data = get_roadmap(user_id)
        
        if not data:
            return {"roadmap_data": None}
            
        return data
    except Exception as e:
        print(f"Dashboard Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/impact')
def get_impact_endpoint(user = Depends(get_current_user)):
    try:
        # User extraction logic (reused)
        if isinstance(user, tuple):
             user_obj = user[0]
        else:
             user_obj = user

        if hasattr(user_obj, "user") and user_obj.user:
            user_id = user_obj.user.id
        elif hasattr(user_obj, "id"):
             user_id = user_obj.id
        else:
            raise HTTPException(status_code=400, detail=f"Could not extract user ID")

        from db import get_impact
        data = get_impact(user_id)
        
        if not data:
            return {"impact_data": None}
            
        return data
    except Exception as e:
        print(f"Impact Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/impact/generate')
def generate_impact_endpoint(user = Depends(get_current_user)):
    try:
        # User extraction logic (reused)
        if isinstance(user, tuple):
             user_obj = user[0]
        else:
             user_obj = user

        if hasattr(user_obj, "user") and user_obj.user:
            user_id = user_obj.user.id
        elif hasattr(user_obj, "id"):
             user_id = user_obj.id
        else:
            raise HTTPException(status_code=400, detail=f"Could not extract user ID")

        from db import get_roadmap, save_impact
        roadmap_row = get_roadmap(user_id)
        if not roadmap_row:
             raise HTTPException(status_code=404, detail="No roadmap found. Please generate a roadmap first.")
        
        roadmap_data = roadmap_row.get("roadmap_data", {})
        recommendations = roadmap_data.get("recommendations", [])
        
        if not recommendations:
             raise HTTPException(status_code=400, detail="Roadmap has no recommendations.")

        sorted_recs = sorted(recommendations, key=lambda x: x.get("estimated_monthly_savings", 0), reverse=True)[:5]
        
        from agent.tools import calculate_co2_impact
        
        items_for_prompt = []
        for rec in sorted_recs:
             monthly_savings = rec.get("estimated_monthly_savings", 0)
             name = rec.get("name")
             
             co2_tons = calculate_co2_impact(name, monthly_savings)
             
             items_for_prompt.append({
                 "name": name,
                 "monthly_savings": monthly_savings,
                 "description": rec.get("explanation"),
                 "co2_saved_tons": co2_tons
             })

        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-lite",
            temperature=0.7,
            api_key=os.environ.get("GOOGLE_API_KEY")
        )

        prompt = f"""
        You are an energy efficiency expert. Based on the following home upgrades and their calculated CO2 impact, generate a relatable analogy for each one.
        
        For each item:
        1. Use the provided "co2_saved_tons" value. Do NOT recalculate it.
        2. Create a fun, relatable analogy for that amount of CO2 (e.g., "driving X miles", "burning Y lbs of coal", "charging Z smartphones").
        
        Items:
        {json.dumps(items_for_prompt, indent=2)}
        
        Return ONLY valid JSON in this format:
        {{
            "Item Name": {{
                "analogy": "This is like...",
                "co2_saved_tons": 0.5  <-- Return the exact value provided
            }},
            ...
        }}
        """

        response = llm.invoke(prompt)
        content = response.content
        
        # Clean up code blocks if present
        if "```json" in content:
            content = content.replace("```json", "").replace("```", "")
        elif "```" in content:
            content = content.replace("```", "")
            
        impact_breakdown = json.loads(content)
        
        # Calculate total
        total_co2 = sum(item.get("co2_saved_tons", 0) for item in impact_breakdown.values())
        
        impact_data = {
            "user_id": user_id,
            "total_co2_saved_tons": total_co2,
            "impact_summary": f"You could save {total_co2:.1f} tons of CO2 annually!",
            "breakdown": impact_breakdown
        }
        
        save_impact(impact_data)
        
        return impact_data

    except Exception as e:
        print(f"Impact Generation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
