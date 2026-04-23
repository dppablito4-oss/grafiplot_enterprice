import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, FolderOpen, ShoppingBag, Settings } from 'lucide-react';

import logo from '../../assets/brand/grafiplot-logo.webp';

export function Sidebar({ isOpen, closeSidebar }) {
  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard' },
    { icon: PlusCircle, label: 'Nuevo Pedido', path: '/dashboard/nuevo-pedido' },
    { icon: FolderOpen, label: 'Mis Trabajos', path: '/dashboard/historial' },
    { icon: ShoppingBag, label: 'Catálogo', path: '/dashboard/catalogo' },
  ];

  const adminItems = [
    { icon: Settings, label: 'Administración', path: '/dashboard/admin' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-red flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
              GRAFIPLOT
            </h1>
            <p className="text-[10px] font-bold text-brand-red tracking-[0.2em] uppercase">
              VASQUEZ
            </p>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto">
          <div>
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Principal
            </p>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-brand-red/10 text-brand-red dark:bg-brand-red/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] hover:text-gray-900 dark:hover:text-gray-100'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div>
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Sistema
            </p>
            <nav className="space-y-1">
              {adminItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-brand-red/10 text-brand-red dark:bg-brand-red/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] hover:text-gray-900 dark:hover:text-gray-100'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-gradient-to-r from-brand-red to-orange-500 rounded-xl p-4 text-white">
            <h4 className="font-semibold text-sm mb-1">Grafiplot PRO</h4>
            <p className="text-xs opacity-90 mb-3">Accede a descuentos por volumen</p>
            <button className="text-xs font-semibold bg-white/20 hover:bg-white/30 transition-colors py-1.5 px-3 rounded w-full">
              Ver planes
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
