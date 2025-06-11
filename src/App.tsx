
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProviders } from "@/components/providers/AppProviders";
import { RouteConfig } from "@/components/routing/RouteConfig";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";

const AppContent = () => {
  const location = useLocation();
  // Don't show footer on dashboard and related pages
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/analytics') ||
                          location.pathname.startsWith('/create') ||
                          location.pathname.startsWith('/qr-codes') ||
                          location.pathname.startsWith('/templates') ||
                          location.pathname.startsWith('/template-manager') ||
                          location.pathname.startsWith('/data') ||
                          location.pathname.startsWith('/projects') ||
                          location.pathname.startsWith('/campaigns') ||
                          location.pathname.startsWith('/campaign-creator') ||
                          location.pathname.startsWith('/monitoring') ||
                          location.pathname.startsWith('/settings') ||
                          location.pathname.startsWith('/admin') ||
                          location.pathname === '/support' ||
                          location.pathname === '/quick-generate' ||
                          location.pathname === '/data-manager';
  
  return (
    <>
      <RouteConfig />
      {!isDashboardRoute && <Footer />}
    </>
  );
};

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AppProviders>
      <AppContent />
    </AppProviders>
  </TooltipProvider>
);

export default App;
