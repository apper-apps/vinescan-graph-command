import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border-2 border-wine-beige bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 transition-colors duration-200 focus:border-wine-burgundy focus:outline-none focus:ring-2 focus:ring-wine-burgundy/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;