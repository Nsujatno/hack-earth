"use client";

import { mockRoadmapData } from "@/lib/mockData";
import { SummaryStats } from "@/components/dashboard/SummaryStats";
import { ComponentRecommendationStack } from "@/components/dashboard/ComponentRecommendationStack";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";

export default function DashboardPage() {
    const [roadmapData, setRoadmapData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const res = await fetch("http://localhost:8000/dashboard", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Failed to load dashboard");
                
                const data = await res.json();
                if (data && data.roadmap_data) {
                    setRoadmapData(data.roadmap_data);
                } else {
                    setRoadmapData(null);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load your roadmap.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                     <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                     <p className="text-text-secondary animate-pulse">Loading your green roadmap...</p>
                </div>
            </div>
        );
    }

    if (!roadmapData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="text-center max-w-md space-y-6">
                    <h1 className="text-2xl font-bold text-text-primary">No Roadmap Found</h1>
                    <p className="text-text-secondary">We couldn't find a generated roadmap for you yet. Please complete the survey to get started.</p>
                    <Button onClick={() => window.location.href = "/survey"}>Take Survey</Button>
                </div>
            </div>
        );
    }

    const { total_projected_savings_yearly, recommendations, summary_text } = roadmapData;
    
    // Calculate derived stats from funding breakdown
    const totalPotentialRebates = recommendations.reduce((total: number, rec: any) => {
        const funding = rec.funding_breakdown || [];
        return total + funding.reduce((sum: number, f: any) => sum + f.amount, 0);
    }, 0);

    return (
        <div className="mx-auto w-full">
            <header className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Your Green Roadmap</h1>
                    <p className="text-text-secondary mt-2 max-w-2xl text-base leading-relaxed">{summary_text}</p>
                </div>
            </header>

            <main>
                <SummaryStats 
                    totalSavings={total_projected_savings_yearly} 
                    recommendationCount={recommendations.length}
                    potentialRebates={totalPotentialRebates}
                />

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
