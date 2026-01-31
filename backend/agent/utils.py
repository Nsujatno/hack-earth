from typing import Dict, Any

def calculate_roi(
    upfront_cost: float,
    rebate_amount: float,
    federal_credit: float,
    monthly_savings: float
) -> Dict[str, Any]:
    """
    Calculate ROI metrics for an energy upgrade.
    
    Args:
        upfront_cost: Total cost before incentives
        rebate_amount: Local/State rebates
        federal_credit: Federal tax credits
        monthly_savings: Estimated reduction in utility bill
    
    Returns:
        Dict with net_cost, annual_savings, roi_years, ten_year_savings
    """
    net_cost = max(0, upfront_cost - rebate_amount - federal_credit)
    annual_savings = monthly_savings * 12
    
    if annual_savings > 0:
        roi_years = round(net_cost / annual_savings, 1)
    else:
        roi_years = 999.0  # Infinite/Undefined
        
    ten_year_savings = (annual_savings * 10) - net_cost
    
    return {
        "net_cost": net_cost,
        "amount_saved_per_year": annual_savings,
        "roi_years": roi_years,
        "ten_year_savings": ten_year_savings,
        "initial_cost": upfront_cost,
        "total_incentives": rebate_amount + federal_credit
    }
