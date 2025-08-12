import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
      <div className="p-4 bg-wine-error/10 rounded-full">
        <ApperIcon 
          name="AlertTriangle" 
          size={48} 
          className="text-wine-error" 
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-display font-semibold text-wine-burgundy">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 max-w-md">
          {message}
        </p>
      </div>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;