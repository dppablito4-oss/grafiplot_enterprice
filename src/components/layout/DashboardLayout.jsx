import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { GraphitaChatSidebar } from '../dashboard/GraphitaChatSidebar';
import graphitaLogo from '../../assets/graphita_ia.svg';

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [graphitaOpen, setGraphitaOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f9fafb] dark:bg-[#111827]">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>

      {/* Botón flotante para abrir Graphita */}
      {!graphitaOpen && (
        <button
          onClick={() => setGraphitaOpen(true)}
          className="fixed bottom-6 right-24 md:bottom-8 md:right-28 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-900 shadow-xl shadow-brand-red/20 flex items-center justify-center overflow-hidden border-2 border-white hover:scale-105 transition-transform group"
        >
          <div className="absolute inset-0 bg-brand-red/20 group-hover:bg-brand-red/40 transition-colors" />
          <img src={graphitaLogo} alt="Graphita" className="w-full h-full object-cover relative z-10" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        </button>
      )}

      {/* Panel de Chat de Graphita */}
      <GraphitaChatSidebar isOpen={graphitaOpen} onClose={() => setGraphitaOpen(false)} />
    </div>
  );
}
