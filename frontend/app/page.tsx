import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MoneyDisplay } from "@/components/MoneyDisplay";
import Link from "next/link";
import { ArrowRight, Sparkles, Sun, ThermometerSun } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
          
          <Card className="col-span-12 md:col-span-7 lg:col-span-8 flex flex-col justify-center bg-card-background border-border shadow-sm p-8 sm:p-12 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-text-primary text-balance leading-[0.95]">
                Stop leaving money on the table.
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary max-w-xl leading-relaxed text-balance font-medium">
                Turn your home’s carbon footprint into a personal profit center. Find rebates, tax credits, and savings instantly.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/signup">
                <Button size="lg" className="shadow-lg shadow-primary/20">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {/* <Link href="/login">
                <Button variant="secondary" size="lg">
                  See Demo
                </Button>
              </Link> */}
            </div>
          </Card>

          <Card className="col-span-12 md:col-span-5 lg:col-span-4 bg-card-background flex flex-col justify-center items-center relative overflow-hidden">
             
             {/* Decorative background blob */}
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-50" />
             
             <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-10">
               <MoneyDisplay 
                 amount="$4,200" 
                 label="Potential annual savings" 
                 badgeText="Unclaimed" 
               />
               <div className="mt-8 text-sm text-text-secondary text-center px-8 bg-sub-background/50 py-2 rounded-lg backdrop-blur-sm">
                 <span className="font-semibold text-text-primary">Average user</span> finds this much in <br/>state & federal incentives.
               </div>
             </div>
          </Card>

          <Card className="col-span-12 sm:col-span-6 md:col-span-4 bg-card-background hover:border-primary/50 transition-colors group cursor-pointer" hoverEffect>
            <div className="h-full flex flex-col justify-between space-y-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-sub-background rounded-2xl text-text-primary">
                  <ThermometerSun className="h-6 w-6" />
                </div>
                <span className="bg-success/10 text-success text-xs font-bold px-2 py-1 rounded-full">
                  ROI: 15%
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">Heat Pump</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold tracking-tight text-text-primary">$1,500</span>
                  <span className="text-sm text-text-secondary line-through">$8,500</span>
                </div>
                <p className="text-sm text-text-secondary mt-2">After rebates & tax credits</p>
              </div>
            </div>
          </Card>

          <Card className="col-span-12 sm:col-span-6 md:col-span-4 bg-card-background hover:border-primary/50 transition-colors group cursor-pointer" hoverEffect>
            <div className="h-full flex flex-col justify-between space-y-6">
               <div className="flex justify-between items-start">
                <div className="p-3 bg-sub-background rounded-2xl text-text-primary">
                  <Sun className="h-6 w-6" />
                </div>
                <span className="bg-success/10 text-success text-xs font-bold px-2 py-1 rounded-full">
                  ROI: 20%
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">Solar Installation</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold tracking-tight text-text-primary">$12k</span>
                  <span className="text-sm text-text-secondary line-through">$22k</span>
                </div>
                <p className="text-sm text-text-secondary mt-2">Federal tax credit (30%)</p>
              </div>
            </div>
          </Card>
          
          <Card className="col-span-12 md:col-span-4 bg-secondary/10 border-secondary/30 flex flex-col justify-center items-start space-y-4">
             <div className="flex items-center gap-2 text-text-primary font-semibold">
               <Sparkles className="h-5 w-5 fill-secondary text-secondary-foreground" />
               <span>GreenGain AI</span>
             </div>
             <p className="text-text-primary font-medium text-lg leading-snug">
               "Based on zip 94109, you qualify for 3 new incentives added yesterday."
             </p>
          </Card>

        </div>
      </main>
    </div>
  );
}