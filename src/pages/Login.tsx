import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Eye, EyeOff, AlertCircle, Shield, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, isLoading, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      console.log('User detected, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Pre-fill email if coming from registration
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, []);

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Login form submitted');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    try {
      console.log('Attempting login...');
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.log('Login failed:', error);
        
        // Show more specific error messages
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password. Please check your credentials.",
          variant: "destructive"
        });
        
        // If it's an invalid credentials error, show additional help
        if (error.message === 'Invalid login credentials' || error.message.includes('email or password')) {
          setTimeout(() => {
            toast({
              title: "Need help?",
              description: "Make sure you're using the correct email and password. If you don't have an account yet, please register first.",
              variant: "default"
            });
          }, 3000);
        }
      } else {
        console.log('Login successful');
        toast({
          title: "Login successful!",
          description: "Welcome back to ClearQR.io.",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-white/20 bg-white/10 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <QrCode className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to your ClearQR.io account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Info banner for new users */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-200">
                <p className="font-medium">New to ClearQR.io?</p>
                <p>You'll need to create an account first before you can sign in.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`bg-white/20 border-white/30 text-white placeholder:text-gray-400 ${
                    errors.email ? 'border-red-500' : 'focus:border-blue-500'
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center space-x-1 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`bg-white/20 border-white/30 text-white placeholder:text-gray-400 pr-10 ${
                      errors.password ? 'border-red-500' : 'focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center space-x-1 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{errors.password}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Create Account
                </Link>
              </p>
            </div>

            {/* Test Account Section */}
            <div className="text-center border-t border-white/20 pt-4">
              <p className="text-sm text-gray-400 mb-3">Quick Test Account</p>
              <Button 
                type="button"
                onClick={() => {
                  setFormData({ email: 'test@clearqr.io', password: 'test123456' });
                }}
                variant="outline" 
                className="w-full bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30"
              >
                Use Test Account
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Administrator?</p>
              <Link to="/admin/login">
                <Button variant="outline" className="w-full flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Shield className="h-4 w-4" />
                  Admin Portal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;