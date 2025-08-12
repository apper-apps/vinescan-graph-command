import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent } from "@/components/atoms/Card";

const Loading = ({ type = "default" }) => {
  if (type === "wine-grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-wine-beige to-wine-cream shimmer"></div>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="h-6 bg-wine-beige shimmer rounded-md"></div>
                <div className="h-4 bg-wine-beige shimmer rounded-md w-3/4"></div>
                <div className="h-3 bg-wine-beige shimmer rounded-md w-1/2"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-wine-beige shimmer rounded-md w-20"></div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-wine-beige shimmer rounded-full"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (type === "wine-details") {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-wine-beige shimmer rounded-lg"></div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="h-8 bg-wine-beige shimmer rounded-md"></div>
                  <div className="h-5 bg-wine-beige shimmer rounded-md w-3/4"></div>
                  <div className="h-4 bg-wine-beige shimmer rounded-md w-1/2"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-16 bg-wine-beige shimmer rounded-lg"></div>
                  <div className="h-16 bg-wine-beige shimmer rounded-lg"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-12 bg-wine-beige shimmer rounded-lg flex-1"></div>
                  <div className="h-12 bg-wine-beige shimmer rounded-lg w-16"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="bottle-bounce">
        <ApperIcon 
          name="Wine" 
          size={48} 
          className="text-wine-gold animate-pulse" 
        />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-display text-wine-burgundy">
          Loading wines...
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-wine-gold rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-wine-gold rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-wine-gold rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;