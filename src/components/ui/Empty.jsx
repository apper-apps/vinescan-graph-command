import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  type = "wines",
  title,
  message,
  actionLabel,
  actionTo,
  onAction 
}) => {
  const navigate = useNavigate();
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionTo) {
      navigate(actionTo);
    }
  };
  
  const getEmptyState = () => {
    switch (type) {
      case "collection":
        return {
          icon: "Wine",
          title: title || "No wines in your collection yet",
          message: message || "Start building your wine collection by scanning barcodes or adding wines manually.",
          actionLabel: actionLabel || "Scan Your First Wine",
          defaultAction: () => navigate("/scanner")
        };
      case "favorites":
        return {
          icon: "Heart",
          title: title || "No favorite wines yet",
          message: message || "Mark wines as favorites to see them here. Look for the heart icon on wine cards.",
          actionLabel: actionLabel || "Browse Collection",
          defaultAction: () => navigate("/collection")
        };
      case "search":
        return {
          icon: "Search",
          title: title || "No wines found",
          message: message || "Try adjusting your search terms or filters to find more wines.",
          actionLabel: actionLabel || "Clear Filters",
          defaultAction: onAction
        };
      default:
        return {
          icon: "Wine",
          title: title || "No wines found",
          message: message || "Get started by scanning your first wine barcode.",
          actionLabel: actionLabel || "Start Scanning",
          defaultAction: () => navigate("/scanner")
        };
    }
  };
  
  const emptyState = getEmptyState();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center bg-cork-texture">
      <div className="relative">
        <div className="p-6 bg-gradient-to-br from-wine-gold/20 to-wine-burgundy/20 rounded-full backdrop-blur-sm">
          <ApperIcon 
            name={emptyState.icon} 
            size={64} 
            className="text-wine-gold drop-shadow-sm" 
          />
        </div>
        {/* Decorative wine stain */}
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-wine-stain rounded-full opacity-30"></div>
      </div>
      
      <div className="space-y-3 max-w-md">
        <h3 className="text-2xl font-display font-semibold text-wine-burgundy">
          {emptyState.title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {emptyState.message}
        </p>
      </div>
      
      {(emptyState.actionLabel && (onAction || actionTo || emptyState.defaultAction)) && (
        <Button 
          onClick={handleAction || emptyState.defaultAction}
          size="lg"
          className="bg-gradient-to-r from-wine-gold to-wine-warning hover:from-wine-warning hover:to-wine-gold"
        >
          <ApperIcon 
            name={type === "collection" ? "Camera" : type === "favorites" ? "Wine" : "Search"} 
            size={20} 
            className="mr-2" 
          />
          {emptyState.actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;