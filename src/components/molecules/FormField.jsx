import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  required = false, 
  className, 
  children,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={cn(error && "text-wine-error")}>
          {label}
          {required && <span className="text-wine-error ml-1">*</span>}
        </Label>
      )}
      {children || (
        <Input
          className={cn(
            error && "border-wine-error focus:border-wine-error focus:ring-wine-error/20"
          )}
          {...props}
        />
      )}
      {error && (
        <p className="text-sm text-wine-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;