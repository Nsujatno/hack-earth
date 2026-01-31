"use client";

import { mockRoadmapData } from "@/lib/mockData";
import { SummaryStats } from "@/components/dashboard/SummaryStats";
import { ComponentRecommendationStack } from "@/components/dashboard/ComponentRecommendationStack";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
    const { total_projected_savings_yearly, recommendations, summary_text } = mockRoadmapData;

    return (
        <div className="mx-auto w-full">
            <header className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Your Green Roadmap</h1>
                    <p className="text-text-secondary mt-2 max-w-2xl text-base leading-relaxed">{summary_text}</p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <Button variant="secondary">Export PDF</Button>
                    <Button>Update Profile</Button>
                </div>
            </header>

            <SummaryStats totalSavings={total_projected_savings_yearly} />

            <section className="mt-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-primary">Recommended Upgrades</h2>
                    <div className="flex gap-2 text-sm text-text-secondary">
                        <span className="cursor-pointer hover:text-primary font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">All</span>
                        <span className="cursor-pointer hover:text-primary hover:bg-sub-background/50 px-3 py-1 rounded-full transition-colors">Quick Wins</span>
                        <span className="cursor-pointer hover:text-primary hover:bg-sub-background/50 px-3 py-1 rounded-full transition-colors">Big Bets</span>
                    </div>
                </div>

                <div className="mt-6">
                    <ComponentRecommendationStack recommendations={recommendations} />
                </div>
            </section>
        </div>
    );
}
