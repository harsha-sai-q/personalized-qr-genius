
import React, { useEffect } from 'react';
import { Scan } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCamera } from '@/hooks/useCamera';

interface CameraScannerProps {
  onScanResult: (result: string) => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onScanResult }) => {
  const { videoRef, canvasRef, isCameraActive, permission, startCamera, stopCamera } = useCamera();
  
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

  useEffect(() => {
    if (isCameraActive) {
      scanQRCodeFromCamera();
    }
  }, [isCameraActive]);
  
  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);
  
  return (
    <>
      <div className="relative aspect-[4/3] bg-black flex items-center justify-center">
        {permission === false ? (
          <div className="text-center p-6">
            <p className="text-white mb-4">Camera access denied or not available</p>
            <button 
              onClick={startCamera}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
            >
              Request Access
            </button>
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
    </>
  );
};

export default CameraScanner;
