"use client";

import { useState, useEffect } from "react";
import { TaxForm5695 } from "@/components/tax/TaxForm5695";

export default function TaxFormsPage() {
    const [recommendations, setRecommendations] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) return; // Allow public view, but no auto-fill

                const res = await fetch("http://localhost:8000/dashboard", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data && data.roadmap_data && data.roadmap_data.recommendations) {
                        setRecommendations(data.roadmap_data.recommendations);
                    }
                }
            } catch (err) {
                console.error("Failed to load roadmap for auto-fill", err);
            }
        };

        fetchDashboard();
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <TaxForm5695 recommendations={recommendations} />
        </div>
    );
}
