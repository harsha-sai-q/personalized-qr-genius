import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Image as ImageIcon, ArrowLeft, Scan } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface QRScannerProps {
  onScanResult: (result: string) => void;
  onBack?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanResult, onBack }) => {
  const [activeTab, setActiveTab] = useState<string>('camera');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Camera access is not supported in your browser');
        setPermission(false);
        return;
      }
      
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 } 
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        setPermission(true);
        scanQRCodeFromCamera();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermission(false);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };
  
  const scanQRCodeFromCamera = async () => {
    if (!isCameraActive || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    const jsQR = (await import('jsqr')).default;
    
    const scanFrame = () => {
      if (!video || !context || !jsQR || video.paused || video.ended) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      
      if (code) {
        toast.success('QR code detected!');
        stopCamera();
        onScanResult(code.data);
        return;
      }
      
      requestAnimationFrame(scanFrame);
    };
    
    requestAnimationFrame(scanFrame);
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const jsQR = (await import('jsqr')).default;
    
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            toast.error('Failed to process image');
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          
          if (code) {
            toast.success('QR code detected!');
            onScanResult(code.data);
          } else {
            toast.error('No QR code found in image');
          }
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => {
        toast.error('Failed to read file');
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    }
  };
  
  useEffect(() => {
    if (activeTab === 'camera' && !isCameraActive) {
      startCamera();
    } else if (activeTab !== 'camera' && isCameraActive) {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [activeTab]);
  
  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h3 className="text-lg font-medium">Scan QR Code</h3>
        <div className="w-[60px]"></div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="p-4 pt-2 border-b">
          <TabsList className="w-full grid grid-cols-2 h-10">
            <TabsTrigger value="camera" className="text-sm font-medium">
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="gallery" className="text-sm font-medium">
              <ImageIcon className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="camera" className="p-0 m-0">
          <div className="relative aspect-[4/3] bg-black flex items-center justify-center">
            {permission === false ? (
              <div className="text-center p-6">
                <p className="text-white mb-4">Camera access denied or not available</p>
                <Button 
                  onClick={startCamera}
                  variant="secondary"
                >
                  Request Access
                </Button>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  className={cn(
                    "w-full h-full object-cover",
                    { hidden: !isCameraActive }
                  )} 
                />
                <canvas 
                  ref={canvasRef} 
                  className="absolute top-0 left-0 opacity-0 pointer-events-none" 
                />
                {!isCameraActive && permission !== false && (
                  <div className="flex flex-col items-center justify-center gap-4 text-white">
                    <Scan className="h-12 w-12 animate-pulse" />
                    <p>Initializing camera...</p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Position QR code within the camera view to scan
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="gallery" className="p-0 m-0">
          <div className="p-8 text-center">
            <div className="border-2 border-dashed border-border rounded-lg p-8 mb-4">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-6">
                Upload an image containing a QR code
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto"
              >
                Choose Image
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QRScanner;
