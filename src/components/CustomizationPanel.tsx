
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Image, Download, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import LogoUploader from './LogoUploader';
import ColorPicker from './ColorPicker';
import ShapeSelector from './ShapeSelector';
import SafeScanBadge from './SafeScanBadge';
import DownloadOptions from './DownloadOptions';
import QRStyleSelector, { QRStyleType } from './QRStyleSelector';

interface CustomizationPanelProps {
  qrOptions: {
    color: string;
    backgroundColor: string;
    cornerRadius: number;
    safeScan: boolean;
    style: QRStyleType;
  };
  onQrOptionsChange: (options: any) => void;
  onLogoChange: (logoUrl: string | null) => void;
  onDownload: (format: 'png' | 'svg') => void;
  className?: string;
  hasGeneratedQR: boolean;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  qrOptions,
  onQrOptionsChange,
  onLogoChange,
  onDownload,
  className,
  hasGeneratedQR
}) => {
  return (
    <div className={cn('bg-card rounded-xl border shadow-subtle overflow-hidden', className)}>
      <Tabs defaultValue="design" className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="w-full grid grid-cols-3 h-10">
            <TabsTrigger value="design" className="text-xs sm:text-sm font-medium">
              <Palette className="h-3.5 w-3.5 mr-1.5 sm:mr-2" />
              Design
            </TabsTrigger>
            <TabsTrigger value="logo" className="text-xs sm:text-sm font-medium">
              <Image className="h-3.5 w-3.5 mr-1.5 sm:mr-2" />
              Logo
            </TabsTrigger>
            <TabsTrigger value="download" className="text-xs sm:text-sm font-medium">
              <Download className="h-3.5 w-3.5 mr-1.5 sm:mr-2" />
              Download
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4">
          <TabsContent value="design" className="space-y-4 mt-0">
            <QRStyleSelector
              selectedStyle={qrOptions.style}
              onChange={(style) => onQrOptionsChange({ ...qrOptions, style })}
            />
            <Separator className="my-3" />
            <ColorPicker
              label="QR Code Color"
              color={qrOptions.color}
              onChange={(color) => onQrOptionsChange({ ...qrOptions, color })}
            />
            <ColorPicker
              label="Background Color"
              color={qrOptions.backgroundColor}
              onChange={(backgroundColor) => onQrOptionsChange({ ...qrOptions, backgroundColor })}
            />
            <Separator className="my-3" />
            <ShapeSelector
              cornerRadius={qrOptions.cornerRadius}
              onChange={(cornerRadius) => onQrOptionsChange({ ...qrOptions, cornerRadius })}
            />
            <Separator className="my-3" />
            <SafeScanBadge
              enabled={qrOptions.safeScan}
              onChange={(safeScan) => onQrOptionsChange({ ...qrOptions, safeScan })}
            />
          </TabsContent>

          <TabsContent value="logo" className="space-y-4 mt-0">
            <LogoUploader onLogoChange={onLogoChange} />
            <div className="bg-muted rounded-lg p-3 mt-4">
              <h4 className="text-sm font-medium flex items-center">
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                Logo Tips
              </h4>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>• Use a simple logo with clear edges</li>
                <li>• Transparent PNG files work best</li>
                <li>• Square aspect ratio is recommended</li>
                <li>• Use contrasting colors for better scanning</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="download" className="mt-0">
            <DownloadOptions 
              onDownload={onDownload}
              disabled={!hasGeneratedQR}
            />
            
            {!hasGeneratedQR && (
              <div className="bg-accent/50 rounded-lg p-3 mt-4 border border-accent">
                <p className="text-xs text-muted-foreground">
                  Please generate a QR code first by entering a URL or text in the input field.
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CustomizationPanel;
