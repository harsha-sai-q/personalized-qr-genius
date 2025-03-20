
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface ShapeSelectorProps {
  cornerRadius: number;
  onChange: (cornerRadius: number) => void;
  className?: string;
}

const ShapeSelector: React.FC<ShapeSelectorProps> = ({ cornerRadius, onChange, className }) => {
  const shapes = [
    { id: 'square', label: 'Square', value: 0 },
    { id: 'rounded', label: 'Rounded', value: 8 },
    { id: 'circle', label: 'Circle', value: 16 },
  ];

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium">Shape Style</Label>
      <RadioGroup
        value={cornerRadius.toString()}
        onValueChange={(value) => onChange(parseInt(value))}
        className="flex gap-3"
      >
        {shapes.map((shape) => (
          <div key={shape.id} className="flex flex-col items-center">
            <div className="relative h-14 w-14 flex items-center justify-center mb-1.5">
              <div 
                className={cn(
                  "absolute inset-0 bg-secondary border border-border",
                  "transition-all duration-300",
                  {
                    "rounded-none": shape.value === 0,
                    "rounded-md": shape.value === 8,
                    "rounded-xl": shape.value === 16,
                  }
                )}
              />
              <div className="relative">
                <RadioGroupItem 
                  value={shape.value.toString()} 
                  id={shape.id}
                  className="sr-only"
                />
                <Label 
                  htmlFor={shape.id}
                  className={cn(
                    "cursor-pointer flex h-10 w-10 items-center justify-center",
                    "border-2 transition-all duration-200",
                    {
                      "rounded-none": shape.value === 0,
                      "rounded-md": shape.value === 8,
                      "rounded-xl": shape.value === 16,
                      "border-primary bg-primary/10": cornerRadius === shape.value,
                      "border-transparent hover:border-primary/30": cornerRadius !== shape.value,
                    }
                  )}
                >
                  <span className="sr-only">{shape.label}</span>
                </Label>
              </div>
            </div>
            <span className="text-xs font-medium">{shape.label}</span>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ShapeSelector;
