import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-wine-burgundy to-wine-red text-white",
    secondary: "bg-gradient-to-r from-wine-gold to-wine-warning text-white",
    destructive: "bg-gradient-to-r from-wine-error to-red-600 text-white",
    outline: "border border-wine-burgundy text-wine-burgundy",
    success: "bg-gradient-to-r from-wine-success to-green-600 text-white",
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;