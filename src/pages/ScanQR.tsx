
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import QRScanner from '@/components/QRScanner';
import { QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { isValidUrl } from '@/lib/qr-utils';

const ScanQR: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleScanResult = (result: string) => {
    setScanResult(result);
    setIsScanning(false);
    toast.success('QR Code scanned successfully!');
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setScanResult(null);
  };

  const handleBack = () => {
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto flex-1 py-10">
        <div className="max-w-md mx-auto">
          <Link to="/" className="inline-block mb-6">
            <div className="inline-flex items-center justify-center bg-accent rounded-full px-3 py-1">
              <QrCode className="h-4 w-4 text-primary mr-2" />
              <span className="text-xs font-medium text-primary">QR Genius</span>
            </div>
          </Link>

          <h1 className="text-3xl font-bold mb-6">Scan QR Code</h1>

          {isScanning ? (
            <QRScanner onScanResult={handleScanResult} onBack={handleBack} />
          ) : (
            <div className="bg-card rounded-xl border shadow-md p-6">
              {scanResult ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Scan Result:</h2>
                  <div className="bg-muted p-4 rounded-md break-all">
                    {scanResult}
                  </div>
                  
                  {isValidUrl(scanResult) && (
                    <div className="flex justify-end">
                      <Button
                        onClick={() => window.open(scanResult, '_blank')}
                        className="mt-2"
                      >
                        Open URL
                      </Button>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleStartScan} 
                    className="w-full mt-4"
                  >
                    Scan Another Code
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="bg-muted rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-primary" />
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-medium mb-2">Scan any QR Code</h2>
                    <p className="text-muted-foreground">
                      Use your camera or upload an image to scan QR codes quickly
                    </p>
                  </div>
                  
                  <Button onClick={handleStartScan} className="w-full">
                    Start Scanning
                  </Button>
                  
                  <div className="pt-2">
                    <Link to="/">
                      <Button variant="link" className="text-sm">
                        Back to Generator
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
