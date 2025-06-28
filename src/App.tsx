
import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

console.log('App: Módulo App carregado, React:', typeof React);

// Lazy load das páginas
const Home = lazy(() => {
  console.log('App: Carregando componente Home');
  return import("./pages/Home");
});
const Index = lazy(() => import("./pages/Index"));
const Agents = lazy(() => import("./pages/Agents"));
const AgentDetail = lazy(() => import("./pages/AgentDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AgentsManagement = lazy(() => import("./pages/admin/AgentsManagement"));

const queryClient = new QueryClient();

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  console.log('ProtectedRoute: Componente sendo renderizado');
  const { isAuthenticated, loading } = useAuth();

  console.log('ProtectedRoute: Estado de autenticação:', { isAuthenticated, loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nexus-gradient">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  console.log('AppRoutes: Componente sendo renderizado');
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Carregando...</p>
        </div>
      </div>
    }>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <div>
            {console.log('AppRoutes: Renderizando rota Home')}
            <Home />
          </div>
        } />

        {/* Legal Pages */}
        <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
        <Route path="/termos-de-uso" element={<TermsOfService />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/agentes" element={
          <ProtectedRoute>
            <AgentsManagement />
          </ProtectedRoute>
        } />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  console.log('App: Componente principal sendo renderizado');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
