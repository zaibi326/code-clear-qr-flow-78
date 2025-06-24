import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QRGenerator from "./pages/QRGenerator";
import Dashboard from "./pages/Dashboard";
import EnhancedDashboard from "./pages/EnhancedDashboard";

const Auth = lazy(() => import("./pages/Auth"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<QRGenerator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
          <Route
            path="/auth"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Auth />
              </Suspense>
            }
          />
          <Route
            path="/pricing"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Pricing />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="/blog"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Blog />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
