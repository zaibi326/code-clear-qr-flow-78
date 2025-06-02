
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Zap, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTAFooterSection = () => {
  const handleContactSales = () => {
    // Simple demo scheduling functionality
    alert('Thank you for your interest! Our sales team will contact you soon. Email: sales@clearqr.io | Phone: 1-800-CLEARQR');
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Main CTA Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 font-semibold mb-6">
              <Star className="h-4 w-4" />
              <span>Ready to Launch</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Launch Your{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                QR Journey?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-medium mb-12">
              Join thousands of businesses already using ClearQR to create smarter customer experiences and drive measurable growth.
            </p>
          </div>

          {/* Value Props Row */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            {[
              {
                icon: <Zap className="h-6 w-6" />,
                text: "Setup in 5 minutes",
                subtext: "No technical skills needed"
              },
              {
                icon: <Shield className="h-6 w-6" />,
                text: "Enterprise security",
                subtext: "GDPR & SOC2 compliant"
              },
              {
                icon: <Star className="h-6 w-6" />,
                text: "24/7 expert support",
                subtext: "Dedicated success team"
              }
            ].map((prop, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-center gap-3 text-white">
                  {prop.icon}
                  <div className="text-left">
                    <div className="font-bold">{prop.text}</div>
                    <div className="text-blue-200 text-sm">{prop.subtext}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-blue-50 px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-0 h-auto group" 
              asChild
            >
              <Link to="/register">
                <Zap className="h-6 w-6 mr-3 group-hover:text-blue-700 transition-colors" />
                <span className="mr-3">Create Free QR</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-12 py-6 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 h-auto group"
              onClick={handleContactSales}
            >
              <Calendar className="h-6 w-6 mr-3" />
              <span>Contact Sales</span>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-4 text-blue-200 text-sm font-medium">
            {[
              "✓ Free 14-day trial",
              "✓ No setup fees", 
              "✓ Cancel anytime",
              "✓ Migration support included"
            ].map((indicator, index) => (
              <span key={index} className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
                {indicator}
              </span>
            ))}
          </div>

          {/* Bottom stats */}
          <div className="mt-16 pt-12 border-t border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { stat: "5M+", label: "Scans monthly" },
                { stat: "50K+", label: "Active users" },
                { stat: "99.9%", label: "Uptime SLA" },
                { stat: "150+", label: "Countries" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{item.stat}</div>
                  <div className="text-blue-200 text-sm font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAFooterSection;
