
import React from 'react';
import { TemplateManagerLayout } from './TemplateManagerLayout';

export const LoadingScreen = () => {
  return (
    <TemplateManagerLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading templates...</div>
      </div>
    </TemplateManagerLayout>
  );
};
