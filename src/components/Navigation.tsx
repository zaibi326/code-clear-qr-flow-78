
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, QrCode } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleSupportClick = () => {
    // Navigate to support page
    navigate('/support');
    setIsMenuOpen(false);
  };

  const handleIntegrationsClick = () => {
    // Navigate to integrations page
    navigate('/integrations');
    setIsMenuOpen(false);
  };

  const handleTemplateManagerClick = () => {
    // Navigate to template manager page
    navigate('/template-manager');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ClearQR.io</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              How it Works
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              About
            </button>
            <button 
              onClick={handleIntegrationsClick}
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Integrations
            </button>
            <button 
              onClick={handleTemplateManagerClick}
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Templates
            </button>
            <button 
              onClick={handleSupportClick}
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Support
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild className="text-gray-600 hover:text-blue-600">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
              <Link to="/register">Get Started Free</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                About
              </button>
              <button
                onClick={handleIntegrationsClick}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                Integrations
              </button>
              <button
                onClick={handleTemplateManagerClick}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                Templates
              </button>
              <button
                onClick={handleSupportClick}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                Support
              </button>

              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5 space-x-3">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>Get Started Free</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
