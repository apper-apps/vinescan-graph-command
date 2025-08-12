import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent } from "@/components/atoms/Card";
import StarRating from "@/components/molecules/StarRating";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const WineCard = ({ 
  wine, 
  userRating, 
  onFavoriteToggle, 
  className,
  showCommunityRating = true 
}) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/wine/${wine.Id}`);
  };
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteToggle(wine.Id);
  };
  
  const getWineTypeColor = (type) => {
    const colors = {
      red: "bg-red-500",
      white: "bg-yellow-200 text-black",
      rose: "bg-pink-400",
      sparkling: "bg-gray-200 text-black",
      dessert: "bg-amber-400 text-black",
      fortified: "bg-orange-600",
    };
    return colors[type] || "bg-wine-burgundy";
  };
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transform transition-all duration-200 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-white to-wine-beige/20",
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={wine.imageUrl || "/api/placeholder/300/400"}
            alt={wine.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 hover:bg-white hover:scale-110"
          >
            <ApperIcon
              name="Heart"
              size={18}
              className={cn(
                "transition-colors",
                userRating?.isFavorite
                  ? "text-wine-red fill-wine-red"
                  : "text-gray-400 hover:text-wine-red"
              )}
            />
          </button>
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className={getWineTypeColor(wine.type)}>
              {wine.type}
            </Badge>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-display font-semibold text-lg text-wine-burgundy line-clamp-1">
              {wine.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-1">
              {wine.vineyard} • {wine.year}
            </p>
            {wine.region && (
              <p className="text-xs text-gray-500">{wine.region}</p>
            )}
          </div>
          
          <div className="space-y-2">
            {userRating && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-wine-burgundy">Your Rating:</span>
                <StarRating 
                  rating={userRating.rating} 
                  readonly 
                  size={16}
                  showNumber={false}
                />
              </div>
            )}
            
            {showCommunityRating && wine.averageRating > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Community:</span>
                <div className="flex items-center gap-2">
                  <StarRating 
                    rating={wine.averageRating} 
                    readonly 
                    size={14}
                    showNumber={false}
                  />
                  <span className="text-xs text-gray-500">
                    ({wine.reviewCount} reviews)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WineCard;