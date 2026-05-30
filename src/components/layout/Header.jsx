import { useState } from 'react';
import { Bell, LogOut, Menu } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabaseClient';
import logo from '../../assets/brand/grafiplot-logo.webp';

export function Header({ toggleSidebar, profile }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const displayName = profile?.full_name || 'Usuario';
  const role = profile?.role === 'admin' ? 'Administrador' : 'Cliente';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 transition-all">
      {/* Brand Accent Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-brand-red/50 via-brand-red to-brand-yellow/50" />
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="lg:hidden p-2 dark:text-slate-300" onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
        <Link to="/" className="lg:hidden hover:opacity-80 transition-opacity">
          <img src={logo} alt="Grafiplot" className="h-8 w-auto object-contain" />
        </Link>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <Button variant="ghost" className="p-2 relative dark:text-slate-300">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-red rounded-full"></span>
        </Button>
        
        <div className="h-6 w-px bg-gray-200 dark:bg-zinc-800 hidden sm:block mx-2"></div>

        <Button variant="ghost" className="p-2 dark:text-slate-300" onClick={handleLogout} title="Cerrar sesión" disabled={isLoggingOut}>
          {isLoggingOut ? <div className="w-5 h-5 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div> : <LogOut className="w-5 h-5" />}
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
