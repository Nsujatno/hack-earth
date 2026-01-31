from typing import TypedDict, List, Dict, Any, Annotated, Optional
import operator
from pydantic import BaseModel, Field
from langchain_core.documents import Document

class ComponentRecommendation(BaseModel):
    """Schema for a single recommendation item."""
    name: str = Field(description="Name of the upgrade, e.g. 'Smart Thermostat'")
    type: str = Field(description="Type: 'quick_win' or 'big_bet'")
    description: str = Field(description="Brief explanation of the upgrade")
    estimated_cost: float = Field(description="Estimated upfront cost")
    rebate_amount: float = Field(description="Total rebate value available")
    federal_credit: float = Field(description="Federal tax credit value")
    estimated_monthly_savings: float = Field(description="Projected monthly bill reduction")
    roi_years: Optional[float] = Field(description="Return on Investment in years", default=None)
    source_citation: str = Field(description="Source of this data", default="")
    learn_more_url: str = Field(description="URL to the specific rebate program or source", default="")


class RoadmapOutput(BaseModel):
    """Schema for the final JSON output."""
    total_projected_savings_yearly: float = Field(description="Total estimated savings per year")
    recommendations: List[ComponentRecommendation] = Field(description="List of recommended upgrades")
    summary_text: str = Field(description="Executive summary of the roadmap")

class AgentState(TypedDict):
    """The working memory of the agent."""
    user_profile: Dict[str, Any]
    observations: Annotated[List[str], operator.add]
    search_queries: List[str]
    documents: List[Document]
    retry_count: int
    final_roadmap: RoadmapOutput | Dict | None

class GradeDocuments(BaseModel):
    """Schema for grading documents."""
    binary_score: str = Field(description="'Yes' if documents are credible, 'No' otherwise")
    explanation: str = Field(description="Reasoning for the grade")