import { NavLink, Link } from 'react-router-dom';
import { Home, PlusCircle, FolderOpen, ShoppingBag, Settings } from 'lucide-react';

import logo from '../../assets/brand/grafiplot-logo.webp';

export function Sidebar({ isOpen, closeSidebar, profile }) {
  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard' },
    { icon: PlusCircle, label: 'Nuevo Pedido', path: '/dashboard/nuevo-pedido' },
    { icon: FolderOpen, label: 'Mis Trabajos', path: '/dashboard/historial' },
    { icon: ShoppingBag, label: 'Catálogo', path: '/dashboard/catalogo' },
  ];

  const adminItems = [
    { icon: Settings, label: 'Administración', path: '/admin' },
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
        w-64 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <Link to="/" className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-center hover:opacity-80 transition-all group">
          <img src={logo} alt="Grafiplot" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
        </Link>

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
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-gray-100'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {profile?.role === 'admin' && (
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
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-gray-100'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <div className="bg-gradient-to-br from-brand-red to-orange-600 rounded-2xl p-5 text-white shadow-lg shadow-brand-red/20 border border-white/10">
            <h4 className="font-black text-sm mb-1 italic tracking-tighter">Grafiplot PRO</h4>
            <p className="text-[11px] opacity-90 mb-4 font-medium">Accede a descuentos por volumen</p>
            <button className="text-[11px] font-black uppercase tracking-widest bg-white text-brand-red hover:bg-slate-100 transition-all py-2.5 px-3 rounded-xl w-full shadow-sm">
              Ver planes
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
