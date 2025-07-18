
import React, { useState } from 'react';
import { QrCode, Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Footer = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const footerLinks = {
    Product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'API Documentation', href: '/api-documentation' },
      { name: 'Integrations', href: '/integrations' },
      { name: 'Changelog', href: '/changelog' }
    ],
    Solutions: [
      { name: 'Marketing', href: '/solutions/marketing' },
      { name: 'Events', href: '/solutions/events' },
      { name: 'Restaurants', href: '/solutions/restaurants' },
      { name: 'Retail', href: '/solutions/retail' },
      { name: 'Healthcare', href: '/solutions/healthcare' }
    ],
    Resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Help Center', href: '/help-center' },
      { name: 'Case Studies', href: '/case-studies' },
      { name: 'QR Code Generator', href: '/quick-generate' },
      { name: 'Best Practices', href: '/best-practices' }
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/company/careers' },
      { name: 'Contact', href: '/company/contact' },
      { name: 'Privacy Policy', href: '/company/privacy' },
      { name: 'Terms of Service', href: '/company/terms' }
    ]
  };

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      // Handle anchor links
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Scroll to top for non-anchor links
    if (!href.startsWith('#')) {
      window.scrollTo(0, 0);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubscribing(true);
    
    try {
      // Simulate newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for subscribing to our newsletter. You'll receive the latest QR code trends and platform updates.",
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to our newsletter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6" onClick={() => handleLinkClick('/')}>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">ClearQR.io</span>
            </Link>
            
            <p className="text-gray-400 mb-6 max-w-md">
              The most powerful QR code platform for businesses. Create, customize, 
              and track dynamic QR codes that drive engagement and growth.
            </p>
            
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:support@clearqr.io" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('#') ? (
                      <button 
                        onClick={() => handleLinkClick(link.href)}
                        className="text-gray-400 hover:text-white transition-colors text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link 
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                        onClick={() => handleLinkClick(link.href)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
              <p className="text-gray-400">Get the latest QR code trends and platform updates.</p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-4 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribing}
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 px-6 py-2 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; 2024 ClearQR.io. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              to="/company/privacy" 
              className="hover:text-white transition-colors"
              onClick={() => handleLinkClick('/company/privacy')}
            >
              Privacy
            </Link>
            <Link 
              to="/company/terms" 
              className="hover:text-white transition-colors"
              onClick={() => handleLinkClick('/company/terms')}
            >
              Terms
            </Link>
            <Link 
              to="/support" 
              className="hover:text-white transition-colors"
              onClick={() => handleLinkClick('/support')}
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
