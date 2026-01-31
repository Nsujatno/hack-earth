"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SelectionCard } from "@/components/ui/SelectionCard";
import { Select } from "@/components/ui/Select";
import { ArrowLeft, ArrowRight, Home, Building, Banknote, Flame, Users } from "lucide-react";

export default function SurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Form State
  const [formData, setFormData] = useState({
    zipCode: "",
    ownership: "",
    homeType: "",
    billElectric: "",
    billGas: "",
    heatingSystem: "",
    homeAge: "",
    incomeRange: "",
  });

  const updateData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      submitSurvey();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitSurvey = async () => {
    console.log("Submitting Survey Data:", formData);
    // TODO: Send to backend
    router.push("/dashboard");
  };

  // Step Validation (Basic)
  const isStepValid = () => {
    switch (step) {
      case 1: return formData.zipCode.length >= 5;
      case 2: return formData.ownership && formData.homeType;
      case 3: return true;
      case 4: return formData.heatingSystem && formData.homeAge;
      case 5: return formData.incomeRange;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-sub-background/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-0 overflow-hidden shadow-xl border-border/60">
        {/* Header with Progress */}
        <div className="bg-card-background p-6 sm:p-8 pb-4 space-y-4">
           <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
             <span>Step {step} of {totalSteps}</span>
             <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
           </div>
           <ProgressBar value={(step / totalSteps) * 100} />
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 sm:p-8 pt-2 min-h-[400px] flex flex-col">
          
          <div className="flex-1 space-y-6">
            {/* Step 1: Location */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-text-primary">Where is your home?</h2>
                  <p className="text-text-secondary">Rebates and tax credits vary significantly by location.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Zip Code</label>
                  <Input
                    id="zipCode"
                    placeholder="e.g. 94103"
                    value={formData.zipCode}
                    onChange={(e) => updateData("zipCode", e.target.value)}
                    className="text-lg tracking-widest"
                    maxLength={5}
                    inputMode="numeric"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Step 2: Property Type */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-text-primary">Tell us about your home.</h2>
                  <p className="text-text-secondary">This helps us determine which upgrades you can make.</p>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-text-primary">Do you own or rent?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <SelectionCard
                      value="own"
                      selected={formData.ownership === "own"}
                      onSelect={(val) => updateData("ownership", val)}
                    >
                      <span className="font-semibold block">I Own</span>
                    </SelectionCard>
                    <SelectionCard
                      value="rent"
                      selected={formData.ownership === "rent"}
                      onSelect={(val) => updateData("ownership", val)}
                    >
                      <span className="font-semibold block">I Rent</span>
                    </SelectionCard>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-text-primary">Home Type</label>
                  <div className="grid grid-cols-1 gap-3">
                    <SelectionCard
                      value="single_family"
                      selected={formData.homeType === "single_family"}
                      onSelect={(val) => updateData("homeType", val)}
                    >
                      <div className="flex items-center gap-3">
                        <Home className="h-5 w-5 text-text-secondary" />
                        <span>Single Family Home</span>
                      </div>
                    </SelectionCard>
                    <SelectionCard
                      value="condo"
                      selected={formData.homeType === "condo"}
                      onSelect={(val) => updateData("homeType", val)}
                    >
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-text-secondary" />
                        <span>Condo / Townhouse</span>
                      </div>
                    </SelectionCard>
                     <SelectionCard
                      value="apartment"
                      selected={formData.homeType === "apartment"}
                      onSelect={(val) => updateData("homeType", val)}
                    >
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-text-secondary" />
                        <span>Apartment</span>
                      </div>
                    </SelectionCard>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Usage */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-text-primary">Energy Usage</h2>
                  <p className="text-text-secondary">Estimating your monthly bills helps us calculate ROI.</p>
                </div>
                
                <div className="space-y-4">
                   <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-primary">Avg. Monthly Electric Bill ($) <span className="text-text-secondary font-normal">(Optional)</span></label>
                     <div className="relative">
                       <span className="absolute left-3 top-3 text-text-secondary">$</span>
                       <Input
                        id="billElectric"
                        placeholder="150"
                        value={formData.billElectric}
                        onChange={(e) => updateData("billElectric", e.target.value)}
                        className="pl-8"
                        type="number"
                      />
                     </div>
                  </div>
                   <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-primary">Avg. Monthly Gas Bill ($) <span className="text-text-secondary font-normal">(Optional)</span></label>
                    <div className="relative">
                       <span className="absolute left-3 top-3 text-text-secondary">$</span>
                       <Input
                        id="billGas"
                        placeholder="50"
                        value={formData.billGas}
                        onChange={(e) => updateData("billGas", e.target.value)}
                         className="pl-8"
                         type="number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Systems & Age */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-text-primary">Heating & Age</h2>
                  <p className="text-text-secondary">Older homes and gas systems often have the biggest upgrade incentives.</p>
                </div>

                 <div className="space-y-3">
                  <label className="text-sm font-semibold text-text-primary">Current Heating System</label>
                   <Select 
                     value={formData.heatingSystem}
                     onChange={(e) => updateData("heatingSystem", e.target.value)}
                   >
                     <option value="" disabled>Select a system</option>
                     <option value="gas_furnace">Gas Furnace</option>
                     <option value="electric_baseboard">Electric (Baseboard/Wall)</option>
                     <option value="heat_pump">Heat Pump (Existing)</option>
                     <option value="oil_propane">Oil / Propane</option>
                     <option value="other">Other / None</option>
                   </Select>
                 </div>

                 <div className="space-y-3">
                  <label className="text-sm font-semibold text-text-primary">Approx. Age of Home</label>
                   <Input
                    id="homeAge"
                    placeholder="e.g. 1985"
                    value={formData.homeAge}
                    onChange={(e) => updateData("homeAge", e.target.value)}
                    type="number"
                  />
                 </div>
              </div>
            )}

            {/* Step 5: Income */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-text-primary">Impact Eligibility</h2>
                  <p className="text-text-secondary">Many states offer "low-to-moderate income" bonus rebates. This is optional/private.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-text-primary">Annual Household Income</label>
                  <Select 
                     value={formData.incomeRange}
                     onChange={(e) => updateData("incomeRange", e.target.value)}
                   >
                     <option value="" disabled>Select range</option>
                     <option value="under_50k">Under $50,000</option>
                     <option value="50k_80k">$50,000 - $80,000</option>
                     <option value="80k_150k">$80,000 - $150,000</option>
                     <option value="over_150k">Over $150,000</option>
                   </Select>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="pt-8 flex gap-4 mt-auto">
            {step > 1 && (
              <Button 
                variant="secondary" 
                onClick={handleBack}
                className="flex-1"
                type="button"
              >
                Back
              </Button>
            )}
            <Button 
              variant="primary" 
              onClick={handleNext} 
              disabled={!isStepValid()}
              className="flex-1"
              type="button"
            >
              {step === totalSteps ? "Finish" : "Next"} 
              {step !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>

        </div>
      </Card>
    </div>
  );
}
