import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, UserPlus, Home, Briefcase, Phone } from 'lucide-react';
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
    { name: 'Inicio', id: 'inicio', icon: Home },
    { name: 'Servicios', id: 'servicios', icon: Briefcase },
    { name: 'Contacto', id: 'contacto', icon: Phone },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigateSection('inicio')}>
          <div className="w-9 h-9 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-lg shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform">
            <img src={logo} alt="Grafiplot Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter italic">GRAFIPLOT</span>
            <span className="text-[9px] font-bold text-brand-red tracking-[0.3em] uppercase">Vasquez</span>
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
               <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg p-1.5 border border-slate-100">
                  <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-white italic">GRAFIPLOT</span>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
