import { useEffect, useState, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { CartProvider } from './lib/cartStore';
import { WhatsAppWidget } from './components/common/WhatsAppWidget';
import { GlobalGraphita } from './components/common/GlobalGraphita';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Lazy loading de componentes para mejorar el tiempo de carga inicial
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const NuevoPedido = lazy(() => import('./pages/NuevoPedido').then(m => ({ default: m.NuevoPedido })));
const Historial = lazy(() => import('./pages/Historial').then(m => ({ default: m.Historial })));
const LandingPage = lazy(() => import('./pages/public/LandingPage').then(m => ({ default: m.LandingPage })));
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
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

function ProtectedRoute({ session, children }) {
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoadingAuth(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }
      setSession(data.session);
      setLoadingAuth(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoadingAuth(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (loadingAuth) {
    return <PageLoader />;
  }

  return (
    <HashRouter>
      <ErrorBoundary>
        {/* Suspense envuelve las rutas para mostrar el loader mientras se descarga cada componente */}
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

            {/* Rutas Privadas (Dashboard) */}
            <Route
              path="/dashboard"
              element={(
                <ProtectedRoute session={session}>
                  <DashboardLayout />
                </ProtectedRoute>
              )}
            >
              <Route index element={<Home />} />
              <Route path="nuevo-pedido" element={<NuevoPedido />} />
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
      </ErrorBoundary>
      
      <WhatsAppWidget />
      <GlobalGraphita />
    </HashRouter>
  );
}

export default function AppWrapper() {
  return (
    <CartProvider>
      <App />
    </CartProvider>
  );
}
