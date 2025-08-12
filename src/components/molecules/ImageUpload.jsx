import React, { useState, useRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const ImageUpload = ({ value, onChange, className }) => {
  const [preview, setPreview] = useState(value || "");
  const fileInputRef = useRef(null);
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setPreview(imageUrl);
        onChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    fileInputRef.current?.click();
  };
  
  const handleRemoveImage = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Wine bottle preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-wine-beige"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-2 bg-wine-error text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-wine-beige rounded-lg p-8 text-center bg-wine-cream/50">
          <ApperIcon 
            name="Camera" 
            size={48} 
            className="mx-auto text-wine-gold mb-4" 
          />
          <p className="text-gray-600 mb-4">Take a photo of the wine bottle</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleCameraCapture} size="sm">
              <ApperIcon name="Camera" size={16} className="mr-2" />
              Camera
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <ApperIcon name="Upload" size={16} className="mr-2" />
              Gallery
            </Button>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;