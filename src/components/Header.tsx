
import React from 'react';
import { QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn('flex items-center justify-between py-6', className)}>
      <div className="flex items-center">
        <div className="bg-primary text-white p-2 rounded mr-3 shadow-subtle">
          <QrCode className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">QR Genius</h1>
          <p className="text-xs text-muted-foreground">Personalized QR Code Generator</p>
        </div>
      </div>
      
      <nav className="hidden sm:flex items-center space-x-6">
        <a 
          href="#features" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Features
        </a>
        <a 
          href="#about" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          About
        </a>
      </nav>
    </header>
  );
};

export default Header;
