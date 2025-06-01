
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const solutionsItems = [
    { label: 'Marketing', href: '/solutions/marketing' },
    { label: 'Events', href: '/solutions/events' },
    { label: 'Restaurants', href: '/solutions/restaurants' },
    { label: 'Retail', href: '/solutions/retail' },
    { label: 'Healthcare', href: '/solutions/healthcare' }
  ];

  const resourcesItems = [
    { label: 'Blog', href: '/blog' },
    { label: 'Help Center', href: '/help-center' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'QR Code Generator', href: '/quick-generate' },
    { label: 'Best Practices', href: '/best-practices' }
  ];

  const companyItems = [
    { label: 'About Us', href: '/company/about' },
    { label: 'Careers', href: '/company/careers' },
    { label: 'Contact', href: '/company/contact' },
    { label: 'Privacy Policy', href: '/company/privacy' },
    { label: 'Terms of Service', href: '/company/terms' }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ClearQR.io
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Solutions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <span>Solutions</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg">
                {solutionsItems.map((item, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link to={item.href} className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <span>Resources</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg">
                {resourcesItems.map((item, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link to={item.href} className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Company Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <span>Company</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg">
                {companyItems.map((item, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link to={item.href} className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/api-documentation" className="text-gray-700 hover:text-blue-600 transition-colors">
              API
            </Link>
            <Link to="/integrations" className="text-gray-700 hover:text-blue-600 transition-colors">
              Integrations
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link to="/register">Get Started</Link>
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
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-medium text-gray-900">Solutions</div>
                {solutionsItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="block px-6 py-2 text-sm text-gray-600 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-medium text-gray-900">Resources</div>
                {resourcesItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="block px-6 py-2 text-sm text-gray-600 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-medium text-gray-900">Company</div>
                {companyItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="block px-6 py-2 text-sm text-gray-600 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5 space-x-3">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
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
