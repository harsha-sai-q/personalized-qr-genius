import React from 'react';
import { QrCode, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
interface FooterProps {
  className?: string;
}
const Footer: React.FC<FooterProps> = ({
  className
}) => {
  return <footer className={cn('py-8 mt-10 border-t', className)}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <QrCode className="h-5 w-5 text-primary mr-2" />
            <p className="text-sm font-medium">Indic Tools </p>
          </div>
          
          <p className="text-xs text-muted-foreground flex items-center">
            Crafted with
            <Heart className="h-3 w-3 mx-1 text-red-400" />
            for simplicity & elegance
          </p>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <a href="#privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;