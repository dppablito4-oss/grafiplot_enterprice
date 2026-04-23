import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import logo from '../../assets/brand/grafiplot-logo.webp';

export function PublicNavbar({ onNavigateSection }) {
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
    { name: 'Inicio', id: 'inicio' },
    { name: 'Servicios', id: 'servicios' },
    { name: 'Contacto', id: 'contacto' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shadow-sm' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigateSection('inicio')}>
          <div className="w-10 h-10 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-lg shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform">
            <img src={logo} alt="Grafiplot Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic">GRAFIPLOT</span>
            <span className="text-[10px] font-bold text-brand-red tracking-[0.3em] uppercase">Vasquez</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
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
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-900 dark:text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 overflow-hidden"
          >
            <div className="px-4 py-10 flex flex-col gap-8 text-center">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigateSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter"
                >
                  {link.name}
                </button>
              ))}
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <Link
                  to="/login"
                  className="text-slate-900 dark:text-white font-black tracking-widest text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  INGRESAR
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-yellow text-slate-900 py-4 rounded-2xl font-black tracking-widest text-sm shadow-xl shadow-brand-yellow/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  CREAR CUENTA
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
