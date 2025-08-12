import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import StarRating from "@/components/molecules/StarRating";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const WineDetailsModal = ({ wine, userRating, onClose, onRateWine, onFavoriteToggle }) => {
  const [rating, setRating] = useState(userRating?.rating || 0);
  const [notes, setNotes] = useState(userRating?.notes || "");
  const [isFavorite, setIsFavorite] = useState(userRating?.isFavorite || false);
  const navigate = useNavigate();
  
  const handleRateWine = () => {
    onRateWine(wine.Id, rating, notes, isFavorite);
    onClose();
  };
  
  const handleViewDetails = () => {
    navigate(`/wine/${wine.Id}`);
    onClose();
  };
  
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-gradient-to-br from-white to-wine-beige/30">
          <CardHeader className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-wine-beige rounded-full transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-gray-500" />
            </button>
            
            <div className="flex gap-4">
              <img
                src={wine.imageUrl || "/api/placeholder/120/160"}
                alt={wine.name}
                className="w-20 h-28 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <Badge variant="secondary" className={getWineTypeColor(wine.type)}>
                    {wine.type}
                  </Badge>
                  <button
                    onClick={handleFavoriteToggle}
                    className="p-1 hover:bg-wine-beige rounded-full transition-colors"
                  >
                    <ApperIcon
                      name="Heart"
                      size={18}
                      className={cn(
                        "transition-colors",
                        isFavorite
                          ? "text-wine-red fill-wine-red"
                          : "text-gray-400 hover:text-wine-red"
                      )}
                    />
                  </button>
                </div>
                <CardTitle className="text-xl mb-1">{wine.name}</CardTitle>
                <p className="text-sm text-gray-600">
                  {wine.vineyard} • {wine.year}
                </p>
                {wine.region && (
                  <p className="text-xs text-gray-500 mt-1">{wine.region}</p>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Community Rating */}
            {wine.averageRating > 0 && (
              <div className="bg-wine-cream/50 rounded-lg p-4">
                <h4 className="font-medium text-wine-burgundy mb-2">Community Rating</h4>
                <div className="flex items-center justify-between">
                  <StarRating 
                    rating={wine.averageRating} 
                    readonly 
                    size={20}
                  />
                  <span className="text-sm text-gray-600">
                    {wine.reviewCount} reviews
                  </span>
                </div>
              </div>
            )}
            
            {/* User Rating Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-wine-burgundy">Your Rating</h4>
              
              <div>
                <StarRating 
                  rating={rating}
                  onRatingChange={setRating}
                  size={24}
                  showNumber={false}
                  className="justify-center"
                />
              </div>
              
              {rating > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-wine-burgundy">
                    Tasting Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share your thoughts about this wine..."
                    rows={3}
                    className="w-full p-3 border-2 border-wine-beige rounded-lg resize-none focus:border-wine-burgundy focus:outline-none focus:ring-2 focus:ring-wine-burgundy/20"
                  />
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              {rating > 0 ? (
                <Button onClick={handleRateWine} className="flex-1">
                  <ApperIcon name="Star" size={16} className="mr-2" />
                  {userRating ? "Update Rating" : "Save Rating"}
                </Button>
              ) : (
                <Button onClick={handleViewDetails} variant="outline" className="flex-1">
                  <ApperIcon name="Eye" size={16} className="mr-2" />
                  View Details
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default WineDetailsModal;