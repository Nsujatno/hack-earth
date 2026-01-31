import { Card } from "@/components/ui/Card";
import { useCountUp } from "@/hooks/useCountUp";

interface SummaryStatsProps {
    totalSavings: number;
}

export function SummaryStats({ totalSavings }: SummaryStatsProps) {
    const animatedSavings = useCountUp(totalSavings);
    const animatedRecommendations = useCountUp(5);
    const animatedRebates = useCountUp(850);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-primary text-primary-foreground border-none">
                <div className="flex flex-col gap-2">
                    <span className="text-primary-foreground/80 text-sm font-medium">Total Projected Savings</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight">${animatedSavings.toLocaleString()}</span>
                        <span className="text-sm font-medium opacity-80">/ year</span>
                    </div>
                    <p className="text-xs mt-2 bg-primary-foreground/10 p-2 rounded-lg inline-block self-start">
                        ↗ Increased from last month
                    </p>
                </div>
            </Card>

            <Card>
                <div className="flex flex-col gap-2">
                    <span className="text-text-secondary text-sm font-medium">Active Recommendations</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight text-text-primary">{animatedRecommendations}</span>
                    </div>
                    <p className="text-xs mt-2 text-text-secondary">
                        2 Quick Wins available
                    </p>
                </div>
            </Card>

            <Card>
                <div className="flex flex-col gap-2">
                    <span className="text-text-secondary text-sm font-medium">Potential Rebates</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight text-text-primary">${animatedRebates}</span>
                    </div>
                    <p className="text-xs mt-2 text-text-secondary">
                        Federal & Local combined
                    </p>
                </div>
            </Card>
        </div>
    );
}
