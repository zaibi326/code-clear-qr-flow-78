
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useSupabaseAuth';
import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import { queryClient } from '@/config/QueryClientConfig';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AdminAuthProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
