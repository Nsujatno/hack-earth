import os
import json
from typing import List, Dict, Any
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from .state import AgentState, RoadmapOutput, GradeDocuments
from .utils import calculate_roi
from .tools import retrieve_context, search_web, check_zip_coverage, llm, llm_flash_lite

def analyze_profile(state: AgentState) -> Dict:
    """Analyze survey data to generate search queries."""
    print("Analyzing Profile...")
    profile = state["user_profile"]
    
    prompt = f"""
    Analyze this user profile for energy rebate eligibility:
    - Zip: {profile.get('zip_code')}
    - Home: {profile.get('ownership_status')}, {profile.get('home_type')}
    - Income: {profile.get('income_range')}
    - Heating: {profile.get('heating_system')}
    - Home Age: {profile.get('home_age_year')}
    
    Generate 3 specific search queries to find the best rebates for them.
    Focus on high-value upgrades (HVAC, Solar) and quick wins (Weatherization).
    Return ONLY a JSON list of strings, e.g. ["query1", "query2"]
    """
    
    response = llm.invoke(prompt)
    try:
        # Simple parsing for list
        queries = json.loads(response.content)
    except:
        # Fallback
        queries = [
            f"energy rebates {profile.get('zip_code')} {profile.get('heating_system')}",
            f"federal tax credits {profile.get('ownership_status')}",
            f"utility incentives {profile.get('zip_code')}"
        ]
        
    return {"search_queries": queries, "observations": ["Analyzed profile."]}

def route_zip_code(state: AgentState) -> str:
    """Conditional Edge decision."""
    zip_code = state["user_profile"].get("zip_code")
    if check_zip_coverage(zip_code):
        return "retrieve_local"
    return "retrieve_hybrid"

def retrieve_local(state: AgentState) -> Dict:
    """Retrieve from local vector DB."""
    print("Retrieving Local RAG...")
    docs = []
    # Query for each generated topic + general federal
    for q in state["search_queries"]:
        context = retrieve_context(q, k=2) # Reuse existing function
        docs.append(context)
        
    return {"documents": docs}

def retrieve_hybrid(state: AgentState) -> Dict:
    """Retrieve from Hybrid (Federal + Web)."""
    print("Retrieving Hybrid...")
    docs = []
    zip_code = state["user_profile"].get("zip_code")
    
    # 1. Federal RAG
    files_context = retrieve_context("federal tax credits", filters={"location": "federal"}, k=3)
    docs.append(files_context)
    
    # 2. Web Search
    for q in state["search_queries"]:
        web_res = search_web(f"{q} in {zip_code}")
        docs.append(web_res)
        
    return {"documents": docs}

