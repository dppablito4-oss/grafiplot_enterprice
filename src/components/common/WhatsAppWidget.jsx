import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import whatsappLogo from '../../assets/whatsapp/whatsapp-logo.webp';

export function WhatsAppWidget() {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = "https://wa.me/952628844?text=Hola%20ROY_VASQUES%2C%20quiero%20consultar%20un%20producto";

  return (
    <div className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {showBubble && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-[260px] md:w-[280px] p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl pointer-events-auto relative shadow-2xl shadow-slate-300 dark:shadow-none border border-slate-100 dark:border-white/10"
          >
            <button 
              onClick={() => setShowBubble(false)}
              className="absolute top-3 right-3 w-6 h-6 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10"
            >
              <X className="w-3 h-3" />
            </button>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[0.8rem] bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20">
                   <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">ROY VASQUEZ</p>
                  <p className="text-[9px] text-[#25D366] font-black uppercase tracking-[0.2em]">Soporte Directo</p>
                </div>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed tracking-tight">
                Hola, bienvenido a <span className="text-slate-900 dark:text-white font-black italic">GRAFIPLOT</span>. ¿En qué podemos ayudarte con tus impresiones hoy?
              </p>

              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#25D366]/90 text-black text-[10px] font-black rounded-xl text-center transition-all tracking-[0.2em] uppercase shadow-md shadow-[#25D366]/20"
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
        className="w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] bg-[#25D366] shadow-[0_10px_20px_rgba(37,211,102,0.3)] flex items-center justify-center pointer-events-auto group relative overflow-hidden"
        aria-label="WhatsApp"
      >
        <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <img 
          src={whatsappLogo} 
          alt="WhatsApp" 
          className="w-6 h-6 md:w-7 md:h-7 relative z-10 brightness-0 invert" 
        />
      </motion.a>
    </div>
  );
}
