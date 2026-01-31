import { ComponentRecommendation } from "@/types/dashboard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface RecommendationCardProps {
    recommendation: ComponentRecommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
    const isBigBet = recommendation.type === 'big_bet';

    return (
        <Card hoverEffect className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full w-fit uppercase tracking-wider ${isBigBet
                            ? "bg-secondary/30 text-secondary-foreground"
                            : "bg-success/10 text-success"
                        }`}>
                        {isBigBet ? "Big Bet" : "Quick Win"}
                    </span>
                    <h3 className="text-lg font-bold text-text-primary mt-2">{recommendation.name}</h3>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-success">${recommendation.estimated_monthly_savings}</div>
                    <div className="text-xs text-text-secondary">saved / mo</div>
                </div>
            </div>

            <p className="text-text-secondary text-sm mb-6 flex-grow">
                {recommendation.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-border">
                <div>
                    <div className="text-xs text-text-secondary mb-1">Estimated Cost</div>
                    <div className="font-semibold text-text-primary">${recommendation.estimated_cost}</div>
                </div>
                <div>
                    {(() => {
                        const fundingData = recommendation.funding_breakdown || [];
                        const totalSavings = fundingData.reduce((sum, item) => sum + item.amount, 0);
                        return (
                            <>
                                <div className="text-xs text-text-secondary mb-1">Rebate Value</div>
                                <div className="font-semibold text-success flex items-center gap-1">
                                    ${totalSavings}
                                    {totalSavings > 0 && (
                                        <span className="text-[10px] bg-success/10 px-1 rounded">AVAILABLE</span>
                                    )}
                                </div>
                            </>
                        );
                    })()}
                </div>

                {recommendation.roi_years !== undefined && recommendation.roi_years > 0 && (
                    <div className="col-span-2 mt-2">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-text-secondary">ROI Timeframe</span>
                            <span className="font-medium">{recommendation.roi_years} years</span>
                        </div>
                        <ProgressBar value={100 - (recommendation.roi_years * 10)} className="h-1.5" />
                    </div>
                )}
            </div>

            <div className="mt-auto pt-2">
                <Button
                    variant="secondary"
                    fullWidth
                    disabled={!(recommendation.funding_breakdown?.some(f => f.url))}
                    onClick={() => {
                        const firstUrl = recommendation.funding_breakdown?.find(f => f.url)?.url;
                        if (firstUrl) window.open(firstUrl, '_blank');
                    }}
                >
                    View Details
                </Button>
            </div>
        </Card>
    );
}
