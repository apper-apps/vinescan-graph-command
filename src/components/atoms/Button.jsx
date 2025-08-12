import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-gradient-to-r from-wine-burgundy to-wine-red text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-wine-burgundy",
    secondary: "bg-gradient-to-r from-wine-gold to-wine-warning text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-wine-gold",
    outline: "border-2 border-wine-burgundy text-wine-burgundy bg-transparent hover:bg-wine-burgundy hover:text-white focus:ring-wine-burgundy",
    ghost: "text-wine-burgundy hover:bg-wine-beige hover:text-wine-burgundy focus:ring-wine-burgundy",
    destructive: "bg-gradient-to-r from-wine-error to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-wine-error",
  };
  
  const sizes = {
    sm: "h-9 px-3 text-sm",
    default: "h-11 px-6 py-2",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10",
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;