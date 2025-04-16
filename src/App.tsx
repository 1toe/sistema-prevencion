
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/types";

// Pages
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Only Routes - to be expanded later */}
            <Route 
              path="/professionals"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <div>Profesionales (Próximamente)</div>
                </ProtectedRoute>
              }
            />
            
            <Route 
              path="/medical-records"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.PROFESSIONAL]}>
                  <div>Ficha Clínica (Próximamente)</div>
                </ProtectedRoute>
              }
            />
            
            <Route 
              path="/inventory"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
                  <div>Inventario (Próximamente)</div>
                </ProtectedRoute>
              }
            />
            
            <Route 
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <div>Configuración (Próximamente)</div>
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect to dashboard if logged in, otherwise to login */}
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
