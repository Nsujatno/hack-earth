import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[var(--radius-card)] border border-border bg-card-background p-6",
          hoverEffect && "transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };
