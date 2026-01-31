import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { ComponentRecommendation } from "@/types/dashboard";
import { ExpandableRecommendationCard } from "./ExpandableRecommendationCard";

interface ComponentRecommendationStackProps {
    recommendations: ComponentRecommendation[];
}

export function ComponentRecommendationStack({ recommendations }: ComponentRecommendationStackProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpandedId(expandedId === index ? null : index);
    };

    return (
        <LayoutGroup>
            <motion.div
                className="flex flex-col gap-4"
                layout
            >
                {recommendations.map((rec, index) => (
                    <ExpandableRecommendationCard
                        key={index}
                        recommendation={rec}
                        isExpanded={expandedId === index}
                        onToggle={() => toggleExpand(index)}
                    />
                ))}
            </motion.div>
        </LayoutGroup>
    );
}
