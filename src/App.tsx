
import React from 'react';
import { AppProviders } from '@/components/providers/AppProviders';
import { RouteConfig } from '@/components/routing/RouteConfig';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AppProviders>
      <div className="min-h-screen">
        <RouteConfig />
      </div>
      <Toaster />
    </AppProviders>
  );
}

export default App;
