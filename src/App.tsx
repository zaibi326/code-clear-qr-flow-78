
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { RouteConfig } from "@/components/routing/RouteConfig";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  // Don't show footer on dashboard and related pages
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/analytics') ||
                          location.pathname.startsWith('/create') ||
                          location.pathname.startsWith('/qr-codes') ||
                          location.pathname.startsWith('/templates') ||
                          location.pathname.startsWith('/data') ||
                          location.pathname.startsWith('/projects') ||
                          location.pathname.startsWith('/campaigns') ||
                          location.pathname.startsWith('/monitoring') ||
                          location.pathname.startsWith('/settings') ||
                          location.pathname === '/support';
  
  return (
    <>
      <RouteConfig />
      {!isDashboardRoute && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
