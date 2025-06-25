
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface SidebarFooterProps {
  collapsed: boolean;
}

export const SidebarFooter = React.memo(({ collapsed }: SidebarFooterProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = React.useCallback(async () => {
    await signOut();
    navigate("/auth");
  }, [signOut, navigate]);

  return (
    <div className="border-t p-3">
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
      >
        {collapsed ? "↗" : "Sign Out"}
      </button>
    </div>
  );
});

SidebarFooter.displayName = 'SidebarFooter';
