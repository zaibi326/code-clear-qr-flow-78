
import React from 'react';
import { URLInputSection } from './URLInputSection';
import { QRNameSection } from './QRNameSection';
import { ColorSelectorSection } from './ColorSelectorSection';
import { LogoProjectSection } from './LogoProjectSection';
import { PersonalInfoSection } from './PersonalInfoSection';
import { AddressSection } from './AddressSection';
import { SaveSection } from './SaveSection';

interface SingleRecordFormProps {
  formData: any;
  logoFile: File | null;
  onInputChange: (field: string, value: string) => void;
  onLogoFileChange: (file: File) => void;
  onSave: () => void;
}

export function SingleRecordForm({ 
  formData, 
  logoFile, 
  onInputChange, 
  onLogoFileChange, 
  onSave 
}: SingleRecordFormProps) {
  // Check if this is a simple URL form (for quick generate mode)
  const isSimpleUrlForm = window.location.pathname === '/quick-generate';

  return (
    <div className="space-y-6">
      {/* Website URL */}
      <URLInputSection 
        url={formData.url}
        onChange={(url) => onInputChange('url', url)}
      />

      {/* QR Code Name */}
      <QRNameSection 
        qrName={formData.qrName}
        onChange={(name) => onInputChange('qrName', name)}
      />

      {/* Show additional fields only if NOT in simple URL form mode */}
      {!isSimpleUrlForm && (
        <>
          {/* Color Selection Row */}
          <ColorSelectorSection 
            foregroundColor={formData.foregroundColor}
            backgroundColor={formData.backgroundColor}
            onForegroundChange={(color) => onInputChange('foregroundColor', color)}
            onBackgroundChange={(color) => onInputChange('backgroundColor', color)}
          />

          {/* Enhanced Logo Upload and Project Selection */}
          <LogoProjectSection 
            logoFile={logoFile}
            logoUrl={formData.logoUrl}
            project={formData.project}
            onLogoFileChange={onLogoFileChange}
            onLogoUrlChange={(url) => onInputChange('logoUrl', url)}
            onProjectChange={(project) => onInputChange('project', project)}
          />

          {/* List Type and Name Fields */}
          <PersonalInfoSection 
            listType={formData.listType}
            firstName={formData.firstName}
            lastName={formData.lastName}
            onListTypeChange={(value) => onInputChange('listType', value)}
            onFirstNameChange={(value) => onInputChange('firstName', value)}
            onLastNameChange={(value) => onInputChange('lastName', value)}
          />

          {/* Address Sections */}
          <AddressSection 
            propertyAddress={formData.propertyAddress}
            propertyState={formData.propertyState}
            propertyCity={formData.propertyCity}
            propertyZip={formData.propertyZip}
            mailingAddress={formData.mailingAddress}
            mailingState={formData.mailingState}
            mailingCity={formData.mailingCity}
            mailingZip={formData.mailingZip}
            onPropertyAddressChange={(value) => onInputChange('propertyAddress', value)}
            onPropertyStateChange={(value) => onInputChange('propertyState', value)}
            onPropertyCityChange={(value) => onInputChange('propertyCity', value)}
            onPropertyZipChange={(value) => onInputChange('propertyZip', value)}
            onMailingAddressChange={(value) => onInputChange('mailingAddress', value)}
            onMailingStateChange={(value) => onInputChange('mailingState', value)}
            onMailingCityChange={(value) => onInputChange('mailingCity', value)}
            onMailingZipChange={(value) => onInputChange('mailingZip', value)}
          />
        </>
      )}

      {/* Save Button */}
      <SaveSection 
        onSave={onSave}
        disabled={!formData.url || !formData.qrName}
      />
    </div>
  );
}
