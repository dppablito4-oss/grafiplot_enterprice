import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
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
        isScrolled ? 'py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigateSection('inicio')}>
          <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center shadow-lg shadow-white/5">
            <img src={logo} alt="Grafiplot Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-black text-white tracking-tighter">GRAFIPLOT</span>
            <span className="text-[10px] font-bold text-brand-red tracking-[0.3em] uppercase">Vasquez</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigateSection(link.id)}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors tracking-widest uppercase"
            >
              {link.name}
            </button>
          ))}
          <div className="w-px h-4 bg-white/10 mx-2" />
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-white/10 px-6 py-2.5 rounded-full hover:bg-white/10 transition-all"
          >
            <User className="w-4 h-4" />
            PANEL
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-8 flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigateSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-lg font-bold text-slate-300"
                >
                  {link.name}
                </button>
              ))}
              <Link
                to="/login"
                className="bg-brand-red text-white py-4 rounded-2xl font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                INGRESAR AL PANEL
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
