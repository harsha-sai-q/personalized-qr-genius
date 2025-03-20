
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import Features from '@/components/Features';
import AboutSection from '@/components/AboutSection';
import { QrCode, Scan, Smartphone, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link to="/scan">
                <Button variant="outline" className="gap-2">
                  <Scan className="h-4 w-4" />
                  Scan QR Code
                </Button>
              </Link>
              <a href="#generate">
                <Button className="gap-2">
                  <QrCode className="h-4 w-4" />
                  Create QR Code
                </Button>
              </a>
            </div>
          </div>
          
          <div id="generate">
            <QRCodeGenerator />
          </div>
        </section>
        
        <Features />
        
        {/* Multi-platform Section */}
        <section className="py-12 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Available on All Platforms</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create and scan QR codes on any device with our web, mobile, and desktop applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 text-center border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scan className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Scan QR Codes</h3>
              <p className="text-muted-foreground mb-4">
                Use your device's camera to quickly scan and decode any QR code in seconds.
              </p>
              <Link to="/scan">
                <Button variant="outline" size="sm">
                  Open Scanner
                </Button>
              </Link>
            </div>
            
            <div className="bg-card rounded-xl p-6 text-center border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile App</h3>
              <p className="text-muted-foreground mb-4">
                Download our mobile app for iOS and Android for on-the-go QR code management.
              </p>
              <Button variant="outline" size="sm">
                Get App
              </Button>
            </div>
            
            <div className="bg-card rounded-xl p-6 text-center border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bulk Generator</h3>
              <p className="text-muted-foreground mb-4">
                Generate multiple QR codes at once for business or marketing campaigns.
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          </div>
        </section>
        
        <AboutSection />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
