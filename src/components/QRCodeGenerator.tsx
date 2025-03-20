import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QrCode, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_QR_OPTIONS, QROptionsType, generateQRCode, generateQRCodeSVG, addLogoToQRCode, downloadQRCode, isValidUrl, generateSafeScanBadge } from '@/lib/qr-utils';
import { cn } from '@/lib/utils';
import { QRContentType } from './QRTypeSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import CustomizationPanel from './CustomizationPanel';
import QRTypeSelector from './QRTypeSelector';

const QRCodeGenerator: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [qrData, setQrData] = useState<string>('');
  const [qrImage, setQrImage] = useState<string>('');
  const [logo, setLogo] = useState<string | null>(null);
  const [contentType, setContentType] = useState<QRContentType>('link');
  const [qrOptions, setQrOptions] = useState({
    color: DEFAULT_QR_OPTIONS.color || '#000000',
    backgroundColor: DEFAULT_QR_OPTIONS.backgroundColor || '#FFFFFF',
    cornerRadius: DEFAULT_QR_OPTIONS.cornerRadius || 0,
    safeScan: false,
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  useEffect(() => {
    if (qrData && !isGenerating) {
      generateQRWithOptions();
    }
  }, [qrOptions, logo, qrData]);

  const isURLMode = contentType === 'link' || contentType === 'app' || contentType === 'pdf';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const generateQR = async () => {
    if (!inputValue) {
      toast.error('Please enter content for your QR code');
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
      setActiveStep(2);
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

  const getInputPlaceholder = () => {
    switch (contentType) {
      case 'link': return 'Enter URL (e.g., https://example.com)';
      case 'text': return 'Enter text content';
      case 'email': return 'Enter email address';
      case 'call': return 'Enter phone number';
      case 'sms': return 'Enter phone number';
      case 'vcard': return 'Enter contact details';
      case 'wifi': return 'Enter WiFi network name';
      default: return 'Enter content for QR code';
    }
  };

  const getStepLabel = (step: number) => {
    switch (step) {
      case 1: return 'Complete the content';
      case 2: return 'Design your QR Code';
      case 3: return 'Download QR Code';
      default: return '';
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mt-6">
      <div className="order-2 md:order-1">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {activeStep}
            </div>
            <h2 className="text-xl font-bold tracking-tight">{getStepLabel(activeStep)}</h2>
          </div>
          
          {activeStep === 1 && (
            <div className="space-y-5">
              <QRTypeSelector 
                selectedType={contentType}
                onChange={setContentType}
              />
              
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder={getInputPlaceholder()}
                      value={inputValue}
                      onChange={handleInputChange}
                      className="pr-10 h-11 shadow-button font-medium"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {isURLMode ? (
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
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
              </div>
            </div>
          )}
          
          {activeStep >= 2 && (
            <div className="space-y-4">
              <Tabs defaultValue="design" className="w-full">
                <TabsList className="w-full grid grid-cols-2 h-10">
                  <TabsTrigger value="design" onClick={() => setActiveStep(2)}>Customize Design</TabsTrigger>
                  <TabsTrigger value="download" onClick={() => setActiveStep(3)}>Download</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <CustomizationPanel
                qrOptions={qrOptions}
                onQrOptionsChange={setQrOptions}
                onLogoChange={handleLogoChange}
                onDownload={handleDownload}
                hasGeneratedQR={!!qrData}
              />
              
              <div className="flex space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveStep(1)}
                  className="h-10"
                >
                  Edit Content
                </Button>
                <Button 
                  onClick={() => handleDownload('png')}
                  className="h-10"
                >
                  Download QR
                </Button>
              </div>
            </div>
          )}
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
                  Enter content to generate
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
