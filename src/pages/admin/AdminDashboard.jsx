import React, { useState } from 'react';
import { Users, Mail, Settings, ShieldAlert, LogOut, HardDrive } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { SmtpSettings } from './components/SmtpSettings';
import { UsersList } from './components/UsersList';
import { StorageManager } from './components/StorageManager';
import { PedidosAdmin } from './components/PedidosAdmin';
import { FileText } from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pedidos');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#111827] flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-white dark:bg-[#1a1a1a] border-r border-slate-200 dark:border-white/5 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Panel Admin</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Acceso Restringido</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'pedidos' 
                ? 'bg-brand-red text-white shadow-md shadow-brand-red/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <FileText className="w-5 h-5" />
            Pedidos Recientes
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'users' 
                ? 'bg-brand-red text-white shadow-md shadow-brand-red/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Users className="w-5 h-5" />
            Usuarios y Gas
          </button>
          
          <button
            onClick={() => setActiveTab('storage')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'storage' 
                ? 'bg-brand-red text-white shadow-md shadow-brand-red/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <HardDrive className="w-5 h-5" />
            Almacenamiento
          </button>

          <button
            onClick={() => setActiveTab('smtp')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'smtp' 
                ? 'bg-brand-red text-white shadow-md shadow-brand-red/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Mail className="w-5 h-5" />
            Sistema SMTP
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'settings' 
                ? 'bg-brand-red text-white shadow-md shadow-brand-red/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Settings className="w-5 h-5" />
            Ajustes Generales
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Salir del Panel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === 'pedidos' && <PedidosAdmin />}
        {activeTab === 'users' && <UsersList />}
        {activeTab === 'storage' && <StorageManager />}
        {activeTab === 'smtp' && <SmtpSettings />}
        {activeTab === 'settings' && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Settings className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-bold uppercase tracking-wider">Ajustes en desarrollo</p>
          </div>
        )}
      </main>
    </div>
  );
}
