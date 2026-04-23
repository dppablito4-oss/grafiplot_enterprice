import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Home } from './pages/Home';
import { NuevoPedido } from './pages/NuevoPedido';
import { Historial } from './pages/Historial';

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nuevo-pedido" element={<NuevoPedido />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <h2 className="text-2xl font-bold mb-2">Próximamente</h2>
              <p className="text-gray-500">Esta sección está en desarrollo.</p>
            </div>
          } />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
