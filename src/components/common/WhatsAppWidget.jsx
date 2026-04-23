import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import whatsappLogo from '../../assets/whatsapp/whatsapp-logo.webp';

export function WhatsAppWidget() {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = "https://wa.me/952628844?text=Hola%20ROY_VASQUES%2C%20quiero%20consultar%20un%20producto";

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-6 pointer-events-none">
      <AnimatePresence>
        {showBubble && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="glass-panel p-6 max-w-[300px] rounded-[2rem] pointer-events-auto relative shadow-2xl shadow-black/50"
          >
            <button 
              onClick={() => setShowBubble(false)}
              className="absolute -top-2 -right-2 w-7 h-7 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10"
            >
              <X className="w-3 h-3" />
            </button>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center border border-[#25D366]/30">
                   <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-sm font-black text-white tracking-tight">ROY VASQUEZ</p>
                  <p className="text-[10px] text-[#25D366] font-bold uppercase tracking-widest">En Línea</p>
                </div>
              </div>
              
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                Hola, bienvenido a <span className="font-bold text-white tracking-tight">GRAFIPLOT VASQUEZ</span>. ¿En qué podemos ayudarte con tus impresiones hoy?
              </p>

              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#25D366]/90 text-black text-xs font-black rounded-xl text-center transition-all tracking-widest uppercase"
              >
                Chatear Ahora
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
        className="w-16 h-16 rounded-[1.5rem] bg-[#25D366] shadow-[0_10px_30px_rgba(37,211,102,0.4)] flex items-center justify-center pointer-events-auto group overflow-hidden"
        aria-label="WhatsApp"
      >
        <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <img 
          src={whatsappLogo} 
          alt="WhatsApp" 
          className="w-8 h-8 relative z-10 brightness-0 invert" 
        />
      </motion.a>
    </div>
  );
}
