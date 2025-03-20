
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SafeScanBadgeProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

const SafeScanBadge: React.FC<SafeScanBadgeProps> = ({ enabled, onChange, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="safe-scan" className="text-sm font-medium cursor-pointer">
            Safe Scan Badge
          </Label>
          <p className="text-xs text-muted-foreground">
            Add a verification badge to your QR code
          </p>
        </div>
        <Switch
          id="safe-scan"
          checked={enabled}
          onCheckedChange={onChange}
          className="data-[state=checked]:bg-primary"
        />
      </div>
      
      <div className={cn(
        "rounded-lg border p-3 transition-all duration-300",
        enabled ? "bg-accent/50" : "bg-muted/40"
      )}>
        <div className="flex items-center">
          {enabled ? (
            <ShieldCheck className="h-9 w-9 text-primary mr-3" />
          ) : (
            <Shield className="h-9 w-9 text-muted-foreground mr-3" />
          )}
          <div>
            <h4 className={cn(
              "text-sm font-medium",
              enabled ? "text-foreground" : "text-muted-foreground"
            )}>
              {enabled ? "Safe Scan Verified" : "Safe Scan Inactive"}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {enabled 
                ? "Users will see a verification badge below the QR code" 
                : "Enable to add trust indicators to your QR code"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeScanBadge;
