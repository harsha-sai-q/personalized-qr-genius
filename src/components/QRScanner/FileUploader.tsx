
import React, { useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onScanResult: (result: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onScanResult }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  return (
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
  );
};

export default FileUploader;
