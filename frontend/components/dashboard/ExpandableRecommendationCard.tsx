import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComponentRecommendation } from "@/types/dashboard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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

    // Calculations for the Value logic
    const fundingData = recommendation.funding_breakdown || [];
    const totalSavings = fundingData.reduce((sum, item) => sum + item.amount, 0);
    const finalPrice = recommendation.estimated_cost - totalSavings;
    const currentYear = new Date().getFullYear();
    const paybackYear = currentYear + Math.round(recommendation.roi_years || 0);


    const theme = isBigBet ? {
        badge: "bg-secondary/20 text-secondary-foreground",
    } : {
        badge: "bg-primary/20 text-primary",
    };

    return (
        <motion.div layout className="w-full relative">
            <Card
                className={`cursor-pointer overflow-hidden transition-all duration-300 bg-card-background ${isExpanded
                    ? "shadow-lg ring-1 ring-border"
                    : "hover:shadow-md hover:-translate-y-[1px]"
                    }`}
                onClick={onToggle}
            >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-6 py-5">
                    <div className="flex items-center gap-4 flex-grow">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-text-primary tracking-tight">
                                    {recommendation.name}
                                </h3>
                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${theme.badge}`}>
                                    {isBigBet ? "High Impact" : "Quick Win"}
                                </span>
                            </div>
                            
                            {!isExpanded && (
                                <p className="text-text-secondary text-sm leading-relaxed max-w-xl truncate opacity-80">
                                    {recommendation.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 flex-shrink-0 justify-between md:justify-end w-full md:w-auto mt-2 md:mt-0">
                        {!isExpanded && (
                            <div className="text-right hidden sm:block">
                                <span className="text-sm font-medium text-text-secondary mr-2">Save</span>
                                <span className="text-lg font-bold text-text-primary">
                                    ${recommendation.estimated_monthly_savings}/mo
                                </span>
                            </div>
                        )}

                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-text-secondary bg-sub-background p-2 rounded-full"
                        >
                            <ChevronDown className="w-5 h-5" />
                        </motion.div>
                    </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="px-6 pb-8 pt-2">
                                <div className="h-px w-full bg-border/50 mb-8" />

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    
                                    {/* Left Column: Details */}
                                    <div className="flex flex-col justify-between">
                                        <div className="space-y-6">
                                            {/* Full Description */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-text-primary mb-2">Description</h4>
                                                <p className="text-sm text-text-secondary leading-relaxed">
                                                    {recommendation.description}
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-text-primary mb-1">Qualified & Eligible</h4>
                                                    <p className="text-sm text-text-secondary">
                                                        Moderate Income Tier • 50% Costs Covered via HEEHRA
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-text-primary mb-1">Tax Credit Note</h4>
                                                    <p className="text-sm text-text-secondary">
                                                        Requires sufficient tax liability for 25C credit.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-sub-background/40 p-4 rounded-xl border border-border/40 inline-block w-full sm:w-auto">
                                                <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                                                    ROI Projection
                                                </span>
                                                <span className="text-lg font-bold text-text-primary">
                                                    Pays for itself by {paybackYear}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-sub-background/30 p-8 rounded-2xl border border-border/50">
                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between items-center text-text-secondary text-sm">
                                                <span>Market Value</span>
                                                <span className="line-through opacity-70">
                                                    ${recommendation.estimated_cost.toLocaleString()}
                                                </span>
                                            </div>

                                            {fundingData.map((item, i) => (
                                                <div key={i} className="flex flex-col pb-2">
                                                    <div className="flex justify-between items-center text-success font-medium">
                                                        <span className="text-sm">{item.provider}</span>
                                                        <span>- ${item.amount.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <span className="text-[10px] text-text-secondary opacity-80 uppercase tracking-wider">
                                                            {item.source_type.replace('_', ' ')}
                                                        </span>
                                                        {item.url && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    window.open(item.url, '_blank');
                                                                }}
                                                                className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                                                            >
                                                                Claim <ChevronDown className="w-3 h-3 -rotate-90" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="h-px bg-border border-t border-dashed my-2" />

                                            <div className="flex justify-between items-baseline">
                                                <span className="text-text-primary font-bold text-base">Net Price</span>
                                                <span className="text-4xl font-bold text-text-primary tracking-tight">
                                                    ${finalPrice.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}
