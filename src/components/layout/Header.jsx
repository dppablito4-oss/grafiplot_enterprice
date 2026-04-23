import { Bell, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabaseClient';

export function Header({ toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="lg:hidden p-2" onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center font-bold text-white">
            G
          </div>
          <span className="text-xl font-bold tracking-tight">GRAFIPLOT</span>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <Button variant="ghost" className="p-2 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-red rounded-full"></span>
        </Button>
        
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block mx-2"></div>

        <Button variant="ghost" className="p-2" onClick={handleLogout} title="Cerrar sesion">
          <LogOut className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">¡Hola, Roy!</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-brand-yellow flex items-center justify-center text-black font-semibold">
            R
          </div>
        </div>
      </div>
    </header>
  );
}
