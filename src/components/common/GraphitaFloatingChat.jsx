import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import graphitaLogo from '../../assets/graphita_ia.svg';

export function GraphitaFloatingChat({ message }) {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Auto abrir el chat después de un pequeño retraso
    const timer = setTimeout(() => setIsOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 left-4 md:bottom-8 md:left-8 z-[100] flex flex-col items-start pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-[280px] p-5 mb-4 rounded-3xl rounded-br-sm bg-white dark:bg-slate-900 shadow-2xl shadow-brand-red/10 border border-slate-100 dark:border-white/10 pointer-events-auto relative"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-red/10 border border-brand-red/20 overflow-hidden flex-shrink-0">
                <img src={graphitaLogo} alt="Graphita" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Graphita</span>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  {message || "¡Hola! Estoy aquí para ayudarte."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-900 shadow-xl shadow-brand-red/20 flex items-center justify-center pointer-events-auto overflow-hidden border-2 border-white dark:border-slate-800 relative group"
      >
        <div className="absolute inset-0 bg-brand-red/20 group-hover:bg-brand-red/40 transition-colors" />
        <img src={graphitaLogo} alt="Graphita" className="w-full h-full object-cover relative z-10" />
      </motion.button>
    </div>
  );
}
