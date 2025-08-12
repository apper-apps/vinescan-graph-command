import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import StarRating from "@/components/molecules/StarRating";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import wineService from "@/services/api/wineService";
import userRatingService from "@/services/api/userRatingService";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const WineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wine, setWine] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const loadWineDetails = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const [wineData, ratingData] = await Promise.all([
        wineService.getById(parseInt(id)),
        userRatingService.getByWineId(parseInt(id))
      ]);
      
      if (!wineData) {
        setError("Wine not found");
        return;
      }
      
      setWine(wineData);
      setUserRating(ratingData);
      
      if (ratingData) {
        setRating(ratingData.rating);
        setNotes(ratingData.notes || "");
        setIsFavorite(ratingData.isFavorite);
      }
    } catch (err) {
      console.error("Error loading wine details:", err);
      setError("Failed to load wine details");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadWineDetails();
  }, [id]);
  
  const handleSaveRating = async () => {
    setIsSaving(true);
    
    try {
      if (userRating) {
        await userRatingService.update(userRating.Id, {
          rating,
          notes,
          isFavorite
        });
        toast.success("Rating updated!");
      } else {
        await userRatingService.create({
          wineId: wine.Id,
          rating,
          notes,
          isFavorite
        });
        toast.success("Rating saved!");
      }
      
      // Refresh rating data
      const updatedRating = await userRatingService.getByWineId(wine.Id);
      setUserRating(updatedRating);
      
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("Failed to save rating");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wine-cream to-wine-beige">
        <div className="container mx-auto px-4 py-6">
          <Loading type="wine-details" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wine-cream to-wine-beige">
        <div className="container mx-auto px-4 py-6">
          <Error message={error} onRetry={() => navigate("/collection")} />
        </div>
      </div>
    );
  }
  
  if (!wine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wine-cream to-wine-beige">
        <div className="container mx-auto px-4 py-6">
          <Error message="Wine not found" onRetry={() => navigate("/collection")} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-wine-cream to-wine-beige">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-2xl font-display font-bold text-wine-burgundy">
            Wine Details
          </h1>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Wine Image */}
                <div className="relative">
                  <img
                    src={wine.imageUrl || "/api/placeholder/400/600"}
                    alt={wine.name}
                    className="w-full h-96 md:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className={getWineTypeColor(wine.type)}>
                      {wine.type}
                    </Badge>
                  </div>
                  <button
                    onClick={handleFavoriteToggle}
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 hover:bg-white hover:scale-110"
                  >
                    <ApperIcon
                      name="Heart"
                      size={20}
                      className={cn(
                        "transition-colors",
                        isFavorite
                          ? "text-wine-red fill-wine-red"
                          : "text-gray-400 hover:text-wine-red"
                      )}
                    />
                  </button>
                </div>
                
                {/* Wine Info */}
                <div className="p-8 space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h2 className="text-3xl font-display font-bold text-wine-burgundy mb-2">
                      {wine.name}
                    </h2>
                    <p className="text-lg text-gray-700 mb-2">
                      {wine.vineyard} • {wine.year}
                    </p>
                    {wine.region && (
                      <p className="text-gray-600">{wine.region}</p>
                    )}
                    {wine.addedDate && (
                      <p className="text-sm text-gray-500 mt-2">
                        Added {format(new Date(wine.addedDate), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                  
                  {/* Community Rating */}
                  {wine.averageRating > 0 && (
                    <div className="bg-wine-cream/50 rounded-lg p-4">
                      <h4 className="font-semibold text-wine-burgundy mb-3">Community Rating</h4>
                      <div className="flex items-center justify-between">
                        <StarRating 
                          rating={wine.averageRating} 
                          readonly 
                          size={20}
                        />
                        <span className="text-gray-600">
                          {wine.reviewCount} {wine.reviewCount === 1 ? "review" : "reviews"}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* User Rating */}
                  <div className="bg-white rounded-lg p-4 border-2 border-wine-beige">
                    <h4 className="font-semibold text-wine-burgundy mb-4">Your Rating</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <StarRating 
                          rating={rating}
                          onRatingChange={setRating}
                          size={28}
                          showNumber={false}
                          className="justify-start"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tasting Notes (Optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Share your thoughts about this wine..."
                          rows={4}
                          className="w-full p-3 border-2 border-wine-beige rounded-lg resize-none focus:border-wine-burgundy focus:outline-none focus:ring-2 focus:ring-wine-burgundy/20"
                        />
                      </div>
                      
                      {userRating && (
                        <div className="text-sm text-gray-500">
                          Last updated: {format(new Date(userRating.ratedDate), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveRating}
                      disabled={rating === 0 || isSaving}
                      className="flex-1"
                    >
                      {isSaving ? (
                        <>
                          <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Star" size={16} className="mr-2" />
                          {userRating ? "Update Rating" : "Save Rating"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Wine Information Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Wine Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-wine-burgundy">Type:</span>
                    <span className="ml-2 capitalize">{wine.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-wine-burgundy">Vintage:</span>
                    <span className="ml-2">{wine.year}</span>
                  </div>
                  <div>
                    <span className="font-medium text-wine-burgundy">Vineyard:</span>
                    <span className="ml-2">{wine.vineyard}</span>
                  </div>
                  {wine.region && (
                    <div>
                      <span className="font-medium text-wine-burgundy">Region:</span>
                      <span className="ml-2">{wine.region}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {wine.barcode && (
                    <div>
                      <span className="font-medium text-wine-burgundy">Barcode:</span>
                      <span className="ml-2 font-mono text-sm">{wine.barcode}</span>
                    </div>
                  )}
                  {wine.addedBy && (
                    <div>
                      <span className="font-medium text-wine-burgundy">Added by:</span>
                      <span className="ml-2">{wine.addedBy}</span>
                    </div>
                  )}
                  {wine.addedDate && (
                    <div>
                      <span className="font-medium text-wine-burgundy">Date added:</span>
                      <span className="ml-2">{format(new Date(wine.addedDate), "MMMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WineDetails;