export interface ComponentRecommendation {
    name: string;
    type: 'quick_win' | 'big_bet';
    description: string;
    estimated_cost: number;
    rebate_amount: number;
    federal_credit: number;
    estimated_monthly_savings: number;
    roi_years?: number;
    source_citation: string;
    learn_more_url: string;
}

export interface RoadmapOutput {
    total_projected_savings_yearly: number;
    recommendations: ComponentRecommendation[];
    summary_text: string;
}
