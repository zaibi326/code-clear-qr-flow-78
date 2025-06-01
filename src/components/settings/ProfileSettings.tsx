
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Save, User, Mail, Phone, Building, Globe } from 'lucide-react';
import { userProfileService, UserProfileUpdate } from '@/utils/userProfileService';
import { DatabaseUser } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export function ProfileSettings() {
  const [userProfile, setUserProfile] = useState<DatabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    timezone: '',
  });

  const { toast } = useToast();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      // Load profile with a mock user ID for demo purposes
      const profile = await userProfileService.loadUserProfile('demo-user-123');
      
      if (profile) {
        setUserProfile(profile);
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          company: profile.company || '',
          phone: profile.phone || '',
          timezone: profile.timezone || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updates: UserProfileUpdate = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        timezone: formData.timezone
      };

      const result = await userProfileService.updateProfile(updates);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
        await loadUserProfile(); // Reload to get updated data
      } else {
        toast({
          title: "Error", 
          description: result.error || "Failed to update profile",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">Failed to load user profile</div>
        <Button onClick={loadUserProfile} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const limits = userProfileService.getPlanLimits();
  const withinLimits = userProfileService.isWithinLimits();

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>
            Your account information and current plan details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                {getInitials(userProfile.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{userProfile.name}</h3>
              <p className="text-gray-600">{userProfile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getPlanColor(userProfile.plan)}>
                  {userProfile.plan.toUpperCase()}
                </Badge>
                <Badge variant={userProfile.subscription_status === 'active' ? 'default' : 'secondary'}>
                  {userProfile.subscription_status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Usage Statistics */}
          <div>
            <h4 className="font-medium mb-4">Usage Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userProfile.usage_stats.qr_codes_created}</div>
                <div className="text-sm text-gray-600">QR Codes Created</div>
                {limits.qr_codes !== -1 && (
                  <div className="text-xs text-gray-500">/ {limits.qr_codes} limit</div>
                )}
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{userProfile.usage_stats.campaigns_created}</div>
                <div className="text-sm text-gray-600">Campaigns</div>
                {limits.campaigns !== -1 && (
                  <div className="text-xs text-gray-500">/ {limits.campaigns} limit</div>
                )}
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{userProfile.usage_stats.total_scans.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Scans</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{formatBytes(userProfile.usage_stats.storage_used)}</div>
                <div className="text-sm text-gray-600">Storage Used</div>
                {limits.storage !== -1 && (
                  <div className="text-xs text-gray-500">/ {formatBytes(limits.storage)} limit</div>
                )}
              </div>
            </div>

            {/* Storage Progress */}
            {limits.storage !== -1 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Storage Usage</span>
                  <span>{Math.round((userProfile.usage_stats.storage_used / limits.storage) * 100)}%</span>
                </div>
                <Progress 
                  value={(userProfile.usage_stats.storage_used / limits.storage) * 100}
                  className={`h-2 ${!withinLimits.storage ? 'bg-red-200' : ''}`}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                {getInitials(formData.name)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Change Photo
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Enter your company"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Timezone
              </Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                placeholder="e.g., America/New_York"
              />
            </div>
          </div>

          <Button 
            onClick={handleSaveProfile} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Important account details and timestamps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Account Created:</span>
              <span className="ml-2 font-medium">{userProfile.created_at.toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 font-medium">{userProfile.updated_at.toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Last Login:</span>
              <span className="ml-2 font-medium">
                {userProfile.last_login_at ? userProfile.last_login_at.toLocaleDateString() : 'Never'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">User ID:</span>
              <span className="ml-2 font-mono text-xs">{userProfile.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