def grade_documents(state: AgentState) -> Dict:
    """
    Evaluates if documents are relevant and CREDIBLE.
    
    CRITERIA:
    1. CREDIBILITY: Must be from official sources (.gov, .org, utility company, manufacturer). 
       - Reject blog posts, forums, or generic content farms.
    2. SPECIFICITY: Must contain dollar amounts, percentages, or specific eligibility logic.
       - Reject generic "save money by turning off lights" advice.
    """
    print("Grading Documents...")
    combined_text = "\n".join([str(d) for d in state["documents"]])
    
    # Fail fast if empty
    if not combined_text or len(combined_text) < 50:
        return {"retry_count": state["retry_count"] + 1}

    parser = JsonOutputParser(pydantic_object=GradeDocuments)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a strict data evaluator. 
        Your job is to Grade the retrieved documents for relevance, specificity, and CREDIBILITY.
        
        CREDIBILITY RULES:
        - PASS: government sites (.gov), utility companies (austinenergy.com), official manufacturers (energy star).
        - FAIL: generic blogs, content farms, "tips and tricks" articles, unverified forums.
        
        CONTENT RULES:
        - PASS: Contains specific rebate amounts (e.g. "$2,000"), specific tax credit codes (25C), or income limits.
        - FAIL: Generic advice like "install better windows" without specific financial details.
        
        Output 'yes' if the documents contain at least one credible, specific source of valid rebate information.
        """),
        ("human", "Documents:\n\n{context}\n\n{format_instructions}")
    ])
    
    chain = prompt | llm_flash_lite | parser
    
    try:
        score = chain.invoke({
            "context": combined_text,
            "format_instructions": parser.get_format_instructions()
        })
        
        print(f"  - Score: {score['binary_score']}")
        print(f"  - Reason: {score['explanation']}")
        
        if score["binary_score"].lower() == "yes":
            return {"observations": ["Found credible pricing data."]}
        else:
             return {"retry_count": state["retry_count"] + 1}
             
    except Exception as e:
        print(f"Grading Error: {e}")
        # Fallback to loose check
        if "$" in combined_text:
             return {"observations": ["Found specific pricing data (fallback)."]}
        return {"retry_count": state["retry_count"] + 1}


def decide_to_generate(state: AgentState) -> str:
    """Conditional Edge for ReAct loop."""
    # Simple check: if we have observations of success or max retries
    if state["observations"] and "Found credible pricing data." in state["observations"][-1]:
        return "generate"

    if state["retry_count"] >= 3:
        return "generate"
    return "rewrite"

def generate_roadmap(state: AgentState) -> Dict:
    """Generate the final JSON roadmap."""
    print("Generating Roadmap...")
    profile = state["user_profile"]
    context = "\n".join([str(d) for d in state["documents"]])
    
    parser = JsonOutputParser(pydantic_object=RoadmapOutput)
    
ROADMAP_PROMPT_TEMPLATE = """
        User Profile: {profile}
        
        Context:
        {context}
        
        Task:
        Generate a personalized energy roadmap JSON data structure.
        
        CRITICAL FINANCIAL LOGIC RULES (STRICT COMPLIANCE REQUIRED):
        1. IRS 25C BASIS REDUCTION: 
           - You MUST subtract any "Utility Rebates" or "Public Grants" (like HEEHRA) from the "Estimated Cost" BEFORE calculating the Federal Tax Credit.
           - Formula: Federal Credit = 30% * (Estimated Cost - Utility Rebate - HEEHRA Rebate).
           - Tax Credit Cap: Max $2,000/yr for Heat Pumps/Biomass/Boilers. Max $1,200/yr for everything else combined (Windows, Doors, Insulation, Electrical).
        
        2. HEEHRA INCOME TIERS (Rebate Caps):
           - Look at User Income.
           - LOW INCOME (<80% Area Median Income): 100% of project cost covered (up to $14k).
           - MODERATE INCOME (80-150% AMI): ONLY 50% of project cost covered (up to $14k).
           - HIGH INCOME (>150% AMI): $0 HEEHRA rebate.
           - RULE: If Income is >$50k and single/small household, or if unknown, ASSUME MODERATE INCOME (50% coverage). DO NOT promise 100% coverage unless you are certain they are Low Income.
        
        3. NON-REFUNDABLE WARNING:
           - You MUST include a warning field or text stating: "Federal Tax Credits (25C) are non-refundable. You must have enough tax liability to claim them. They do not carry over."
        
        4. SPECIFICITY & CONSERVATISM:
           - If a specific rebate amount is ambiguous, choose the LOWER expected amount.
           - Do NOT double count incentives.
           
        5. URL CHECK: Map SPECIFIC URLs to their upgrades.
        
        Steps:
        1. Identify "Quick Wins" (Low cost).
        2. Identify "Big Bets" (Major upgrades).
        3. Estimate ROI Years.
        4. Calculate total projected yearly savings.
        5. EXTRACT URLs strictly.
        
        {format_instructions}
        """

def generate_roadmap(state: AgentState) -> Dict:
    """Generate the final JSON roadmap."""
    print("Generating Roadmap...")
    profile = state["user_profile"]
    context = "\n".join([str(d) for d in state["documents"]])
    
    parser = JsonOutputParser(pydantic_object=RoadmapOutput)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are GreenGain, a STRICT expert energy financial advisor. Return purely JSON."),
        ("human", ROADMAP_PROMPT_TEMPLATE)
    ])
    
    chain = prompt | llm | parser
    
    try:
        response = chain.invoke({
            "profile": str(profile),
            "context": context,
            "format_instructions": parser.get_format_instructions()
        })
        
        if response is None:
            raise ValueError("Chain returned None")

        for rec in response.get("recommendations", []):
            if rec["type"] == "big_bet" and rec["estimated_cost"] > 0:
                metrics = calculate_roi(
                    rec["estimated_cost"], 
                    rec["rebate_amount"], 
                    rec["federal_credit"], 
                    rec["estimated_monthly_savings"]
                )
                rec["roi_years"] = metrics["roi_years"]
                
        return {"final_roadmap": response}
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Generation Error: {e}")
        return {"final_roadmap": None}

