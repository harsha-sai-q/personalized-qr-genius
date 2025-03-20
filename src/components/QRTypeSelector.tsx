
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Link as LinkIcon, 
  Text, 
  Mail, 
  PhoneCall, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Share, 
  CalendarDays, 
  Barcode, 
  Smartphone, 
  Wifi, 
  FileText,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type QRContentType = 
  | 'link' 
  | 'text' 
  | 'email' 
  | 'call' 
  | 'sms' 
  | 'vcard' 
  | 'wifi' 
  | 'app' 
  | 'pdf' 
  | 'image' 
  | 'video' 
  | 'social' 
  | 'event' 
  | 'barcode';

interface QRTypeSelectorProps {
  selectedType: QRContentType;
  onChange: (type: QRContentType) => void;
  className?: string;
}

const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({ 
  selectedType, 
  onChange, 
  className 
}) => {
  const contentTypes = [
    { id: 'link', label: 'Link', icon: <LinkIcon className="h-4 w-4" /> },
    { id: 'text', label: 'Text', icon: <Text className="h-4 w-4" /> },
    { id: 'email', label: 'E-mail', icon: <Mail className="h-4 w-4" /> },
    { id: 'call', label: 'Call', icon: <PhoneCall className="h-4 w-4" /> },
    { id: 'sms', label: 'SMS', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'vcard', label: 'V-card', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'wifi', label: 'Wi-Fi', icon: <Wifi className="h-4 w-4" /> },
    { id: 'app', label: 'App', icon: <Smartphone className="h-4 w-4" /> },
    { id: 'pdf', label: 'PDF', icon: <FileText className="h-4 w-4" /> },
    { id: 'image', label: 'Images', icon: <ImageIcon className="h-4 w-4" /> },
    { id: 'video', label: 'Video', icon: <Video className="h-4 w-4" /> },
    { id: 'social', label: 'Social Media', icon: <Share className="h-4 w-4" /> },
    { id: 'event', label: 'Event', icon: <CalendarDays className="h-4 w-4" /> },
    { id: 'barcode', label: '2D Barcode', icon: <Barcode className="h-4 w-4" /> },
  ];

  // Create rows of content types, 7 per row
  const rows = [];
  for (let i = 0; i < contentTypes.length; i += 7) {
    rows.push(contentTypes.slice(i, i + 7));
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-md font-medium">Choose Content Type</h3>
      
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2">
          {row.map((type) => (
            <button
              key={type.id}
              onClick={() => onChange(type.id as QRContentType)}
              className={cn(
                "flex flex-col items-center justify-center p-2 h-auto rounded-lg",
                "border text-center min-w-[70px] hover:bg-accent/50 transition-colors",
                selectedType === type.id 
                  ? "border-primary bg-accent/50 text-primary"
                  : "border-border text-muted-foreground"
              )}
            >
              <div className="mb-1">{type.icon}</div>
              <span className="text-xs font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QRTypeSelector;
