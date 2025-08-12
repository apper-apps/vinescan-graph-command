import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CameraViewfinder from "@/components/organisms/CameraViewfinder";
import WineDetailsModal from "@/components/organisms/WineDetailsModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import wineService from "@/services/api/wineService";
import userRatingService from "@/services/api/userRatingService";
const Scanner = () => {
  const navigate = useNavigate();
  const [scannedWine, setScannedWine] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [showWineDetails, setShowWineDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
const handleBarcodeDetected = async (barcode) => {
    setIsLoading(true);
    
    try {
      // Validate barcode format
      if (!barcode || barcode.trim().length === 0) {
        toast.warning("Invalid barcode detected. Please try again.");
        return;
      }
      
      toast.info(`Detected barcode: ${barcode}`);
      
      // Look up wine by barcode
const wine = await wineService.getByBarcode(barcode);
      
      if (wine) {
        // Get user's rating for this wine
        const rating = await userRatingService.getByWineId(wine.Id);
        
        setScannedWine(wine);
        setUserRating(rating);
        setShowWineDetails(true);
        
        toast.success(`Found ${wine.name}!`);
      } else {
        // Wine not found - navigate to add wine with barcode pre-filled
        toast.info(`Wine not found for barcode ${barcode}. Taking you to add it!`);
        navigate(`/add-wine?barcode=${encodeURIComponent(barcode)}`);
      }
    } catch (error) {
      console.error("Error looking up wine:", error);
      toast.error("Error looking up wine. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRateWine = async (wineId, rating, notes, isFavorite) => {
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
          wineId,
          rating,
          notes,
          isFavorite
        });
        toast.success("Rating saved!");
      }
      
      // Refresh user rating
      const updatedRating = await userRatingService.getByWineId(wineId);
      setUserRating(updatedRating);
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("Failed to save rating. Please try again.");
    }
  };
  
  const handleFavoriteToggle = async (wineId) => {
    try {
      if (userRating) {
        await userRatingService.update(userRating.Id, {
          ...userRating,
          isFavorite: !userRating.isFavorite
        });
        
        const updatedRating = await userRatingService.getByWineId(wineId);
        setUserRating(updatedRating);
        
        toast.success(
          updatedRating.isFavorite 
            ? "Added to favorites!" 
            : "Removed from favorites"
        );
      } else {
        // Create new rating with favorite only
        await userRatingService.create({
          wineId,
          rating: 0,
          notes: "",
          isFavorite: true
        });
        
        const newRating = await userRatingService.getByWineId(wineId);
        setUserRating(newRating);
        toast.success("Added to favorites!");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite. Please try again.");
    }
  };
  
  const handleCloseModal = () => {
    setShowWineDetails(false);
    setScannedWine(null);
    setUserRating(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-wine-cream to-wine-beige">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-wine-burgundy mb-2">
            Wine Scanner
          </h1>
          <p className="text-gray-600">
            Scan any wine barcode to discover your ratings and community reviews
          </p>
        </div>
        
        {/* Camera Section */}
        <div className="max-w-lg mx-auto mb-8">
          <Card className="overflow-hidden">
            <CameraViewfinder 
              onBarcodeDetected={handleBarcodeDetected}
              className="w-full"
            />
            {isLoading && (
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-wine-burgundy">
                  <ApperIcon name="Loader2" size={20} className="animate-spin" />
                  <span>Looking up wine...</span>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
        
        {/* Instructions */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">How to Scan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="p-3 bg-wine-gold/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <ApperIcon name="Camera" size={24} className="text-wine-gold" />
                </div>
                <h3 className="font-semibold text-wine-burgundy">1. Position</h3>
                <p className="text-sm text-gray-600">
                  Point your camera at the wine bottle's barcode
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-wine-burgundy/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <ApperIcon name="ScanLine" size={24} className="text-wine-burgundy" />
                </div>
                <h3 className="font-semibold text-wine-burgundy">2. Scan</h3>
                <p className="text-sm text-gray-600">
                  Wait for automatic detection or use demo scan
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-wine-red/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <ApperIcon name="Star" size={24} className="text-wine-red" />
                </div>
                <h3 className="font-semibold text-wine-burgundy">3. Rate</h3>
                <p className="text-sm text-gray-600">
                  View details and add your rating and notes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Scans - In a real app, this would show recently scanned wines */}
        <div className="mt-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-wine-burgundy mb-4 text-center">
            Quick Access
          </h3>
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/collection"}
              className="flex-1 max-w-xs"
            >
              <ApperIcon name="Wine" size={16} className="mr-2" />
              View Collection
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/add-wine"}
              className="flex-1 max-w-xs"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Wine
            </Button>
          </div>
        </div>
      </div>
      
      {/* Wine Details Modal */}
      {showWineDetails && scannedWine && (
        <WineDetailsModal
          wine={scannedWine}
          userRating={userRating}
          onClose={handleCloseModal}
          onRateWine={handleRateWine}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
    </div>
  );
};

export default Scanner;