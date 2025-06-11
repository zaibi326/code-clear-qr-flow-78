
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { adminUser, isLoading } = useAdminAuth();
  const location = useLocation();

  console.log('AdminProtectedRoute: adminUser =', adminUser?.email, 'loading =', isLoading, 'path =', location.pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin session...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    console.log('AdminProtectedRoute: No admin user found, redirecting to admin login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('AdminProtectedRoute: Admin user authenticated, rendering protected content');
  return <>{children}</>;
};
