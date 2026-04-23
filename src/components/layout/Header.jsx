import { Bell, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabaseClient';

export function Header({ toggleSidebar, profile }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate('/login', { replace: true });
  };

  const displayName = profile?.full_name || 'Usuario';
  const role = profile?.role === 'admin' ? 'Administrador' : 'Cliente';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 transition-colors">
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="lg:hidden p-2 dark:text-slate-300" onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center font-bold text-white">
            G
          </div>
          <span className="text-xl font-black tracking-tighter italic dark:text-white">GRAFIPLOT</span>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <Button variant="ghost" className="p-2 relative dark:text-slate-300">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-red rounded-full"></span>
        </Button>
        
        <div className="h-6 w-px bg-gray-200 dark:bg-zinc-800 hidden sm:block mx-2"></div>

        <Button variant="ghost" className="p-2 dark:text-slate-300" onClick={handleLogout} title="Cerrar sesion">
          <LogOut className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-3 ml-2">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold dark:text-white leading-none mb-1">¡Hola, {displayName}!</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-black tracking-wider">{role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-brand-yellow flex items-center justify-center text-black font-black text-sm shadow-sm border border-brand-yellow/20">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}
