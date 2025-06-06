
import React from 'react';
import { QrCode, Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

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
      </div>
    </footer>
  );
};

export default Footer;
