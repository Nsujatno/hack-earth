import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComponentRecommendation } from "@/types/dashboard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ChevronDown } from "lucide-react";

interface ExpandableRecommendationCardProps {
    recommendation: ComponentRecommendation;
    isExpanded: boolean;
    onToggle: () => void;
}

export function ExpandableRecommendationCard({
    recommendation,
    isExpanded,
    onToggle
}: ExpandableRecommendationCardProps) {
    const isBigBet = recommendation.type === 'big_bet';

    // Define color themes based on type
    // UPDATED: Using 'primary' instead of 'success' for Quick Wins to match key metrics
    const theme = isBigBet ? {
        border: "border-l-secondary",
        badge: "bg-secondary text-secondary-foreground",
        text: "text-secondary-foreground",
        highlight: "text-secondary-foreground",
        button: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    } : {
        border: "border-l-primary",
        badge: "bg-primary text-primary-foreground",
        text: "text-primary",
        highlight: "text-primary",
        button: "bg-primary text-primary-foreground hover:bg-primary/90",
    };

    return (
        <motion.div
            layout
            className="w-full relative"
        >
            <Card
                className={`cursor-pointer overflow-hidden transition-all duration-300 relative border-l-[6px] bg-card-background ${theme.border} ${isExpanded
                        ? "shadow-lg"
                        : "hover:shadow-md hover:bg-sub-background/10"
                    }`}
                onClick={onToggle}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-6 py-2">
                    <div className="flex items-center gap-4 flex-grow">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-text-primary">{recommendation.name}</h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${theme.badge} opacity-90`}>
                                    {isBigBet ? "Big Bet" : "Quick Win"}
                                </span>
                            </div>
                            <p className="text-text-secondary text-sm mt-1 line-clamp-1 opacity-80">
                                {recommendation.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 flex-shrink-0 justify-between md:justify-end w-full md:w-auto mt-2 md:mt-0">
                        <div className="text-right">
                            <div className={`text-xl font-bold ${theme.highlight}`}>${recommendation.estimated_monthly_savings}</div>
                            <div className="text-xs text-text-secondary">saved / mo</div>
                        </div>

                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-text-secondary"
                        >
                            <ChevronDown className="w-5 h-5" />
                        </motion.div>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-6 mt-6 border-t border-border pl-6 pr-6">
                                <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                                    {recommendation.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-sub-background/30 p-4 rounded-lg border border-border/50">
                                        <div className="text-xs text-text-secondary mb-1">Estimated Upfront Cost</div>
                                        <div className="font-semibold text-text-primary text-lg">${recommendation.estimated_cost}</div>
                                    </div>
                                    <div className="bg-sub-background/30 p-4 rounded-lg border border-border/50">
                                        <div className="text-xs text-text-secondary mb-1">Total Available Rebates</div>
                                        <div className={`font-semibold text-lg flex items-center gap-2 ${theme.highlight}`}>
                                            ${recommendation.rebate_amount + recommendation.federal_credit}
                                            {(recommendation.rebate_amount > 0 || recommendation.federal_credit > 0) && (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${theme.badge} opacity-80`}>AVAILABLE</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-sub-background/30 p-4 rounded-lg border border-border/50">
                                        <div className="text-xs text-text-secondary mb-1">Expected Payback Period</div>
                                        <div className={`font-semibold text-lg ${theme.highlight}`}>
                                            {recommendation.roi_years} years
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pb-2">
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(recommendation.learn_more_url, '_blank');
                                        }}
                                        className={`w-full sm:w-auto ${theme.button}`}
                                    >
                                        Get Started & Claim Rebate
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}
