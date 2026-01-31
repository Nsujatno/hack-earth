import { cn } from "@/lib/utils";

interface MoneyDisplayProps {
  amount: string;
  label: string;
  badgeText?: string;
  className?: string;
}

export function MoneyDisplay({ amount, label, badgeText, className }: MoneyDisplayProps) {
  return (
    <div className={cn("text-center space-y-2", className)}>
      {badgeText && (
        <div className="inline-flex items-center justify-center">
          <span className="bg-secondary/20 text-text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            {badgeText}
          </span>
        </div>
      )}
      <div className="text-6xl sm:text-7xl md:text-8xl font-medium tracking-tighter text-text-primary tabular-nums">
        {amount}
      </div>
      <p className="text-text-secondary text-lg font-medium">{label}</p>
    </div>
  );
}
