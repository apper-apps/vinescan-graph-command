import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const WineFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  className 
}) => {
  const wineTypes = [
    { value: "all", label: "All Types" },
    { value: "red", label: "Red" },
    { value: "white", label: "White" },
    { value: "rose", label: "Rosé" },
    { value: "sparkling", label: "Sparkling" },
    { value: "dessert", label: "Dessert" },
    { value: "fortified", label: "Fortified" },
  ];
  
  const ratingFilters = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4+ Stars" },
    { value: "3", label: "3+ Stars" },
    { value: "2", label: "2+ Stars" },
    { value: "1", label: "1+ Stars" },
  ];
  
  const handleTypeChange = (type) => {
    onFiltersChange({ ...filters, type });
  };
  
  const handleRatingChange = (rating) => {
    onFiltersChange({ ...filters, rating });
  };
  
  const toggleFavoritesOnly = () => {
    onFiltersChange({ ...filters, favoritesOnly: !filters.favoritesOnly });
  };
  
  const hasActiveFilters = 
    filters.type !== "all" || 
    filters.rating !== "all" || 
    filters.favoritesOnly;
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-wine-burgundy">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-wine-gold hover:text-wine-burgundy"
          >
            <ApperIcon name="X" size={16} className="mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      {/* Wine Type Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Wine Type</label>
        <div className="flex flex-wrap gap-2">
          {wineTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeChange(type.value)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full border transition-all duration-200",
                filters.type === type.value
                  ? "bg-wine-burgundy text-white border-wine-burgundy shadow-md"
                  : "bg-white text-gray-600 border-gray-300 hover:border-wine-gold hover:text-wine-gold"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Rating Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Minimum Rating</label>
        <div className="flex flex-wrap gap-2">
          {ratingFilters.map((rating) => (
            <button
              key={rating.value}
              onClick={() => handleRatingChange(rating.value)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full border transition-all duration-200",
                filters.rating === rating.value
                  ? "bg-wine-gold text-white border-wine-gold shadow-md"
                  : "bg-white text-gray-600 border-gray-300 hover:border-wine-gold hover:text-wine-gold"
              )}
            >
              {rating.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Favorites Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Show Favorites Only</label>
        <button
          onClick={toggleFavoritesOnly}
          className={cn(
            "relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-wine-burgundy focus:ring-offset-2",
            filters.favoritesOnly ? "bg-wine-red" : "bg-gray-200"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
              filters.favoritesOnly ? "translate-x-6 mt-1" : "translate-x-1 mt-1"
            )}
          />
        </button>
      </div>
    </div>
  );
};

export default WineFilters;