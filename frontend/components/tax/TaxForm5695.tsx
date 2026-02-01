"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Link2, Calculator, Info, Download } from "lucide-react";
import { ComponentRecommendation } from "@/types/dashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

interface TaxForm5695Props {
    recommendations?: ComponentRecommendation[];
}

export function TaxForm5695({ recommendations = [] }: TaxForm5695Props) {
    // State for Part I: Energy Efficient Home Improvement Credit
    const [insulationCost, setInsulationCost] = useState<number | "">("");
    const [windowsCost, setWindowsCost] = useState<number | "">("");
    const [doorsCost, setDoorsCost] = useState<number | "">("");
    const [auditCost, setAuditCost] = useState<number | "">("");
    const [hvacCost, setHvacCost] = useState<number | "">(""); // Heat pumps, biomass stoves, etc.

    // State for Part II: Residential Clean Energy Credit
    const [solarElectricCost, setSolarElectricCost] = useState<number | "">("");
    const [solarWaterCost, setSolarWaterCost] = useState<number | "">("");
    const [windCost, setWindCost] = useState<number | "">("");
    const [geothermalCost, setGeothermalCost] = useState<number | "">("");
    const [batteryCost, setBatteryCost] = useState<number | "">("");

    const [totalCredit, setTotalCredit] = useState<number>(0);
    const [part1Credit, setPart1Credit] = useState<number>(0);
    const [part2Credit, setPart2Credit] = useState<number>(0);

    // Auto-fill effect
    useEffect(() => {
        if (recommendations.length > 0) {
            let initialInsulation = 0;
            let initialWindows = 0;
            let initialDoors = 0;
            let initialHvac = 0;
            let initialSolar = 0;
            let initialBattery = 0;

            recommendations.forEach(rec => {
                const name = rec.name.toLowerCase();
                const cost = rec.estimated_cost;

                if (name.includes("insulation") || name.includes("air seal")) initialInsulation += cost;
                else if (name.includes("window")) initialWindows += cost;
                else if (name.includes("door")) initialDoors += cost;
                else if (name.includes("heat pump") || name.includes("hvac") || name.includes("biomass")) initialHvac += cost;
                else if (name.includes("solar")) initialSolar += cost;
                else if (name.includes("battery")) initialBattery += cost;
            });

            if (initialInsulation > 0) setInsulationCost(initialInsulation);
            if (initialWindows > 0) setWindowsCost(initialWindows);
            if (initialDoors > 0) setDoorsCost(initialDoors);
            if (initialHvac > 0) setHvacCost(initialHvac);
            if (initialSolar > 0) setSolarElectricCost(initialSolar);
            if (initialBattery > 0) setBatteryCost(initialBattery);
        }
    }, [recommendations]);

    // Calculate credits
    useEffect(() => {
        // Part I logic (simplified estimator)
        // Annual aggregate limit is generally $1,200, but heat pumps/biomass handled separately (up to $2,000)
        // Doors: 30% up to $250 per door, $500 total.
        // Windows: 30% up to $600.
        // Audit: 30% up to $150.

        const insulationVal = Number(insulationCost) || 0;
        const windowsVal = Number(windowsCost) || 0;
        const doorsVal = Number(doorsCost) || 0;
        const auditVal = Number(auditCost) || 0;
        const hvacVal = Number(hvacCost) || 0;

        // Basic limits
        const insulationCredit = insulationVal * 0.30;
        const windowsCredit = Math.min(windowsVal * 0.30, 600); // $600 max for windows
        const doorsCredit = Math.min(doorsVal * 0.30, 500); // $500 max for doors (assuming >= 2 doors for simplicity, else $250/door)
        const auditCredit = Math.min(auditVal * 0.30, 150); // $150 max for audit

        // General aggregate limit for insulation, windows, doors, audit, and electrical upgrades is $1,200
        const generalUpgradeTotal = insulationCredit + windowsCredit + doorsCredit + auditCredit;
        const cappedGeneralCredit = Math.min(generalUpgradeTotal, 1200);

        // Heat pumps / Biomass stoves: 30% up to $2,000
        const hvacCredit = Math.min(hvacVal * 0.30, 2000);

        // Total Part I
        // The total credit limit is $3,200 ($1,200 for general + $2,000 for heat pumps/biomass)
        const p1Total = cappedGeneralCredit + hvacCredit;
        setPart1Credit(p1Total);


        // Part II logic
        // 30% of costs, no annual limit for most items until 2033
        const solarElectricVal = Number(solarElectricCost) || 0;
        const solarWaterVal = Number(solarWaterCost) || 0;
        const windVal = Number(windCost) || 0;
        const geothermalVal = Number(geothermalCost) || 0;
        const batteryVal = Number(batteryCost) || 0;

        const p2Total = (solarElectricVal + solarWaterVal + windVal + geothermalVal + batteryVal) * 0.30;
        setPart2Credit(p2Total);

        setTotalCredit(p1Total + p2Total);

    }, [insulationCost, windowsCost, doorsCost, auditCost, hvacCost, solarElectricCost, solarWaterCost, windCost, geothermalCost, batteryCost]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const handleDownload = () => {
        const data = {
            "Part I: Energy Efficient Home Improvement": {
                "Insulation Cost": insulationCost,
                "Windows Cost": windowsCost,
                "Doors Cost": doorsCost,
                "HVAC/Heat Pump Cost": hvacCost,
                "Audit Cost": auditCost,
                "Estimated Credit": part1Credit
            },
            "Part II: Residential Clean Energy": {
                "Solar Electric Cost": solarElectricCost,
                "Solar Water Cost": solarWaterCost,
                "Wind Cost": windCost,
                "Geothermal Cost": geothermalCost,
                "Battery Cost": batteryCost,
                "Estimated Credit": part2Credit
            },
            "Total Estimated Credit": totalCredit,
            "Date": new Date().toLocaleDateString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tax-credit-estimate-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Residential Energy Credits Estimator</h1>
                    <p className="text-text-secondary">Based on IRS Form 5695 (2023-2032)</p>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="https://www.irs.gov/forms-pubs/about-form-5695"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors"
                    >
                        <Link2 size={18} />
                        View Official IRS Form
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Tabs defaultValue="part1">
                        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex mb-2">
                            <TabsTrigger value="part1">Home Improvement</TabsTrigger>
                            <TabsTrigger value="part2">Clean Energy</TabsTrigger>
                        </TabsList>

                        <TabsContent value="part1">
                            {/* Part I: Home Improvement */}
                            <Card className="p-8 border-primary/10 shadow-lg shadow-primary/5">
                                <div className="flex items-center gap-4 mb-6 text-text-primary border-b border-border/40 pb-4">
                                    <div className="p-3 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
                                        <Calculator size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Energy Efficient Home Improvement Credit</h2>
                                        <p className="text-sm text-text-secondary mt-1">Claim 30% of costs, up to annual limits.</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="col-span-1 sm:col-span-2">
                                            <div className="bg-sub-background/50 rounded-lg p-3 text-xs text-text-secondary mb-2 flex gap-2 items-start">
                                                <Info size={14} className="mt-0.5 shrink-0" />
                                                <span>General annual limit is $1,200 for items below (excluding Heat Pumps).</span>
                                            </div>
                                        </div>
                                        <Input
                                            label="Insulation & Air Sealing"
                                            type="number"
                                            placeholder="0.00"
                                            value={insulationCost}
                                            onChange={(e) => setInsulationCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                            startAdornment="$"
                                        />
                                        <Input
                                            label="Exterior Doors"
                                            type="number"
                                            placeholder="0.00"
                                            value={doorsCost}
                                            onChange={(e) => setDoorsCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                            startAdornment="$"
                                        />
                                        <Input
                                            label="Windows & Skylights"
                                            type="number"
                                            placeholder="0.00"
                                            value={windowsCost}
                                            onChange={(e) => setWindowsCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                            startAdornment="$"
                                        />
                                        <Input
                                            label="Home Energy Audit"
                                            type="number"
                                            placeholder="0.00"
                                            value={auditCost}
                                            onChange={(e) => setAuditCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                            startAdornment="$"
                                        />
                                    </div>

                                    <div className="pt-6 border-t border-border/50">
                                        <div className="bg-sub-background/50 rounded-lg p-3 text-xs text-text-secondary mb-4 flex gap-2 items-start">
                                            <Info size={14} className="mt-0.5 shrink-0" />
                                            <span>Separate $2,000 annual limit for Heat Pumps & Biomass Stoves.</span>
                                        </div>
                                        <Input
                                            label="Heat Pumps, Biomass Stoves, Boilers"
                                            type="number"
                                            placeholder="0.00"
                                            value={hvacCost}
                                            onChange={(e) => setHvacCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                            startAdornment="$"
                                        />
                                    </div>
                                </div>
                                <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 flex justify-between items-center">
                                    <span className="text-text-primary font-semibold">Part I Estimated Credit</span>
                                    <span className="text-2xl font-bold text-primary">{formatCurrency(part1Credit)}</span>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="part2">
                            {/* Part II: Clean Energy */}
                            <Card className="p-8 border-yellow-500/10 shadow-lg shadow-yellow-500/5">
                                <div className="flex items-center gap-4 mb-6 text-text-primary border-b border-border/40 pb-4">
                                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 ring-1 ring-yellow-500/20">
                                        <Info size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Residential Clean Energy Credit</h2>
                                        <p className="text-sm text-text-secondary mt-1">Claim 30% of qualified costs. No annual limit.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Input
                                            label="Solar Electric Property"
                                            type="number"
                                            placeholder="0.00"
                                            value={solarElectricCost}
                                            onChange={(e) => setSolarElectricCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                            startAdornment="$"
                                        />
                                        <Input
                                            label="Solar Water Heating"
                                            type="number"
                                            placeholder="0.00"
                                            value={solarWaterCost}
                                            onChange={(e) => setSolarWaterCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                            startAdornment="$"
                                        />
                                        <Input
                                            label="Small Wind Energy"
                                            type="number"
                                            placeholder="0.00"
                                            value={windCost}
                                            onChange={(e) => setWindCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                            startAdornment="$"
                                        />
                                        <Input
                                            label="Geothermal Heat Pump"
                                            type="number"
                                            placeholder="0.00"
                                            value={geothermalCost}
                                            onChange={(e) => setGeothermalCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                            startAdornment="$"
                                        />
                                        <Input
                                            label="Battery Storage (>3kWh)"
                                            type="number"
                                            placeholder="0.00"
                                            value={batteryCost}
                                            onChange={(e) => setBatteryCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                            startAdornment="$"
                                        />
                                    </div>
                                </div>
                                <div className="mt-8 p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10 flex justify-between items-center">
                                    <span className="text-text-primary font-semibold">Part II Estimated Credit</span>
                                    <span className="text-2xl font-bold text-yellow-500">{formatCurrency(part2Credit)}</span>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Summary Panel */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                        {/* Custom Card Design based on user feedback */}
                        <div className="rounded-3xl bg-primary p-6 text-white shadow-xl">
                            <div className="text-center pt-4 pb-8">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-2 text-primary-foreground">Total Estimated Credit</h3>
                                <div className="text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                                    {formatCurrency(totalCredit)}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 text-text-primary shadow-sm">
                                <div className="space-y-5 mb-8">
                                    <div className="flex justify-between items-baseline pb-4 border-b border-border/60">
                                        <span className="text-text-secondary font-medium">Home Improvement</span>
                                        <span className="text-xl font-bold text-text-primary">{formatCurrency(part1Credit)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline pb-4 border-b border-border/60">
                                        <span className="text-text-secondary font-medium">Clean Energy</span>
                                        <span className="text-xl font-bold text-text-primary">{formatCurrency(part2Credit)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleDownload}
                                    variant="outline"
                                    className="w-full rounded-full h-14 border-border text-text-secondary hover:text-text-primary hover:bg-sub-background/30 hover:border-text-secondary/30 transition-all font-medium"
                                >
                                    <Download size={18} className="mr-2 opacity-70" />
                                    Download Summary
                                </Button>
                            </div>
                        </div>

                        <div className="px-4 py-3 bg-sub-background/30 rounded-xl text-center">
                            <p className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold opacity-60">
                                Estimate for Tax Years 2023-2032
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
