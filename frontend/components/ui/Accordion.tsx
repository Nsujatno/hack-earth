"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onClick?: () => void;
    className?: string;
}

export function AccordionItem({
    title,
    children,
    isOpen,
    onClick,
    className,
}: AccordionItemProps) {
    return (
        <div className={cn("border border-border rounded-xl bg-card-background overflow-hidden", className)}>
            <button
                onClick={onClick}
                className="flex w-full items-center justify-between p-4 text-left font-medium transition-all hover:bg-sub-background/30"
            >
                <span className="text-text-primary mr-4">{title}</span>
                <ChevronDown
                    className={cn("h-4 w-4 text-text-secondary transition-transform duration-200", isOpen && "rotate-180")}
                />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-4 pb-4 pt-0 text-sm text-text-secondary leading-relaxed border-t border-border/30 bg-sub-background/10">
                            <div className="pt-3">{children}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface AccordionProps {
    items: { title: string; content: React.ReactNode }[];
    className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={cn("space-y-3", className)}>
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    isOpen={openIndex === index}
                    onClick={() => handleClick(index)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
}
