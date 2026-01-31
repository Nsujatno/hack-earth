from pydantic import BaseModel


class UserCredentials(BaseModel):
    email: str
    password: str



class UserSurvey(BaseModel):
    user_id: str
    name: str | None = None
    zip_code: str | None = None
    ownership_status: str | None = None
    home_type: str | None = None
    monthly_electric_bill: float | None = None
    monthly_gas_bill: float | None = None
    heating_system: str | None = None
    home_age_year: int | None = None
    income_range: str | None = None


class UserSurveyInput(BaseModel):
    name: str | None = None
    zip_code: str | None = None
    ownership_status: str | None = None
    home_type: str | None = None
    monthly_electric_bill: float | None = None
    monthly_gas_bill: float | None = None
    heating_system: str | None = None
    home_age_year: int | None = None
    income_range: str | None = None



class AgentRoadmap(BaseModel):
    user_id: str
    roadmap_data: dict
    summary: str | None = None
    total_savings: float | None = None
