
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, isLoading, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const success = await register(formData.name, formData.email, formData.password);
      
      if (success) {
        toast({
          title: "Registration successful!",
          description: "Welcome to ClearQR.io! You can now sign in.",
        });
        // Redirect to login with email pre-filled
        navigate(`/login?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast({
          title: "Registration failed",
          description: "Failed to create account. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Show specific error message if available
      const errorMessage = error?.message || "An unexpected error occurred. Please try again.";
      
      toast({
        title: "Registration failed",
        description: errorMessage,
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
            <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
            <CardDescription className="text-gray-300">
              Join thousands of businesses using ClearQR.io
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`bg-white/20 border-white/30 text-white placeholder:text-gray-400 ${
                    errors.name ? 'border-red-500' : 'focus:border-blue-500'
                  }`}
                />
                {errors.name && (
                  <div className="flex items-center space-x-1 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{errors.name}</span>
                  </div>
                )}
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`bg-white/20 border-white/30 text-white placeholder:text-gray-400 ${
                    errors.confirmPassword ? 'border-red-500' : 'focus:border-blue-500'
                  }`}
                />
                {errors.confirmPassword && (
                  <div className="flex items-center space-x-1 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{errors.confirmPassword}</span>
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
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Sign In
                </Link>
              </p>
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

export default Register;
