"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Map,
    Leaf,
    FileText,
    Info,
    Menu,
    X,
    LogOut,
    TreeDeciduous
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Grouped Navigation Items
    const navGroups = [
        {
            items: [
                { name: "Your Roadmap", href: "/dashboard", icon: Map },
                { name: "CO2 Impact", href: "/dashboard/impact", icon: TreeDeciduous },
            ]
        },
        {
            label: "Resources",
            items: [
                { name: "Tax Forms", href: "/dashboard/tax-forms", icon: FileText },
                { name: "General Info", href: "/dashboard/info", icon: Info },
            ]
        }
    ];

    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-card-background border-r border-border">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                    <Leaf size={18} fill="currentColor" />
                </div>
                <span className="text-xl font-bold text-text-primary tracking-tight">GreenGain</span>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-6">
                {navGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-1">
                        {group.label && (
                            <h4 className="px-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2 mt-2 opacity-60">
                                {group.label}
                            </h4>
                        )}

                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-text-secondary hover:bg-sub-background/50 hover:text-text-primary"
                                            }`}
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        <item.icon size={20} className={isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary"} />
                                        <span>{item.name}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                <Link
                    href="/logout"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-error/10 hover:text-error transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 h-screen sticky top-0 left-0 z-40 bg-card-background">
                <SidebarContent />
            </aside>

            {/* Mobile Header & Overlay */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card-background border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                        <Leaf size={14} fill="currentColor" />
                    </div>
                    <span className="font-bold text-text-primary">GreenGain</span>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
            </div>

            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 w-64 z-50 md:hidden h-full shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
