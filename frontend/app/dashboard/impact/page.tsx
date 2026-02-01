"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ImpactItem {
    analogy: string;
    co2_saved_tons: number;
}

interface ImpactData {
    total_co2_saved_tons: number;
    impact_summary: string;
    breakdown: Record<string, ImpactItem>;
}

export default function ImpactPage() {
    const [data, setData] = useState<ImpactData | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    const fetchImpact = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const res = await fetch("http://localhost:8000/impact", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                const json = await res.json();
                if (json && json.user_id) { // Check if valid data
                    setData(json);
                    setLoading(false);
                    return true;
                }
            }
            return false;
        } catch (err) {
            console.error("Fetch error:", err);
            return false;
        }
    };

    const generateImpact = async () => {
        try {
            setGenerating(true);
            const token = localStorage.getItem("access_token");
            const res = await fetch("http://localhost:8000/impact/generate", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to generate impact");
            
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error("Generation error:", err);
            setError("Failed to generate your impact report. Please try again later.");
        } finally {
            setGenerating(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            const hasData = await fetchImpact();
            if (!hasData) {
                // If no data found, try to generate
                await generateImpact();
            }
        };
        init();
    }, []);

    if (loading || generating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                     <div className="h-12 w-12 border-4 border-success border-t-transparent rounded-full animate-spin mx-auto"></div>
                     <p className="text-text-secondary animate-pulse">
                        {generating ? "Calculating your environmental impact..." : "Loading..."}
                     </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                 <div className="text-center max-w-md space-y-6">
                    <h1 className="text-2xl font-bold text-text-primary">Error</h1>
                    <p className="text-text-secondary">{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="mx-auto w-full max-w-6xl">
            <header className="mb-10 text-center lg:text-left">
                <h1 className="text-3xl font-bold text-text-primary tracking-tight">Your Environmental Impact</h1>
                <p className="text-text-secondary mt-2 text-lg">See how your upgrades help the planet.</p>
            </header>

            {/* Hero Stats */}
            <div className="bg-gradient-to-br from-success/20 to-success/5 rounded-3xl p-8 mb-12 text-center border border-success/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-success/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <h2 className="text-text-secondary font-medium uppercase tracking-widest text-sm mb-2 relative z-10">Total CO2 Reduction</h2>
                <div className="text-6xl md:text-7xl font-extrabold text-success mb-2 relative z-10">
                    {data.total_co2_saved_tons.toFixed(1)}
                    <span className="text-2xl md:text-3xl ml-2 font-bold text-success/80">tons / year</span>
                </div>
                <p className="max-w-xl mx-auto text-text-secondary relative z-10">
                    {data.impact_summary}
                </p>
            </div>

            {/* Breakdown Grid */}
            <h3 className="text-xl font-bold text-text-primary mb-6">Impact Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(data.breakdown).map(([name, item], index) => (
                    <Card key={index} hoverEffect className="flex flex-col h-full border-border/50">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-lg text-text-primary line-clamp-2">{name}</h4>
                            <span className="bg-success/10 text-success text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                                {item.co2_saved_tons} tons
                            </span>
                        </div>
                        <div className="flex-grow">
                             <p className="text-text-secondary italic">"{item.analogy}"</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
