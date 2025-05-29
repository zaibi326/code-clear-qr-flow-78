
import React from 'react';
import { AuthProvider as SupabaseAuthProvider } from '@/hooks/useSupabaseAuth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SupabaseAuthProvider>
      {children}
    </SupabaseAuthProvider>
  );
};
