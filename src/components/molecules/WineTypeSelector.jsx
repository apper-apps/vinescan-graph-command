import React from "react";
import { cn } from "@/utils/cn";

const WineTypeSelector = ({ value, onChange, className }) => {
  const wineTypes = [
    { value: "red", label: "Red Wine", color: "bg-red-500" },
    { value: "white", label: "White Wine", color: "bg-yellow-200" },
    { value: "rose", label: "Rosé", color: "bg-pink-400" },
    { value: "sparkling", label: "Sparkling", color: "bg-gray-200" },
    { value: "dessert", label: "Dessert", color: "bg-amber-400" },
    { value: "fortified", label: "Fortified", color: "bg-orange-600" },
  ];
  
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {wineTypes.map((type) => (
        <button
          key={type.value}
          type="button"
          onClick={() => onChange(type.value)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200",
            value === type.value
              ? "border-wine-burgundy bg-wine-beige shadow-md"
              : "border-gray-200 hover:border-wine-gold hover:bg-wine-beige/50"
          )}
        >
          <div className={cn("w-4 h-4 rounded-full", type.color)} />
          <span className="text-sm font-medium text-gray-700">{type.label}</span>
        </button>
      ))}
    </div>
  );
};

export default WineTypeSelector;