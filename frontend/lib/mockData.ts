import { RoadmapOutput } from "@/types/dashboard";

export const mockRoadmapData: RoadmapOutput = {
    total_projected_savings_yearly: 4200.00,
    summary_text: "Based on your home profile, we have identified these high-impact upgrades to improve your home's efficiency and reduce your monthly energy costs.",
    recommendations: [
        {
            name: "Air Source Heat Pump (ASHP)",
            type: "big_bet",
            description: "Replace inefficient resistance heating with a high-efficiency Air Source Heat Pump.",
            estimated_cost: 12000.00,
            rebate_amount: 4000.00,
            federal_credit: 0, // Simplified as user gave total rebate/credit
            estimated_monthly_savings: 100.00,
            roi_years: 6.7,
            source_citation: "Energy Star",
            learn_more_url: "https://www.energystar.gov/about/federal-tax-credits"
        },
        {
            name: "Comprehensive Weatherization",
            type: "big_bet",
            description: "Install comprehensive weatherization to reduce energy waste.",
            estimated_cost: 5000.00,
            rebate_amount: 2400.00,
            federal_credit: 0,
            estimated_monthly_savings: 30.00,
            roi_years: 7.2,
            source_citation: "Energy Star",
            learn_more_url: "https://www.energystar.gov/about/federal-tax-credits"
        },
        {
            name: "Residential Solar PV + Battery Storage",
            type: "big_bet",
            description: "Install Solar PV and Battery Storage to significantly offset remaining electricity costs.",
            estimated_cost: 30000.00,
            rebate_amount: 19500.00,
            federal_credit: 0,
            estimated_monthly_savings: 200.00,
            roi_years: 4.4,
            source_citation: "Reliant",
            learn_more_url: "https://www.reliant.com/en/residential/electricity/renewable-energy/solar/solar-energy-rebates-and-incentives"
        },
        {
            name: "Heat Pump Water Heater (HPWH)",
            type: "quick_win",
            description: "Upgrade to a high-efficiency Heat Pump Water Heater.",
            estimated_cost: 3000.00,
            rebate_amount: 1200.00,
            federal_credit: 0,
            estimated_monthly_savings: 20.00,
            roi_years: 10.0,
            source_citation: "Energy Star",
            learn_more_url: "https://www.energystar.gov/about/federal-tax-credits"
        }
    ]
};
