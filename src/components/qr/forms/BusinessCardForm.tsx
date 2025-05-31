
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building, Phone, Mail, Globe, MapPin } from 'lucide-react';

interface BusinessCardFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function BusinessCardForm({ formData, onInputChange }: BusinessCardFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Business Card</h3>
        <p className="text-gray-600 mb-6">
          Share contact details that your QR code should link to
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded bg-blue-100">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First name*
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                placeholder="First name"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last name*
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                placeholder="Last name"
                className="mt-1"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded bg-purple-100">
              <Building className="h-4 w-4 text-purple-600" />
            </div>
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company" className="text-sm font-medium text-gray-700">
              Company
            </Label>
            <Input
              id="company"
              type="text"
              value={formData.company || ''}
              onChange={(e) => onInputChange('company', e.target.value)}
              placeholder="Enter company"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="designation" className="text-sm font-medium text-gray-700">
              Designation
            </Label>
            <Input
              id="designation"
              type="text"
              value={formData.designation || ''}
              onChange={(e) => onInputChange('designation', e.target.value)}
              placeholder="Enter designation"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded bg-green-100">
              <Phone className="h-4 w-4 text-green-600" />
            </div>
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phoneWork" className="text-sm font-medium text-gray-700">
              Phone (work)
            </Label>
            <Input
              id="phoneWork"
              type="tel"
              value={formData.phoneWork || ''}
              onChange={(e) => onInputChange('phoneWork', e.target.value)}
              placeholder="Enter phone"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phoneHome" className="text-sm font-medium text-gray-700">
              Phone (home)
            </Label>
            <Input
              id="phoneHome"
              type="tel"
              value={formData.phoneHome || ''}
              onChange={(e) => onInputChange('phoneHome', e.target.value)}
              placeholder="Enter phone"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phoneMobile" className="text-sm font-medium text-gray-700">
              Phone (mobile)
            </Label>
            <Input
              id="phoneMobile"
              type="tel"
              value={formData.phoneMobile || ''}
              onChange={(e) => onInputChange('phoneMobile', e.target.value)}
              placeholder="Enter phone"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => onInputChange('email', e.target.value)}
              placeholder="Enter Email"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="website" className="text-sm font-medium text-gray-700">
              Website
            </Label>
            <Input
              id="website"
              type="url"
              value={formData.website || ''}
              onChange={(e) => onInputChange('website', e.target.value)}
              placeholder="Enter Website"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded bg-orange-100">
              <MapPin className="h-4 w-4 text-orange-600" />
            </div>
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="addressLine1" className="text-sm font-medium text-gray-700">
              Address line 1
            </Label>
            <Input
              id="addressLine1"
              type="text"
              value={formData.addressLine1 || ''}
              onChange={(e) => onInputChange('addressLine1', e.target.value)}
              placeholder="Enter Address line 1"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="addressLine2" className="text-sm font-medium text-gray-700">
              Address line 2
            </Label>
            <Input
              id="addressLine2"
              type="text"
              value={formData.addressLine2 || ''}
              onChange={(e) => onInputChange('addressLine2', e.target.value)}
              placeholder="Enter Address line 2"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City
              </Label>
              <Input
                id="city"
                type="text"
                value={formData.city || ''}
                onChange={(e) => onInputChange('city', e.target.value)}
                placeholder="Enter City"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                State
              </Label>
              <Input
                id="state"
                type="text"
                value={formData.state || ''}
                onChange={(e) => onInputChange('state', e.target.value)}
                placeholder="Enter State"
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                Country
              </Label>
              <Input
                id="country"
                type="text"
                value={formData.country || ''}
                onChange={(e) => onInputChange('country', e.target.value)}
                placeholder="Enter Country"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="zip" className="text-sm font-medium text-gray-700">
                Zip
              </Label>
              <Input
                id="zip"
                type="text"
                value={formData.zip || ''}
                onChange={(e) => onInputChange('zip', e.target.value)}
                placeholder="Enter Zip"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
