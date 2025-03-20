
import React from 'react';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { QrCode } from 'lucide-react';

export type QRStyleType = 'standard' | 'dots' | 'rounded' | 'classy' | 'edge-cut' | 'frame-square' | 'frame-rounded' | 'frame-circle' | 'phone-frame' | 'device-frame';

interface QRStyleSelectorProps {
  selectedStyle: QRStyleType;
  onChange: (style: QRStyleType) => void;
  className?: string;
}

const QRStyleSelector: React.FC<QRStyleSelectorProps> = ({ 
  selectedStyle, 
  onChange, 
  className 
}) => {
  const styles: { id: QRStyleType; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'standard', 
      label: 'Standard', 
      icon: (
        <div className="w-6 h-6 grid grid-cols-3 grid-rows-3 gap-0.5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={cn(
              "bg-current",
              i === 0 || i === 2 || i === 6 || i === 8 ? "rounded-none" : ""
            )}></div>
          ))}
        </div>
      )
    },
    { 
      id: 'dots', 
      label: 'Dots', 
      icon: (
        <div className="w-6 h-6 grid grid-cols-3 grid-rows-3 gap-0.5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="rounded-full bg-current"></div>
          ))}
        </div>
      )
    },
    { 
      id: 'rounded', 
      label: 'Rounded', 
      icon: (
        <div className="w-6 h-6 grid grid-cols-3 grid-rows-3 gap-0.5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="rounded-md bg-current"></div>
          ))}
        </div>
      )
    },
    { 
      id: 'frame-square', 
      label: 'Square Frame', 
      icon: (
        <div className="w-6 h-6 border-2 border-current flex items-center justify-center">
          <div className="w-4 h-4 grid grid-cols-2 grid-rows-2 gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-current"></div>
            ))}
          </div>
        </div>
      )
    },
    { 
      id: 'frame-rounded', 
      label: 'Rounded Frame', 
      icon: (
        <div className="w-6 h-6 border-2 border-current rounded-md flex items-center justify-center">
          <div className="w-4 h-4 grid grid-cols-2 grid-rows-2 gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-current"></div>
            ))}
          </div>
        </div>
      )
    },
    { 
      id: 'device-frame', 
      label: 'Device', 
      icon: (
        <div className="w-6 h-6 border-2 border-current rounded-md relative">
          <div className="absolute top-0 w-2 h-0.5 bg-current rounded-full left-1/2 -translate-x-1/2"></div>
          <div className="w-4 h-4 grid grid-cols-2 grid-rows-2 gap-0.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-current"></div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium">QR Style</Label>
      
      <ToggleGroup 
        type="single" 
        value={selectedStyle}
        onValueChange={(value) => value && onChange(value as QRStyleType)}
        className="justify-start flex-wrap"
      >
        {styles.map((style) => (
          <ToggleGroupItem 
            key={style.id}
            value={style.id}
            className={cn(
              "flex flex-col items-center justify-center p-2 h-auto data-[state=on]:bg-accent/50",
              "border border-border rounded-lg mr-2 mb-2 w-[70px]",
              "hover:bg-muted transition-colors"
            )}
            aria-label={style.label}
          >
            <div className={cn(
              "text-muted-foreground mb-1.5",
              selectedStyle === style.id && "text-primary"
            )}>
              {style.icon}
            </div>
            <span className="text-xs font-medium">{style.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default QRStyleSelector;
