import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useSupabaseAuth';
import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Main app pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import CreateQRCode from '@/pages/CreateQRCode';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import CampaignCreator from '@/pages/CampaignCreator';
import TemplateManager from '@/pages/TemplateManager';
import DataManager from '@/pages/DataManager';
import Support from '@/pages/Support';

// Admin pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminRegister from '@/pages/admin/AdminRegister';
import AdminDashboard from '@/pages/admin/AdminDashboard';

// Company pages
import About from '@/pages/company/About';
import Contact from '@/pages/company/Contact';
import Privacy from '@/pages/company/Privacy';
import Terms from '@/pages/company/Terms';

// Solution pages
import Marketing from '@/pages/solutions/Marketing';
import Restaurants from '@/pages/solutions/Restaurants';
import Events from '@/pages/solutions/Events';
import Healthcare from '@/pages/solutions/Healthcare';
import Retail from '@/pages/solutions/Retail';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Main application routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected main app routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create" 
                element={
                  <ProtectedRoute>
                    <CreateQRCode />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/campaigns" 
                element={
                  <ProtectedRoute>
                    <CampaignCreator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/templates" 
                element={
                  <ProtectedRoute>
                    <TemplateManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/data" 
                element={
                  <ProtectedRoute>
                    <DataManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/support" 
                element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                } 
              />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Company pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Solution pages */}
              <Route path="/solutions/marketing" element={<Marketing />} />
              <Route path="/solutions/restaurants" element={<Restaurants />} />
              <Route path="/solutions/events" element={<Events />} />
              <Route path="/solutions/healthcare" element={<Healthcare />} />
              <Route path="/solutions/retail" element={<Retail />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
