
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isCameraActive: boolean;
  permission: boolean | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export const useCamera = (): UseCameraResult => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    isCameraActive,
    permission,
    startCamera,
    stopCamera
  };
};
