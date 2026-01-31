import { cn } from "@/lib/utils";
import React from "react";

interface SelectionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  selected?: boolean;
  value: string;
  onSelect: (value: string) => void;
  children: React.ReactNode;
}

export function SelectionCard({
  selected,
  value,
  onSelect,
  children,
  className,
  ...props
}: SelectionCardProps) {
  return (
    <div
      onClick={() => onSelect(value)}
      className={cn(
        "cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ease-out active:scale-[0.98]",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card-background hover:border-primary/30 hover:bg-sub-background/30",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">{children}</div>
        <div
          className={cn(
            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
            selected ? "border-primary bg-primary" : "border-border"
          )}
        >
          {selected && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
        </div>
      </div>
    </div>
  );
}
