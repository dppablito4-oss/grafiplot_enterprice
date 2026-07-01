import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import whatsappLogo from '../../assets/whatsapp/whatsapp-logo.webp';

export function WhatsAppWidget() {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = "https://wa.me/51952628844?text=Hola%20ROY_VASQUES%2C%20quiero%20consultar%20un%20producto";

  return (
    <div className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-30 flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {showBubble && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-[220px] p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 pointer-events-auto relative"
          >
            <button 
              onClick={() => setShowBubble(false)}
              className="absolute top-3 right-3 w-6 h-6 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10"
            >
              <X className="w-3 h-3" />
            </button>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                   <img src={whatsappLogo} alt="WhatsApp" className="w-5 h-5 object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">GRAFIPLOT Soporte</p>
                </div>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ¡Hola! ¿En qué podemos ayudarte hoy?
              </p>

              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-[#25D366] hover:bg-[#1da851] text-white text-[11px] font-bold rounded-lg text-center transition-colors"
              >
                Iniciar Chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 pointer-events-auto drop-shadow-xl hover:scale-105 transition-transform"
        aria-label="WhatsApp"
      >
        <img 
          src={whatsappLogo} 
          alt="WhatsApp" 
          className="w-full h-full object-contain" 
        />
      </motion.a>
    </div>
  );
}
