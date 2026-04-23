import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, UserPlus, Home, Briefcase, Phone, LogOut, ChevronDown } from 'lucide-react';
import logo from '../../assets/brand/grafiplot-logo.webp';
import { supabase } from '../../lib/supabaseClient';

export function PublicNavbar({ onNavigateSection, profile }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', id: 'inicio', icon: Home },
    { name: 'Servicios', id: 'servicios', icon: Briefcase },
    { name: 'Contacto', id: 'contacto', icon: Phone },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      {/* Brand Accent Line */}
      <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-red via-brand-red to-brand-yellow transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 md:opacity-100'}`} />
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigateSection('inicio')}>
          <div className="h-10 md:h-12 flex items-center justify-center">
            <img src={logo} alt="Grafiplot Logo" className="h-full w-auto object-contain" />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigateSection(link.id)}
                className="text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-brand-red dark:hover:text-white transition-colors tracking-[0.2em] uppercase"
              >
                {link.name}
              </button>
            ))}
          </div>
          
          <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-2" />
          
          <div className="flex items-center gap-3">
            {profile ? (
              <div className="relative group">
                <button
                  className="flex items-center gap-2 text-[10px] font-black text-white bg-slate-900 dark:bg-brand-yellow dark:text-slate-900 px-5 py-2.5 rounded-xl hover:scale-105 transition-all shadow-md shadow-slate-200 dark:shadow-brand-yellow/10 tracking-[0.1em] uppercase"
                >
                  <div className="w-4 h-4 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[10px] text-slate-900 dark:text-brand-yellow font-black">
                    {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {profile.full_name?.split(' ')[0] || 'Mi Cuenta'}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <div className="p-2 space-y-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors uppercase tracking-wider"
                    >
                      <Home className="w-4 h-4" />
                      Ir al Dashboard
                    </Link>
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.reload();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors uppercase tracking-wider"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-[10px] font-black text-slate-900 dark:text-white hover:text-brand-red dark:hover:text-brand-yellow transition-colors tracking-[0.1em] uppercase"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 text-[10px] font-black text-white bg-slate-900 dark:bg-brand-yellow dark:text-slate-900 px-5 py-2.5 rounded-xl hover:scale-105 transition-all shadow-md shadow-slate-200 dark:shadow-brand-yellow/10 tracking-[0.1em] uppercase"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Crear Cuenta
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-900 dark:text-white p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-white dark:bg-slate-950 flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                <div className="h-8 flex items-center justify-center">
                  <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
                </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 gap-10">
              {navLinks.map((link, idx) => (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={link.id}
                  onClick={() => {
                    onNavigateSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-6 text-3xl font-black text-slate-900 dark:text-white tracking-tighter text-left uppercase"
                >
                  <link.icon className="w-8 h-8 text-brand-red dark:text-brand-yellow" />
                  {link.name}
                </motion.button>
              ))}
            </div>

            <div className="p-8 space-y-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10">
              {profile ? (
                <>
                  <Link
                    to="/dashboard"
                    className="w-full py-4 bg-brand-yellow text-slate-900 rounded-2xl font-black tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-brand-yellow/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home size={20} /> IR AL DASHBOARD
                  </Link>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.reload();
                    }}
                    className="w-full py-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-black tracking-widest text-sm flex items-center justify-center gap-3"
                  >
                    <LogOut size={20} /> CERRAR SESIÓN
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black tracking-widest text-sm flex items-center justify-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn size={20} /> INGRESAR
                  </Link>
                  <Link
                    to="/register"
                    className="w-full py-5 bg-brand-yellow text-slate-900 rounded-2xl font-black tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-brand-yellow/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlus size={20} /> CREAR CUENTA
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
