import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, Trash2, Image, Palette, Settings, X, Check } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface RestaurantMenuFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function RestaurantMenuForm({ formData, onInputChange }: RestaurantMenuFormProps) {
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([{ name: '', description: '', price: '' }]);
  const [logoPreview, setLogoPreview] = useState<string | null>(formData.logoUrl || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(formData.coverImage || null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: '', description: '', price: '' }]);
  };

  const removeMenuItem = (index: number) => {
    const updatedItems = menuItems.filter((_, i) => i !== index);
    setMenuItems(updatedItems);
  };

  const updateMenuItem = (index: number, field: string, value: string) => {
    const updatedItems = [...menuItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setMenuItems(updatedItems);
    onInputChange('menuItems', JSON.stringify(updatedItems));
  };

  const handleFileUpload = useCallback(async (file: File, type: 'logo' | 'cover') => {
    const setUploading = type === 'logo' ? setUploadingLogo : setUploadingCover;
    const setPreview = type === 'logo' ? setLogoPreview : setCoverPreview;
    const fieldName = type === 'logo' ? 'logoUrl' : 'coverImage';

    setUploading(true);
    
    try {
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // In a real implementation, you would upload the file to your storage service
      // For now, we'll simulate an upload and use the preview URL
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
      
      // Update the form data with the file URL
      onInputChange(fieldName, previewUrl);
      
      console.log(`${type} uploaded successfully:`, file.name);
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [onInputChange]);

  const logoDropzone = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0], 'logo');
      }
    }
  });

  const coverDropzone = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0], 'cover');
      }
    }
  });

  const removeLogo = () => {
    setLogoPreview(null);
    onInputChange('logoUrl', '');
  };

  const removeCover = () => {
    setCoverPreview(null);
    onInputChange('coverImage', '');
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Menu
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Menu Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="menuUrl">Menu URL *</Label>
                <Input
                  id="menuUrl"
                  type="url"
                  placeholder="https://yourmenu.com or PDF link"
                  value={formData.menuUrl || ''}
                  onChange={(e) => onInputChange('menuUrl', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the URL to your digital menu, menu PDF, or menu page
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="restaurantName">Restaurant Name *</Label>
                  <Input
                    id="restaurantName"
                    placeholder="Your Restaurant Name"
                    value={formData.restaurantName || ''}
                    onChange={(e) => onInputChange('restaurantName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cuisine">Cuisine Type</Label>
                  <Select onValueChange={(value) => onInputChange('cuisine', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Restaurant Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your restaurant"
                  value={formData.description || ''}
                  onChange={(e) => onInputChange('description', e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Featured Menu Items</Label>
                  <Button onClick={addMenuItem} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                {menuItems.map((item, index) => (
                  <Card key={index} className="mb-3">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <Input
                            placeholder="Item name"
                            value={item.name}
                            onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                          />
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateMenuItem(index, 'description', e.target.value)}
                          />
                          <Input
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => updateMenuItem(index, 'price', e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={() => removeMenuItem(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Restaurant Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Restaurant Logo Upload */}
              <div>
                <Label>Restaurant Logo</Label>
                <div className="space-y-3">
                  {logoPreview ? (
                    <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        onClick={removeLogo}
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      {...logoDropzone.getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        logoDropzone.isDragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input {...logoDropzone.getInputProps()} />
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-1">
                        {uploadingLogo ? 'Uploading...' : 'Drag logo here or click to upload'}
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">or</span>
                    <Input
                      type="url"
                      placeholder="https://example.com/logo.jpg"
                      value={formData.logoUrl || ''}
                      onChange={(e) => {
                        onInputChange('logoUrl', e.target.value);
                        setLogoPreview(e.target.value);
                      }}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor || '#3B82F6'}
                      onChange={(e) => onInputChange('primaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      placeholder="#3B82F6"
                      value={formData.primaryColor || ''}
                      onChange={(e) => onInputChange('primaryColor', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor || '#6B7280'}
                      onChange={(e) => onInputChange('secondaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      placeholder="#6B7280"
                      value={formData.secondaryColor || ''}
                      onChange={(e) => onInputChange('secondaryColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <Label>Cover Image</Label>
                <div className="space-y-3">
                  {coverPreview ? (
                    <div className="relative w-full h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={coverPreview} 
                        alt="Cover preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        onClick={removeCover}
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      {...coverDropzone.getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        coverDropzone.isDragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input {...coverDropzone.getInputProps()} />
                      <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-1">
                        {uploadingCover ? 'Uploading...' : 'Drag cover image here or click to upload'}
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">or</span>
                    <Input
                      type="url"
                      placeholder="https://example.com/cover.jpg"
                      value={formData.coverImage || ''}
                      onChange={(e) => {
                        onInputChange('coverImage', e.target.value);
                        setCoverPreview(e.target.value);
                      }}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone || ''}
                    onChange={(e) => onInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="info@restaurant.com"
                    value={formData.email || ''}
                    onChange={(e) => onInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Restaurant Address</Label>
                <Textarea
                  id="address"
                  placeholder="123 Main St, City, State, ZIP"
                  value={formData.address || ''}
                  onChange={(e) => onInputChange('address', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Menu Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showPrices">Show Prices</Label>
                    <p className="text-sm text-gray-500">Display item prices on the menu</p>
                  </div>
                  <Switch
                    id="showPrices"
                    checked={formData.showPrices !== false}
                    onCheckedChange={(checked) => onInputChange('showPrices', checked.toString())}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableOrdering">Enable Online Ordering</Label>
                    <p className="text-sm text-gray-500">Allow customers to place orders</p>
                  </div>
                  <Switch
                    id="enableOrdering"
                    checked={formData.enableOrdering === 'true'}
                    onCheckedChange={(checked) => onInputChange('enableOrdering', checked.toString())}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showNutrition">Show Nutritional Information</Label>
                    <p className="text-sm text-gray-500">Display calories and dietary info</p>
                  </div>
                  <Switch
                    id="showNutrition"
                    checked={formData.showNutrition === 'true'}
                    onCheckedChange={(checked) => onInputChange('showNutrition', checked.toString())}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="multiLanguage">Multi-language Support</Label>
                    <p className="text-sm text-gray-500">Enable multiple language options</p>
                  </div>
                  <Switch
                    id="multiLanguage"
                    checked={formData.multiLanguage === 'true'}
                    onCheckedChange={(checked) => onInputChange('multiLanguage', checked.toString())}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="menuLayout">Menu Layout Style</Label>
                <Select onValueChange={(value) => onInputChange('menuLayout', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid Layout</SelectItem>
                    <SelectItem value="list">List Layout</SelectItem>
                    <SelectItem value="card">Card Layout</SelectItem>
                    <SelectItem value="classic">Classic Layout</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Textarea
                  id="operatingHours"
                  placeholder="Mon-Fri: 9:00 AM - 10:00 PM&#10;Sat-Sun: 10:00 AM - 11:00 PM"
                  value={formData.operatingHours || ''}
                  onChange={(e) => onInputChange('operatingHours', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special notes or instructions for customers"
                  value={formData.specialInstructions || ''}
                  onChange={(e) => onInputChange('specialInstructions', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
