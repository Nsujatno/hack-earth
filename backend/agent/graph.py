from langgraph.graph import StateGraph, END
from .state import AgentState
from .nodes import (
    analyze_profile,
    route_zip_code,
    retrieve_local,
    retrieve_hybrid,
    grade_documents,
    decide_to_generate,
    generate_roadmap
)

workflow = StateGraph(AgentState)

workflow.add_node("analyze", analyze_profile)
workflow.add_node("retrieve_local", retrieve_local)
workflow.add_node("retrieve_hybrid", retrieve_hybrid)
workflow.add_node("grade", grade_documents)
workflow.add_node("generate", generate_roadmap)

workflow.set_entry_point("analyze")

workflow.add_conditional_edges(
    "analyze",
    route_zip_code,
    {
        "retrieve_local": "retrieve_local",
        "retrieve_hybrid": "retrieve_hybrid"
    }
)

workflow.add_edge("retrieve_local", "generate")
workflow.add_edge("retrieve_hybrid", "grade")

workflow.add_conditional_edges(
    "grade",
    decide_to_generate,
    {
        "generate": "generate",
        "rewrite": "grade"
    }
)

workflow.add_edge("generate", END)

app = workflow.compile()
