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
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-6 pointer-events-none">
      <AnimatePresence>
        {showBubble && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-[320px] p-8 rounded-[2.5rem] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl pointer-events-auto relative shadow-2xl shadow-slate-300 dark:shadow-none border border-slate-100 dark:border-white/10"
          >
            <button 
              onClick={() => setShowBubble(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20">
                   <MessageCircle className="w-6 h-6 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-base font-black text-slate-900 dark:text-white tracking-tighter">ROY VASQUEZ</p>
                  <p className="text-[10px] text-[#25D366] font-black uppercase tracking-[0.2em]">Soporte Directo</p>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed tracking-tight">
                Hola, bienvenido a <span className="text-slate-900 dark:text-white font-black italic">GRAFIPLOT</span>. ¿En qué podemos ayudarte con tus impresiones hoy?
              </p>

              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#25D366] hover:bg-[#25D366]/90 text-black text-xs font-black rounded-2xl text-center transition-all tracking-[0.2em] uppercase shadow-lg shadow-[#25D366]/20"
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
        className="w-20 h-20 rounded-[2rem] bg-[#25D366] shadow-[0_15px_40px_rgba(37,211,102,0.3)] flex items-center justify-center pointer-events-auto group relative overflow-hidden"
        aria-label="WhatsApp"
      >
        <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <img 
          src={whatsappLogo} 
          alt="WhatsApp" 
          className="w-9 h-9 relative z-10 brightness-0 invert" 
        />
      </motion.a>
    </div>
  );
}
