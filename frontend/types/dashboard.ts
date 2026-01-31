export interface ComponentRecommendation {
    name: string;
    type: 'quick_win' | 'big_bet';
    description: string;
    estimated_cost: number;
    funding_breakdown: FundingItem[];
    estimated_monthly_savings: number;
    roi_years?: number;
    source_citation: string;
}

export interface FundingItem {
    source_type: "instant_rebate" | "tax_credit" | "future_grant";
    provider: string;
    amount: number;
    url: string;
}

export interface RoadmapOutput {
    total_projected_savings_yearly: number;
    recommendations: ComponentRecommendation[];
    summary_text: string;
}
