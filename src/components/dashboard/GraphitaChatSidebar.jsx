import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import graphitaLogo from '../../assets/graphita_ia.svg';

export function GraphitaChatSidebar({ isOpen, onClose, profile }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy Graphita. ¿En qué te ayudo con tus archivos o impresiones hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Llamada a la Edge Function de Supabase
      const { data, error } = await supabase.functions.invoke('graphita-chat', {
        body: { 
          message: userMsg,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          profile: profile
        }
      });

      if (error) throw error;
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error("Error chatting with Graphita:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Uy, creo que me desconecté un rato. ¿Puedes intentar de nuevo?' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay para móviles */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Panel Lateral */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-[320px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Cabecera */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-red/10 border border-brand-red/20 overflow-hidden flex-shrink-0">
                  <img src={graphitaLogo} alt="Graphita" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                    Graphita <Sparkles className="w-3 h-3 text-amber-500" />
                  </h3>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wider">Asistente Virtual</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 dark:bg-brand-red text-white rounded-br-none' 
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <Loader2 className="w-4 h-4 text-brand-red animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Pregúntame algo..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 rounded-xl text-sm transition-all outline-none"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-brand-red text-white disabled:opacity-50 disabled:bg-slate-300 transition-colors"
                >
                  <Send className="w-4 h-4 -ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
