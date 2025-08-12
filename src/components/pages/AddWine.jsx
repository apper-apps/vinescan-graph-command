import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ImageUpload from "@/components/molecules/ImageUpload";
import WineTypeSelector from "@/components/molecules/WineTypeSelector";
import StarRating from "@/components/molecules/StarRating";
import wineService from "@/services/api/wineService";
import userRatingService from "@/services/api/userRatingService";
const AddWine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    vineyard: "",
    year: new Date().getFullYear(),
    type: "red",
    region: "",
    barcode: "",
    imageUrl: ""
  });
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check for barcode in URL parameters and prepopulate
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const barcodeFromUrl = searchParams.get('barcode');
    
    if (barcodeFromUrl) {
      setFormData(prev => ({
        ...prev,
        barcode: barcodeFromUrl
      }));
      
      // Show notification that barcode was prepopulated
      toast.info(`Barcode ${barcodeFromUrl} has been filled in from your scan.`);
    }
  }, [location.search]);
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Wine name is required";
    }
    
    if (!formData.vineyard.trim()) {
      newErrors.vineyard = "Vineyard is required";
    }
    
    const currentYear = new Date().getFullYear();
    if (formData.year < 1800 || formData.year > currentYear) {
      newErrors.year = `Year must be between 1800 and ${currentYear}`;
    }
    
    if (!formData.type) {
      newErrors.type = "Wine type is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create wine
      const wineData = {
        ...formData,
        addedBy: "Current User",
        addedDate: new Date().toISOString()
      };
      
      const newWine = await wineService.create(wineData);
      
      // If user provided a rating, save it
      if (rating > 0) {
        await userRatingService.create({
          wineId: newWine.Id,
          rating,
          notes,
          isFavorite
        });
      }
      
      toast.success("Wine added successfully!");
      navigate(`/wine/${newWine.Id}`);
      
    } catch (error) {
      console.error("Error adding wine:", error);
      toast.error("Failed to add wine. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
            Add New Wine
          </h1>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Plus" size={24} className="text-wine-gold" />
                Wine Information
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Wine Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-wine-burgundy">
                    Wine Photo
                  </label>
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(value) => handleInputChange("imageUrl", value)}
                  />
                </div>
                
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Wine Name"
                    placeholder="Enter wine name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    error={errors.name}
                    required
                  />
                  
                  <FormField
                    label="Vineyard"
                    placeholder="Enter vineyard name"
                    value={formData.vineyard}
                    onChange={(e) => handleInputChange("vineyard", e.target.value)}
                    error={errors.vineyard}
                    required
                  />
                  
                  <FormField
                    label="Year"
                    type="number"
                    placeholder="e.g. 2020"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", parseInt(e.target.value) || "")}
                    error={errors.year}
                    required
                  />
                  
                  <FormField
                    label="Region (Optional)"
                    placeholder="e.g. Napa Valley"
                    value={formData.region}
                    onChange={(e) => handleInputChange("region", e.target.value)}
                    error={errors.region}
                  />
                </div>
                
                {/* Wine Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-wine-burgundy">
                    Wine Type <span className="text-wine-error">*</span>
                  </label>
                  <WineTypeSelector
                    value={formData.type}
                    onChange={(value) => handleInputChange("type", value)}
                  />
                  {errors.type && (
                    <p className="text-sm text-wine-error">{errors.type}</p>
                  )}
                </div>
                
                {/* Barcode */}
                <FormField
                  label="Barcode (Optional)"
                  placeholder="Enter barcode if known"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                  error={errors.barcode}
                />
                
                {/* Rating Section */}
                <Card className="bg-wine-cream/30 border-wine-beige">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Rating (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-wine-burgundy mb-2">
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
                    
                    {rating > 0 && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-wine-burgundy mb-2">
                            Tasting Notes
                          </label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Share your thoughts about this wine..."
                            rows={3}
                            className="w-full p-3 border-2 border-wine-beige rounded-lg resize-none focus:border-wine-burgundy focus:outline-none focus:ring-2 focus:ring-wine-burgundy/20"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-wine-burgundy">
                            Add to Favorites
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsFavorite(!isFavorite)}
                            className="p-2 hover:bg-wine-beige rounded-full transition-colors"
                          >
                            <ApperIcon
                              name="Heart"
                              size={20}
                              className={
                                isFavorite
                                  ? "text-wine-red fill-wine-red"
                                  : "text-gray-400 hover:text-wine-red"
                              }
                            />
                          </button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Adding Wine...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Plus" size={16} className="mr-2" />
                        Add Wine
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddWine;