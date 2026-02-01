"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { ArrowRight, FileText, ExternalLink, HelpCircle, BookOpen, Calculator } from "lucide-react";
import Link from "next/link";

export default function InfoPage() {
    const faqItems = [
        {
            title: "How do I use the Tax Credit Estimator?",
            content: (
                <p>
                    Our estimator works in two parts based on IRS Form 5695.
                    <strong> Part I (Clean Energy)</strong> covers solar, wind, and battery storage with no annual limit.
                    <strong> Part II (Home Improvement)</strong> covers windows, doors, insulation, and HVAC with annual caps ($1,200 general / $2,000 heat pump).
                    Simply switch between the tabs and enter your project costs to see your estimated potential credit.
                </p>
            )
        },
        {
            title: "What is the difference between Part I and Part II credits?",
            content: (
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Part I (Residential Clean Energy Credit):</strong> 30% of qualified costs for solar, wind, geothermal, and battery storage. This credit has <strong>no annual dollar limit</strong> and unused credit can be carried forward to future tax years.</li>
                    <li><strong>Part II (Energy Efficient Home Improvement Credit):</strong> 30% of costs for envelope improvements (windows/doors/insulation) and energy property (HVAC/heaters). This credit is subject to <strong>annual caps</strong> (e.g., $1,200 total per year) and generally cannot be carried forward.</li>
                </ul>
            )
        },
        {
            title: "Do these credits expire?",
            content: "These credits are currently available for property placed in service through **2032**. The rates remain at 30% until then, after which they will step down in 2033 and 2034."
        },
        {
            title: "Does this officialy file my taxes?",
            content: "No. This tool is for **estimation and planning purposes only**. It helps you understand potential savings. You must file **IRS Form 5695** with your annual tax return to claim these credits. We recommend consulting a qualified tax professional."
        }
    ];

    const resources = [
        {
            name: "IRS Form 5695 Instructions",
            description: "Official IRS guidance on how to fill out the form.",
            url: "https://www.irs.gov/forms-pubs/about-form-5695",
            icon: FileText
        },
        {
            name: "Energy Star Tax Credit Guide",
            description: "Detailed breakdown of eligible products and requirements.",
            url: "https://www.energystar.gov/about/federal_tax_credits",
            icon: BookOpen
        },
        {
            name: "White House Clean Energy Info",
            description: "Overview of the Inflation Reduction Act benefits.",
            url: "https://www.whitehouse.gov/cleanenergy",
            icon: ExternalLink
        }
    ];

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">General Information & Resources</h1>
                <p className="text-text-secondary">Everything you need to know about maximizing your energy tax credits.</p>
            </div>

            {/* Start Here / Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Calculator className="text-white" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Ready to estimate your savings?</h2>
                        </div>
                        <p className="text-primary-foreground/90 leading-relaxed mb-6">
                            Jump straight to our interactive estimator tool to see how much you could save on your next home upgrade using IRS Form 5695 data.
                        </p>
                        <Link href="/dashboard/tax-forms">
                            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8 rounded-full border-0 shadow-lg group">
                                Go to Tax Estimator
                                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                    {/* Decorative placeholder for layout balance */}
                    <div className="hidden md:block opacity-10 transform scale-150 translate-x-10 translate-y-10">
                        <FileText size={200} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: FAQ */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <HelpCircle className="text-primary" size={24} />
                        <h2 className="text-xl font-bold text-text-primary">Frequently Asked Questions</h2>
                    </div>

                    <Accordion items={faqItems} className="space-y-4" />
                </div>

                {/* Sidebar: Resources */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="text-primary" size={24} />
                        <h2 className="text-xl font-bold text-text-primary">Useful Resources</h2>
                    </div>

                    <div className="grid gap-4">
                        {resources.map((resource, i) => (
                            <a
                                key={i}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block"
                            >
                                <Card className="p-5 hover:border-primary/50 hover:shadow-md transition-all duration-300 border-border group-hover:bg-sub-background/30">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors flex items-center gap-2">
                                                {resource.name}
                                                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </h3>
                                            <p className="text-xs text-text-secondary leading-relaxed">
                                                {resource.description}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-sub-background rounded-lg text-text-secondary group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                            <resource.icon size={18} />
                                        </div>
                                    </div>
                                </Card>
                            </a>
                        ))}
                    </div>

                    <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20">
                        <h3 className="font-bold text-yellow-700 mb-2 text-sm">Pro Tip</h3>
                        <p className="text-xs text-yellow-800/80 leading-relaxed">
                            Always save your receipts and manufacturer certification statements. You will need these documents to prove your eligibility if you are audited by the IRS.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
