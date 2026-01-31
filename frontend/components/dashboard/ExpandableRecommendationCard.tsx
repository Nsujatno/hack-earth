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
    const theme = isBigBet ? {
        border: "border-secondary/20",
        // UPDATED: Solid badge for prominence
        badge: "bg-secondary text-secondary-foreground shadow-sm",
        text: "text-secondary-foreground",
        highlight: "text-secondary-foreground",
        button: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    } : {
        border: "border-primary/20",
        // UPDATED: Solid badge for prominence
        badge: "bg-primary text-primary-foreground shadow-sm",
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
                className={`cursor-pointer overflow-hidden transition-all duration-300 relative bg-card-background ${isExpanded
                        ? "shadow-lg ring-1 ring-border"
                        : "hover:shadow-md hover:translate-y-[-1px]"
                    }`}
                onClick={onToggle}
            >
                {/* Removed side bubble identifier */}

                {/* Adjusted padding - removed extra left padding */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-6 py-5">
                    <div className="flex items-center gap-4 flex-grow">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-text-primary tracking-tight">{recommendation.name}</h3>
                                {/* Prominent Badge */}
                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${theme.badge} transition-colors`}>
                                    {isBigBet ? "Big Bet" : "Quick Win"}
                                </span>
                            </div>
                            <p className="text-text-secondary text-sm leading-relaxed opacity-80 max-w-xl">
                                {recommendation.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 flex-shrink-0 justify-between md:justify-end w-full md:w-auto mt-2 md:mt-0">
                        <div className="text-right">
                            <div className={`text-xl font-bold ${theme.highlight}`}>${recommendation.estimated_monthly_savings}</div>
                            <div className="text-xs font-medium text-text-secondary uppercase tracking-tight opacity-60">saved / mo</div>
                        </div>

                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-text-secondary bg-sub-background/30 p-1.5 rounded-full"
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
                            <div className={`px-6 pb-8 pt-2`}>
                                <div className={`border-t ${theme.border} w-full opacity-50 mb-6`} />

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-sub-background/20 p-5 rounded-xl border border-border/40">
                                        <div className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2 opacity-70">Upfront Cost</div>
                                        <div className="font-semibold text-text-primary text-xl tracking-tight">${recommendation.estimated_cost.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-sub-background/20 p-5 rounded-xl border border-border/40">
                                        <div className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2 opacity-70">Total Rebates</div>
                                        <div className={`font-semibold text-xl tracking-tight flex items-center gap-2 ${theme.highlight}`}>
                                            ${(recommendation.rebate_amount + recommendation.federal_credit).toLocaleString()}
                                            {(recommendation.rebate_amount > 0 || recommendation.federal_credit > 0) && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badge} opacity-90`}>AVAILABLE</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-sub-background/20 p-5 rounded-xl border border-border/40">
                                        <div className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2 opacity-70">Payback Period</div>
                                        <div className={`font-semibold text-xl tracking-tight ${theme.highlight}`}>
                                            {recommendation.roi_years} years
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(recommendation.learn_more_url, '_blank');
                                        }}
                                        className={`w-full sm:w-auto px-8 py-6 text-sm font-semibold shadow-sm ${theme.button}`}
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
