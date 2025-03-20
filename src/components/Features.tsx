
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Shield, Download, Smartphone, Zap, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <Card className="bg-card border shadow-subtle overflow-hidden h-full">
      <CardContent className="p-6">
        <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

interface FeaturesProps {
  className?: string;
}

const Features: React.FC<FeaturesProps> = ({ className }) => {
  const features = [
    {
      icon: <Palette className="h-6 w-6 text-primary" />,
      title: 'Custom Colors',
      description: 'Choose any color combination for your QR code to match your brand identity.',
    },
    {
      icon: <Image className="h-6 w-6 text-primary" />,
      title: 'Logo Integration',
      description: 'Upload and embed your logo into the QR code for brand recognition.',
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Safe Scan Badge',
      description: 'Add a trust indicator to reassure users that your QR code is safe to scan.',
    },
    {
      icon: <Download className="h-6 w-6 text-primary" />,
      title: 'Multiple Formats',
      description: 'Download your QR codes in PNG or SVG format for different use cases.',
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary" />,
      title: 'Mobile Friendly',
      description: 'Create and customize QR codes directly from your phone or tablet.',
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: 'Instant Generation',
      description: 'Generate QR codes instantly without waiting for server processing.',
    },
  ];

  return (
    <section id="features" className={cn('py-12', className)}>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Powerful Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create beautiful, functional QR codes that stand out with our comprehensive set of features
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Feature
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
