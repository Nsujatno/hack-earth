import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, id, startAdornment, endAdornment, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startAdornment && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {startAdornment}
            </div>
          )}
          <input
            type={type}
            id={id}
            className={cn(
              "flex h-12 w-full rounded-xl border border-transparent bg-sub-background/50 px-4 py-2 text-sm text-text-primary shadow-sm placeholder:text-text-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-card-background transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
              startAdornment && "pl-10",
              endAdornment && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {endAdornment && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {endAdornment}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
