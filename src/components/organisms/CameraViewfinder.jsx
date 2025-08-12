import React, { useState, useRef, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const CameraViewfinder = ({ onBarcodeDetected, className }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const startCamera = async () => {
    try {
      setCameraError("");
      setIsScanning(true);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError("Unable to access camera. Please check permissions.");
      setIsScanning(false);
    }
  };
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };
  
  const simulateBarcodeDetection = () => {
    // Simulate barcode detection with a random barcode
    const sampleBarcodes = [
      "1234567890123",
      "9876543210987",
      "5555555555555",
      "1111111111111"
    ];
    const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
    
    setTimeout(() => {
      onBarcodeDetected(randomBarcode);
      stopCamera();
    }, 2000);
  };
  
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  return (
    <div className={cn("relative bg-black rounded-xl overflow-hidden", className)}>
      {!isScanning ? (
        <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-wine-burgundy/20 to-wine-gold/20 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <div className="bottle-bounce">
              <ApperIcon 
                name="Wine" 
                size={64} 
                className="mx-auto text-wine-gold" 
              />
            </div>
            <div>
              <h3 className="text-white font-display text-xl mb-2">
                Scan Wine Barcode
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Point your camera at the barcode
              </p>
              {cameraError && (
                <p className="text-wine-error text-sm mb-4">{cameraError}</p>
              )}
              <Button 
                onClick={startCamera}
                size="lg"
                className="bg-gradient-to-r from-wine-gold to-wine-warning"
              >
                <ApperIcon name="Camera" size={20} className="mr-2" />
                Start Camera
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative aspect-[4/3]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Scanning overlay */}
          <div className="absolute inset-0 bg-black/40">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Scanning frame */}
                <div className="w-64 h-32 border-2 border-wine-gold rounded-lg relative">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-white rounded-br-lg"></div>
                  
                  {/* Scanning line animation */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-wine-gold to-transparent animate-pulse"></div>
                </div>
                
                <p className="text-white text-center mt-4 text-sm">
                  Position barcode within the frame
                </p>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={stopCamera}
            >
              <ApperIcon name="X" size={16} className="mr-2" />
              Cancel
            </Button>
            
            {/* Demo: Simulate barcode detection */}
            <Button
              variant="secondary"
              size="sm"
              onClick={simulateBarcodeDetection}
            >
              <ApperIcon name="Zap" size={16} className="mr-2" />
              Demo Scan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraViewfinder;