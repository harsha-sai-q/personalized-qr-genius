
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoUploaderProps {
  onLogoChange: (logoUrl: string | null) => void;
  className?: string;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ onLogoChange, className }) => {
  const [logo, setLogo] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const logoUrl = e.target?.result as string;
      setLogo(logoUrl);
      onLogoChange(logoUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div 
        className={cn(
          'w-full h-36 rounded-xl border-2 border-dashed transition-all duration-300',
          'flex flex-col items-center justify-center cursor-pointer overflow-hidden relative',
          {
            'border-primary/70 bg-accent/50': dragActive,
            'border-border hover:border-primary/40 hover:bg-accent/20': !dragActive,
            'p-2': !logo,
            'p-0': logo
          }
        )}
        onClick={!logo ? handleUploadClick : undefined}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {logo ? (
          <div className="relative w-full h-full">
            <img
              src={logo}
              alt="Uploaded logo"
              className="w-full h-full object-contain"
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveLogo();
              }}
              className="absolute top-2 right-2 bg-white/80 backdrop-blur rounded-full p-1 shadow-sm hover:bg-white transition-colors"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>
        ) : (
          <>
            <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-center text-muted-foreground font-medium">
              Drag and drop or click to upload logo
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Recommended: transparent PNG, 200×200px
            </p>
          </>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {!logo && (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleUploadClick}
          className="w-full shadow-button font-medium"
        >
          <Upload size={16} className="mr-2" />
          Upload Logo
        </Button>
      )}
    </div>
  );
};

export default LogoUploader;
