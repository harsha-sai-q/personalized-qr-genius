
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import Features from '@/components/Features';
import AboutSection from '@/components/AboutSection';
import { QrCode } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto flex-1">
        <Header />
        
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center bg-accent rounded-full px-3 py-1 mb-4">
              <QrCode className="h-4 w-4 text-primary mr-2" />
              <span className="text-xs font-medium text-primary">Free QR Code Generator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Create Custom QR Codes <br className="hidden sm:inline" />
              <span className="text-primary">in Seconds</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Generate personalized QR codes with logos, colors, and shapes. 
              No sign up required - it's completely free.
            </p>
          </div>
          
          <QRCodeGenerator />
        </section>
        
        <Features />
        
        <AboutSection />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
