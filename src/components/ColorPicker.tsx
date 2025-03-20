
import React, { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
  className?: string;
}

// Predefined colors for quick selection
const presetColors = [
  '#000000', '#1F2937', '#4B5563', 
  '#10B981', '#059669', '#06805E',
  '#3B82F6', '#2563EB', '#1E40AF',
  '#8B5CF6', '#7C3AED', '#6D28D9',
  '#EC4899', '#DB2777', '#BE185D',
  '#EF4444', '#DC2626', '#B91C1C',
  '#F59E0B', '#D97706', '#B45309',
];

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label, className }) => {
  const [selectedColor, setSelectedColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    onChange(newColor);
  };

  const handlePresetColorClick = (presetColor: string) => {
    setSelectedColor(presetColor);
    onChange(presetColor);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={`color-${label}`} className="text-sm font-medium">
        {label}
      </Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between border rounded-lg h-10 px-3 py-2 shadow-button"
            id={`color-${label}`}
          >
            <div className="flex items-center">
              <div 
                className="w-5 h-5 rounded-full mr-2 border shadow-sm" 
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-sm font-medium">{selectedColor}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-3">
            <div>
              <Label htmlFor={`colorinput-${label}`} className="text-xs font-medium">
                Custom Color
              </Label>
              <div className="flex mt-1.5 items-center">
                <input
                  ref={colorInputRef}
                  type="color"
                  id={`colorinput-${label}`}
                  value={selectedColor}
                  onChange={handleColorChange}
                  className="w-10 h-10 rounded border p-0 cursor-pointer"
                  style={{ appearance: 'none' }}
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      setSelectedColor(val);
                      onChange(val);
                    }
                  }}
                  className="ml-3 flex-1 h-8 px-2 rounded-md border text-xs"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Presets</Label>
              <div className="grid grid-cols-6 gap-1.5">
                {presetColors.map((presetColor, index) => (
                  <button
                    key={index}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-md border transition-transform",
                      selectedColor === presetColor && "ring-2 ring-ring ring-offset-1 scale-110",
                      "hover:scale-110 hover:shadow-sm"
                    )}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handlePresetColorClick(presetColor)}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => setIsOpen(false)}
                className="text-xs px-3"
              >
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
