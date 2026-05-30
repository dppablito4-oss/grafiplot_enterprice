import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './lib/cartStore';
import { ProfileProvider, useProfile } from './contexts/ProfileContext';
import { WhatsAppWidget } from './components/common/WhatsAppWidget';
import { GlobalGraphita } from './components/common/GlobalGraphita';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CookieBanner } from './components/common/CookieBanner';

// Lazy loading de componentes para mejorar el tiempo de carga inicial
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const NuevoPedido = lazy(() => import('./pages/NuevoPedido').then(m => ({ default: m.NuevoPedido })));
const Historial = lazy(() => import('./pages/Historial').then(m => ({ default: m.Historial })));
const LandingPage = lazy(() => import('./pages/public/LandingPage').then(m => ({ default: m.LandingPage })));
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const Register = lazy(() => import('./pages/auth/Register').then(m => ({ default: m.Register })));
const AdminRoute = lazy(() => import('./components/auth/AdminRoute').then(m => ({ default: m.AdminRoute })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ServiceDetail = lazy(() => import('./pages/public/ServiceDetail').then(m => ({ default: m.ServiceDetail })));
const TerminosYCondiciones = lazy(() => import('./pages/public/TerminosYCondiciones').then(m => ({ default: m.TerminosYCondiciones })));
const Verificado = lazy(() => import('./pages/auth/Verificado').then(m => ({ default: m.Verificado })));

// Componente de carga general mientras se descargan las rutas
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { session, loading } = useProfile();

  if (loading) return <PageLoader />;
  if (!session) return <Navigate to="/login" replace />;

  return children;
}

function AppRoutes() {
  const { session, loading } = useProfile();

  if (loading) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/servicios/:serviceId" element={<ServiceDetail />} />
        <Route path="/terminos" element={<TerminosYCondiciones />} />
        <Route path="/verificado" element={<Verificado />} />
        <Route
          path="/login"
          element={session ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={session ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route
          path="/forgot-password"
          element={session ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
        />

        {/* Rutas Públicas dentro del Layout del Dashboard */}
        <Route element={(
          <CartProvider>
            <DashboardLayout />
          </CartProvider>
        )}>
          <Route path="/cotizar" element={<NuevoPedido />} />
        </Route>

        {/* Rutas Privadas (Dashboard) — CartProvider solo aquí */}
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <CartProvider>
                <DashboardLayout />
              </CartProvider>
            </ProtectedRoute>
          )}
        >
          <Route index element={<Home />} />
          <Route path="historial" element={<Historial />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <h2 className="text-2xl font-bold mb-2">Próximamente</h2>
              <p className="text-gray-500">Esta sección está en desarrollo.</p>
            </div>
          } />
        </Route>

        {/* Ruta Privada: Panel de Administración */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Catch-all para redirigir a inicio si no existe la ruta */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
      
      <WhatsAppWidget />
      <GlobalGraphita />
      <CookieBanner />
    </HashRouter>
  );
}

export default function AppWrapper() {
  return (
    <ProfileProvider>
      <App />
    </ProfileProvider>
  );
}
