import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-md transition-all duration-300 border border-transparent",
        secondary:
          "border border-border bg-card-background hover:bg-background text-text-primary hover:border-primary/30",
        ghost: "hover:bg-sub-background text-text-secondary hover:text-text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:opacity-90 shadow-sm",
        outline: "border border-border bg-transparent hover:bg-sub-background text-text-primary",
      },
      size: {
        default: "h-11 px-6 py-2.5 rounded-xl text-sm",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-14 rounded-2xl px-8 text-base font-semibold",
        icon: "h-10 w-10 rounded-xl",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
