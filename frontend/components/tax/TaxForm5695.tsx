"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Link2, Calculator, Info, Download, AlertTriangle } from "lucide-react";
import { ComponentRecommendation } from "@/types/dashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

interface TaxForm5695Props {
    recommendations?: ComponentRecommendation[];
}

export function TaxForm5695({ recommendations = [] }: TaxForm5695Props) {
    // --- PART I: Residential Clean Energy Credit (No Annual Cap) ---
    const [solarElectricCost, setSolarElectricCost] = useState<number | "">("");
    const [solarWaterCost, setSolarWaterCost] = useState<number | "">("");
    const [windCost, setWindCost] = useState<number | "">("");
    const [geothermalCost, setGeothermalCost] = useState<number | "">("");
    const [batteryCost, setBatteryCost] = useState<number | "">("");

    // Fuel Cell Logic (Lines 7a-11)
    const [fuelCellCost, setFuelCellCost] = useState<number | "">("");
    const [fuelCellCapacity, setFuelCellCapacity] = useState<number | "">(""); // in kW

    // --- PART II: Energy Efficient Home Improvement Credit (Annual Caps Apply) ---

    // Section A: Envelope Improvements (Included in $1,200 Aggregate)
    const [insulationCost, setInsulationCost] = useState<number | "">("");
    const [windowsCost, setWindowsCost] = useState<number | "">("");
    const [doorsCost, setDoorsCost] = useState<number | "">("");
    const [numDoors, setNumDoors] = useState<number | "">(""); // Required for $250/door limit

    // Section B: Residential Energy Property (Included in $1,200 Aggregate - Max $600/item)
    const [centralAirCost, setCentralAirCost] = useState<number | "">("");
    const [waterHeaterCost, setWaterHeaterCost] = useState<number | "">(""); // Gas/Oil/Propane
    const [furnaceCost, setFurnaceCost] = useState<number | "">(""); // Gas/Oil/Propane
    const [elecPanelCost, setElecPanelCost] = useState<number | "">("");

    // Section B: Heat Pumps & Biomass (Separate $2,000 Aggregate)
    const [heatPumpCost, setHeatPumpCost] = useState<number | "">(""); // Electric/Gas Heat Pumps & HP Water Heaters
    const [biomassCost, setBiomassCost] = useState<number | "">("");

    // Audit
    const [auditCost, setAuditCost] = useState<number | "">("");

    // Totals
    const [totalCredit, setTotalCredit] = useState<number>(0);
    const [homeImprovementCredit, setHomeImprovementCredit] = useState<number>(0);
    const [cleanEnergyCredit, setCleanEnergyCredit] = useState<number>(0);

    // Auto-fill effect
    useEffect(() => {
        if (recommendations.length > 0) {
            // Reset logic for auto-fill omitted for brevity, but map specific items like "Central Air" vs "Heat Pump" here
        }
    }, [recommendations]);

    // Calculate credits
    useEffect(() => {
        // --- PART I CALCULATIONS ---
        const solarElectricVal = Number(solarElectricCost) || 0;
        const solarWaterVal = Number(solarWaterCost) || 0;
        const windVal = Number(windCost) || 0;
        const geothermalVal = Number(geothermalCost) || 0;
        const batteryVal = Number(batteryCost) || 0;

        // Fuel Cell Calculation: Min(30% of cost, $1,000 * kW capacity)
        const fuelCellVal = Number(fuelCellCost) || 0;
        const fuelCellCapVal = Number(fuelCellCapacity) || 0;
        const fuelCellBaseCredit = fuelCellVal * 0.30;
        const fuelCellCapLimit = fuelCellCapVal * 1000; // $500 per 0.5kW = $1000 per 1kW
        const fuelCellCredit = (fuelCellVal > 0 && fuelCellCapVal > 0)
            ? Math.min(fuelCellBaseCredit, fuelCellCapLimit)
            : 0;

        const part1Total = (solarElectricVal + solarWaterVal + windVal + geothermalVal + batteryVal) * 0.30 + fuelCellCredit;
        setCleanEnergyCredit(part1Total);


        // --- PART II CALCULATIONS ---

        // 1. Envelope Improvements (Inside $1,200 Agg)
        const insulationCredit = Math.min((Number(insulationCost) || 0) * 0.30, 1200); // Max $1200 specifically for insulation
        const windowsCredit = Math.min((Number(windowsCost) || 0) * 0.30, 600); // Max $600 total

        // Doors: Max $250 per door, Max $500 total
        const doorVal = Number(doorsCost) || 0;
        const doorCount = Number(numDoors) || 1;
        // If we don't know exact cost per door, we estimate. 
        // Accurate way: If cost/door > $833, credit is $250. 
        // Simplified estimator: 30% capped at $500 total, and further checks if user selected 1 door (max $250).
        let doorsCredit = doorVal * 0.30;
        if (doorCount === 1) doorsCredit = Math.min(doorsCredit, 250);
        else doorsCredit = Math.min(doorsCredit, 500);

        // 2. Residential Energy Property (Inside $1,200 Agg, Max $600 per item)
        const centralAirCredit = Math.min((Number(centralAirCost) || 0) * 0.30, 600);
        const waterHeaterCredit = Math.min((Number(waterHeaterCost) || 0) * 0.30, 600); // Gas/Propane/Oil
        const furnaceCredit = Math.min((Number(furnaceCost) || 0) * 0.30, 600); // Gas/Propane/Oil
        const elecPanelCredit = Math.min((Number(elecPanelCost) || 0) * 0.30, 600);

        // 3. Audit (Inside $1,200 Agg, Max $150)
        const auditCredit = Math.min((Number(auditCost) || 0) * 0.30, 150);

        // Sum of "General" items
        const generalSubtotal = insulationCredit + windowsCredit + doorsCredit +
            centralAirCredit + waterHeaterCredit + furnaceCredit + elecPanelCredit +
            auditCredit;

        // Apply Aggregate Limit for General Items ($1,200)
        const cappedGeneralCredit = Math.min(generalSubtotal, 1200);

        // 4. Heat Pumps & Biomass (Separate $2,000 Agg)
        const hpVal = Number(heatPumpCost) || 0;
        const bioVal = Number(biomassCost) || 0;
        const heatPumpCredit = Math.min((hpVal + bioVal) * 0.30, 2000);

        // Total Part II
        const part2Total = cappedGeneralCredit + heatPumpCredit;
        setHomeImprovementCredit(part2Total);

        setTotalCredit(part1Total + part2Total);

    }, [
        solarElectricCost, solarWaterCost, windCost, geothermalCost, batteryCost, fuelCellCost, fuelCellCapacity,
        insulationCost, windowsCost, doorsCost, numDoors, centralAirCost, waterHeaterCost, furnaceCost, elecPanelCost,
        auditCost, heatPumpCost, biomassCost
    ]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Residential Energy Credits Estimator</h1>
                    <p className="text-text-secondary">Based on IRS Form 5695 </p>
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
                            <TabsTrigger value="part1">Clean Energy (Part I)</TabsTrigger>
                            <TabsTrigger value="part2">Home Improvement (Part II)</TabsTrigger>
                        </TabsList>

                        <TabsContent value="part1">
                            {/* Part I: Clean Energy */}
                            <Card className="p-8 border-yellow-500/10 shadow-lg shadow-yellow-500/5">
                                <div className="flex items-center gap-4 mb-6 text-text-primary border-b border-border/40 pb-4">
                                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 ring-1 ring-yellow-500/20">
                                        <Info size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Part I: Residential Clean Energy Credit</h2>
                                        <p className="text-sm text-text-secondary mt-1">30% credit. No annual maximum (except Fuel Cells).</p>
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

                                    {/* Fuel Cell Section */}
                                    <div className="p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/10 mt-4">
                                        <h3 className="text-sm font-semibold text-text-primary mb-3">Qualified Fuel Cell Property</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Input
                                                label="Fuel Cell Cost"
                                                type="number"
                                                placeholder="0.00"
                                                value={fuelCellCost}
                                                onChange={(e) => setFuelCellCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                startAdornment="$"
                                            />
                                            <Input
                                                label="Capacity (Kilowatts)"
                                                type="number"
                                                placeholder="0.5"
                                                value={fuelCellCapacity}
                                                onChange={(e) => setFuelCellCapacity(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                endAdornment="kW"
                                            />
                                        </div>
                                        <p className="text-xs text-text-secondary mt-2">
                                            *Limited to $500 per 0.5 kW of capacity.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10 flex justify-between items-center">
                                    <span className="text-text-primary font-semibold">Part I Estimated Credit</span>
                                    <span className="text-2xl font-bold text-yellow-500">{formatCurrency(cleanEnergyCredit)}</span>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="part2">
                            {/* Part II: Home Improvement */}
                            <Card className="p-8 border-primary/10 shadow-lg shadow-primary/5">
                                <div className="flex items-center gap-4 mb-6 text-text-primary border-b border-border/40 pb-4">
                                    <div className="p-3 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
                                        <Calculator size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Part II: Energy Efficient Home Improvement</h2>
                                        <p className="text-sm text-text-secondary mt-1">Subject to annual limits ($1,200 General / $2,000 Heat Pump).</p>
                                    </div>
                                </div>
                                <div className="space-y-8">

                                    {/* General Bucket */}
                                    <div>
                                        <div className="bg-sub-background/50 rounded-lg p-3 text-xs text-text-secondary mb-4 flex gap-2 items-start border-l-2 border-primary">
                                            <Info size={14} className="mt-0.5 shrink-0 text-primary" />
                                            <div>
                                                <span className="font-semibold text-text-primary">General Annual Limit: $1,200 total</span>
                                                <p>Includes Insulation, Windows, Doors, and standard Central Air/Gas Furnaces/Water Heaters.</p>
                                            </div>
                                        </div>

                                        <h3 className="text-sm font-semibold text-text-primary mb-3">Envelope Improvements</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                            <Input
                                                label="Insulation & Air Sealing"
                                                type="number"
                                                placeholder="0.00"
                                                value={insulationCost}
                                                onChange={(e) => setInsulationCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                startAdornment="$"
                                            />
                                            <Input
                                                label="Windows & Skylights"
                                                type="number"
                                                placeholder="0.00"
                                                value={windowsCost}
                                                onChange={(e) => setWindowsCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                startAdornment="$"
                                                helperText="Max credit $600"
                                            />
                                            <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="sm:col-span-2">
                                                    <Input
                                                        label="Exterior Doors"
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={doorsCost}
                                                        onChange={(e) => setDoorsCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                        startAdornment="$"
                                                        helperText="Max credit $250/door, $500 total"
                                                    />
                                                </div>
                                                <Input
                                                    label="Quantity"
                                                    type="number"
                                                    placeholder="1"
                                                    value={numDoors}
                                                    onChange={(e) => setNumDoors(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        <h3 className="text-sm font-semibold text-text-primary mb-3">Standard Energy Property (Max $600 credit each)</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <Input
                                                label="Central Air Conditioner"
                                                type="number"
                                                placeholder="0.00"
                                                value={centralAirCost}
                                                onChange={(e) => setCentralAirCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                startAdornment="$"
                                            />
                                            <Input
                                                label="Gas/Propane/Oil Water Heater"
                                                type="number"
                                                placeholder="0.00"
                                                value={waterHeaterCost}
                                                onChange={(e) => setWaterHeaterCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                startAdornment="$"
                                            />
                                            <Input
                                                label="Gas/Propane/Oil Furnace/Boiler"
                                                type="number"
                                                placeholder="0.00"
                                                value={furnaceCost}
                                                onChange={(e) => setFurnaceCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                startAdornment="$"
                                            />
                                            <Input
                                                label="Electrical Panel Upgrade"
                                                type="number"
                                                placeholder="0.00"
                                                value={elecPanelCost}
                                                onChange={(e) => setElecPanelCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                startAdornment="$"
                                            />
                                        </div>

                                        <div className="mt-6">
                                            <Input
                                                label="Home Energy Audit"
                                                type="number"
                                                placeholder="0.00"
                                                value={auditCost}
                                                onChange={(e) => setAuditCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                startAdornment="$"
                                                helperText="Max credit $150"
                                            />
                                        </div>
                                    </div>

                                    {/* Heat Pump Bucket */}
                                    <div className="pt-6 border-t border-border/50">
                                        <div className="bg-sub-background/50 rounded-lg p-3 text-xs text-text-secondary mb-4 flex gap-2 items-start border-l-2 border-green-500">
                                            <Info size={14} className="mt-0.5 shrink-0 text-green-500" />
                                            <div>
                                                <span className="font-semibold text-text-primary">Separate Limit: $2,000</span>
                                                <p>For Heat Pumps, Heat Pump Water Heaters, and Biomass Stoves only.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <Input
                                                label="Electric/Gas Heat Pumps"
                                                type="number"
                                                placeholder="0.00"
                                                value={heatPumpCost}
                                                onChange={(e) => setHeatPumpCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                startAdornment="$"
                                                helperText="Includes HP Water Heaters"
                                            />
                                            <Input
                                                label="Biomass Stoves/Boilers"
                                                type="number"
                                                placeholder="0.00"
                                                value={biomassCost}
                                                onChange={(e) => setBiomassCost(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                                startAdornment="$"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 flex justify-between items-center">
                                    <span className="text-text-primary font-semibold">Part II Estimated Credit</span>
                                    <span className="text-2xl font-bold text-primary">{formatCurrency(homeImprovementCredit)}</span>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Summary Panel */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                        <div className="rounded-3xl bg-primary p-6 text-white shadow-xl">
                            <div className="text-center pt-4 pb-8">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-2 text-primary-foreground">Total Estimated Credit</h3>
                                <div className="text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                                    {formatCurrency(totalCredit)}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 text-text-primary shadow-sm">
                                <div className="space-y-5">
                                    <div className="flex justify-between items-baseline pb-4 border-b border-border/60">
                                        <span className="text-text-secondary font-medium">Clean Energy</span>
                                        <span className="text-xl font-bold text-text-primary">{formatCurrency(cleanEnergyCredit)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-2">
                                        <span className="text-text-secondary font-medium">Home Improvement</span>
                                        <span className="text-xl font-bold text-text-primary">{formatCurrency(homeImprovementCredit)}</span>
                                    </div>
                                </div>
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