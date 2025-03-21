
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Image as ImageIcon } from 'lucide-react';
import QRScannerHeader from './QRScannerHeader';
import CameraScanner from './CameraScanner';
import FileUploader from './FileUploader';

interface QRScannerProps {
  onScanResult: (result: string) => void;
  onBack?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanResult, onBack }) => {
  const [activeTab, setActiveTab] = useState<string>('camera');

  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden">
      <QRScannerHeader onBack={onBack} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="p-4 pt-2 border-b">
          <TabsList className="w-full grid grid-cols-2 h-10">
            <TabsTrigger value="camera" className="text-sm font-medium">
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="gallery" className="text-sm font-medium">
              <ImageIcon className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="camera" className="p-0 m-0">
          <CameraScanner onScanResult={onScanResult} />
        </TabsContent>
        
        <TabsContent value="gallery" className="p-0 m-0">
          <FileUploader onScanResult={onScanResult} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QRScanner;
