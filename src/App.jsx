import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Home } from './pages/Home';
import { NuevoPedido } from './pages/NuevoPedido';
import { Historial } from './pages/Historial';
import { LandingPage } from './pages/public/LandingPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { hasSupabaseEnv, supabase } from './lib/supabaseClient';
import { CartProvider } from './lib/cartStore';

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-600">Cargando sesion...</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={session ? <Navigate to="/dashboard" replace /> : <Login hasSupabaseEnv={hasSupabaseEnv} />}
        />
        <Route
          path="/register"
          element={session ? <Navigate to="/dashboard" replace /> : <Register hasSupabaseEnv={hasSupabaseEnv} />}
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

        {/* Catch-all para redirigir a inicio si no existe la ruta */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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
