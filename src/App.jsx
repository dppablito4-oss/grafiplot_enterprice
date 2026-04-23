import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Home } from './pages/Home';
import { NuevoPedido } from './pages/NuevoPedido';
import { Historial } from './pages/Historial';
import { LandingPage } from './pages/public/LandingPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Privadas (Dashboard) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
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

export default App;
