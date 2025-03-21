
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface QRScannerHeaderProps {
  onBack?: () => void;
}

const QRScannerHeader: React.FC<QRScannerHeaderProps> = ({ onBack }) => {
  return (
    <div className="p-4 flex items-center justify-between border-b">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBack}
        className="gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <h3 className="text-lg font-medium">Scan QR Code</h3>
      <div className="w-[60px]"></div>
    </div>
  );
};

export default QRScannerHeader;
