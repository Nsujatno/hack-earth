"use client";

import { mockRoadmapData } from "@/lib/mockData";
import { SummaryStats } from "@/components/dashboard/SummaryStats";
import { ComponentRecommendationStack } from "@/components/dashboard/ComponentRecommendationStack";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
    const { total_projected_savings_yearly, recommendations, summary_text } = mockRoadmapData;

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Your Green Roadmap</h1>
                    <p className="text-text-secondary mt-2 max-w-2xl">{summary_text}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary">Export PDF</Button>
                    <Button>Update Profile</Button>
                </div>
            </header>

            <main>
                <SummaryStats totalSavings={total_projected_savings_yearly} />

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-text-primary">Recommended Upgrades</h2>
                        <div className="flex gap-2 text-sm text-text-secondary">
                            <span className="cursor-pointer hover:text-primary font-medium text-primary">All</span>
                            <span className="cursor-pointer hover:text-primary">Quick Wins</span>
                            <span className="cursor-pointer hover:text-primary">Big Bets</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <ComponentRecommendationStack recommendations={recommendations} />
                    </div>
                </section>
            </main>
        </div>
    );
}
