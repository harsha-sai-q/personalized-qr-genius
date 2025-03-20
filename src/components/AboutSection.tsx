
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AboutSectionProps {
  className?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ className }) => {
  return (
    <section id="about" className={cn('py-12', className)}>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Why Choose QR Genius?
          </h2>
          <p className="text-muted-foreground mb-6">
            QR Genius provides an easy, free, and powerful way to create custom QR codes for personal and business use. 
            Our tool focuses on simplicity and effectiveness, allowing you to create professional QR codes in seconds.
          </p>
          
          <ul className="space-y-3">
            {[
              'Free to use with no hidden costs',
              'No account or sign-up required',
              'Local processing - your data stays private',
              'High-quality QR codes that always scan',
              'Customizable designs to match your brand',
              'Instant downloads in multiple formats',
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-accent/50 rounded-xl p-6 border">
          <h3 className="text-xl font-semibold mb-4">Common QR Code Uses</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Websites', description: 'Direct people to your online presence' },
              { title: 'Business Cards', description: 'Share contact details digitally' },
              { title: 'WiFi Access', description: 'Let guests connect without typing passwords' },
              { title: 'Product Information', description: 'Provide details about your products' },
              { title: 'Events', description: 'Share event details or registration links' },
              { title: 'Restaurant Menus', description: 'Offer contactless digital menus' },
            ].map((use, index) => (
              <div key={index} className="space-y-1">
                <h4 className="font-medium">{use.title}</h4>
                <p className="text-xs text-muted-foreground">{use.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
