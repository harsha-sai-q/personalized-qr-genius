
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QrCode, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_QR_OPTIONS, QROptionsType, generateQRCode, generateQRCodeSVG, addLogoToQRCode, downloadQRCode, isValidUrl, generateSafeScanBadge } from '@/lib/qr-utils';
import { cn } from '@/lib/utils';
import { QRStyleType } from './QRStyleSelector';

import CustomizationPanel from './CustomizationPanel';

const QRCodeGenerator: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [qrData, setQrData] = useState<string>('');
  const [qrImage, setQrImage] = useState<string>('');
  const [logo, setLogo] = useState<string | null>(null);
  const [qrOptions, setQrOptions] = useState({
    color: DEFAULT_QR_OPTIONS.color || '#000000',
    backgroundColor: DEFAULT_QR_OPTIONS.backgroundColor || '#FFFFFF',
    cornerRadius: DEFAULT_QR_OPTIONS.cornerRadius || 0,
    safeScan: false,
    style: 'standard' as QRStyleType,
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (qrData && !isGenerating) {
      generateQRWithOptions();
    }
  }, [qrOptions, logo, qrData]);

  const isURLMode = isValidUrl(inputValue) || inputValue === '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const generateQR = async () => {
    if (!inputValue) {
      toast.error('Please enter a URL or text');
      return;
    }
    
    setIsGenerating(true);
    setQrData(inputValue);
    
    try {
      const options: QROptionsType = {
        ...DEFAULT_QR_OPTIONS,
        data: inputValue,
        color: qrOptions.color,
        backgroundColor: qrOptions.backgroundColor,
        cornerRadius: qrOptions.cornerRadius,
        style: qrOptions.style,
      };
      
      const qrCodeImage = await generateQRCode(options);
      let finalImage = qrCodeImage;
      
      if (logo) {
        finalImage = await addLogoToQRCode(qrCodeImage, logo);
      }
      
      if (qrOptions.safeScan) {
        finalImage = await generateSafeScanBadge(finalImage);
      }
      
      setQrImage(finalImage);
      toast.success('QR code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateQRWithOptions = async () => {
    if (!qrData) return;
    
    setIsGenerating(true);
    
    try {
      const options: QROptionsType = {
        ...DEFAULT_QR_OPTIONS,
        data: qrData,
        color: qrOptions.color,
        backgroundColor: qrOptions.backgroundColor,
        cornerRadius: qrOptions.cornerRadius,
        style: qrOptions.style,
      };
      
      const qrCodeImage = await generateQRCode(options);
      let finalImage = qrCodeImage;
      
      if (logo) {
        finalImage = await addLogoToQRCode(qrCodeImage, logo);
      }
      
      if (qrOptions.safeScan) {
        finalImage = await generateSafeScanBadge(finalImage);
      }
      
      setQrImage(finalImage);
    } catch (error) {
      console.error('Error updating QR code:', error);
      toast.error('Failed to update QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogoChange = (logoUrl: string | null) => {
    setLogo(logoUrl);
  };

  const handleDownload = async (format: 'png' | 'svg') => {
    if (!qrData) {
      toast.error('Please generate a QR code first');
      return;
    }
    
    try {
      if (format === 'svg' && !logo && !qrOptions.safeScan) {
        // For SVG, we need to regenerate without logo and safeScan
        const options: QROptionsType = {
          ...DEFAULT_QR_OPTIONS,
          data: qrData,
          color: qrOptions.color,
          backgroundColor: qrOptions.backgroundColor,
          cornerRadius: qrOptions.cornerRadius,
        };
        
        const svgString = await generateQRCodeSVG(options);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        downloadQRCode(svgUrl, 'qr-genius-code', 'svg');
        URL.revokeObjectURL(svgUrl);
      } else {
        // For PNG or if we have a logo or safeScan
        downloadQRCode(qrImage, 'qr-genius-code', 'png');
      }
      
      toast.success(`QR code downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mt-6">
      <div className="order-2 md:order-1">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight">Create Your QR Code</h2>
            <p className="text-sm text-muted-foreground">
              Enter a {isURLMode ? 'URL' : 'text'} below to generate a customizable QR code
            </p>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={isURLMode ? "Enter URL (e.g., https://example.com)" : "Enter text"}
                value={inputValue}
                onChange={handleInputChange}
                className="pr-10 h-11 shadow-button font-medium"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {isURLMode ? (
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <QrCode className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
            <Button 
              onClick={generateQR} 
              disabled={isGenerating || !inputValue}
              className="h-11 shadow-button font-medium"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
          
          <CustomizationPanel
            qrOptions={qrOptions}
            onQrOptionsChange={setQrOptions}
            onLogoChange={handleLogoChange}
            onDownload={handleDownload}
            hasGeneratedQR={!!qrData}
          />
        </div>
      </div>
      
      <div className="order-1 md:order-2 flex flex-col items-center justify-center">
        <div className={cn(
          "rounded-2xl p-6 flex flex-col items-center justify-center w-full max-w-[350px] h-[350px]",
          "qr-code-container transition-all duration-300 bg-card",
          "border-2",
          qrImage ? "border-border" : "border-dashed border-muted"
        )}>
          {qrImage ? (
            <img 
              src={qrImage} 
              alt="Generated QR Code" 
              className="max-w-full max-h-full object-contain animate-scale-in" 
            />
          ) : (
            <div className="text-center space-y-3">
              <div className="w-24 h-24 mx-auto bg-muted rounded-lg flex items-center justify-center">
                <QrCode className="h-12 w-12 text-muted-foreground opacity-70" />
              </div>
              <div>
                <p className="text-sm font-medium">QR Code Preview</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a URL or text to generate
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
