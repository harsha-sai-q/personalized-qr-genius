
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, FileImage, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadOptionsProps {
  onDownload: (format: 'png' | 'svg') => void;
  className?: string;
  disabled?: boolean;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ 
  onDownload, 
  className,
  disabled = false
}) => {
  const [format, setFormat] = React.useState<'png' | 'svg'>('png');

  const handleDownload = () => {
    onDownload(format);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <Label className="text-sm font-medium">Download Format</Label>
      
      <RadioGroup
        value={format}
        onValueChange={(value) => setFormat(value as 'png' | 'svg')}
        className="flex gap-3"
      >
        <div className="flex flex-1 flex-col">
          <div className="relative h-14 flex items-center justify-center">
            <div className="absolute inset-0 bg-secondary border border-border rounded-lg" />
            <div className="relative z-10">
              <RadioGroupItem value="png" id="png" className="sr-only" />
              <Label 
                htmlFor="png"
                className={cn(
                  "cursor-pointer flex items-center justify-center p-2",
                  "transition-all duration-200",
                  format === 'png' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileImage className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">PNG</span>
              </Label>
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 flex-col">
          <div className="relative h-14 flex items-center justify-center">
            <div className="absolute inset-0 bg-secondary border border-border rounded-lg" />
            <div className="relative z-10">
              <RadioGroupItem value="svg" id="svg" className="sr-only" />
              <Label 
                htmlFor="svg"
                className={cn(
                  "cursor-pointer flex items-center justify-center p-2",
                  "transition-all duration-200",
                  format === 'svg' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileCode className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">SVG</span>
              </Label>
            </div>
          </div>
        </div>
      </RadioGroup>
      
      <Button 
        onClick={handleDownload} 
        className="w-full font-medium shadow-button"
        disabled={disabled}
      >
        <Download className="h-4 w-4 mr-2" />
        Download QR Code
      </Button>
    </div>
  );
};

export default DownloadOptions;
