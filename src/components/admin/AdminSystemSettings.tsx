
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: 'QR Code Generator',
    siteDescription: 'Professional QR code generation platform',
    maxQRCodesFree: 10,
    maxQRCodesPro: 1000,
    maxQRCodesEnterprise: -1,
    emailNotifications: true,
    maintenanceMode: false,
    registrationEnabled: true,
    defaultPlan: 'free',
    sessionTimeout: 24,
    maxFileSize: 10,
    allowedFileTypes: 'jpg,png,pdf,svg'
  });

  const handleSave = () => {
    // Here you would typically save to your backend
    toast({
      title: "Settings saved",
      description: "System settings have been updated successfully.",
    });
  };

  const handleReset = () => {
    // Reset to default values
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultPlan">Default User Plan</Label>
                  <Select value={settings.defaultPlan} onValueChange={(value) => setSettings({...settings, defaultPlan: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>User Registration</Label>
                  <p className="text-sm text-gray-500">Allow new users to register</p>
                </div>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, registrationEnabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
                <div className="space-y-0.5">
                  <Label className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-red-600">Temporarily disable the application</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan Limits</CardTitle>
              <CardDescription>
                Configure QR code limits for each subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFree">Free Plan Limit</Label>
                  <Input
                    id="maxFree"
                    type="number"
                    value={settings.maxQRCodesFree}
                    onChange={(e) => setSettings({...settings, maxQRCodesFree: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxPro">Pro Plan Limit</Label>
                  <Input
                    id="maxPro"
                    type="number"
                    value={settings.maxQRCodesPro}
                    onChange={(e) => setSettings({...settings, maxQRCodesPro: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxEnterprise">Enterprise Plan Limit</Label>
                  <Input
                    id="maxEnterprise"
                    type="number"
                    value={settings.maxQRCodesEnterprise}
                    onChange={(e) => setSettings({...settings, maxQRCodesEnterprise: parseInt(e.target.value)})}
                    placeholder="-1 for unlimited"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allowedTypes">Allowed File Types</Label>
                  <Input
                    id="allowedTypes"
                    value={settings.allowedFileTypes}
                    onChange={(e) => setSettings({...settings, allowedFileTypes: e.target.value})}
                    placeholder="jpg,png,pdf,svg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system-wide notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Send email notifications to users</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and session management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSystemSettings;
