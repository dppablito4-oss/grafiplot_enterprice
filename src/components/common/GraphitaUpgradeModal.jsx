import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ShieldCheck } from 'lucide-react';
import graphitaLogo from '../../assets/graphita_ia.svg';
import { supabase } from '../../lib/supabaseClient';

export function GraphitaUpgradeModal({ isOpen, onClose, onUpgradeSuccess }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpgrade = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      // 1. Obtener sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No hay sesión activa.');
      }

      // 2. Actualizar el email en auth.users
      const { error: updateError } = await supabase.auth.updateUser({
        email: email,
      });

      if (updateError) throw updateError;

      // 3. Actualizar el perfil (email e is_verified)
      const { error: profileError } = await supabase.from('profiles')
        .update({ email: email })
        .eq('id', session.user.id);

      if (profileError) throw profileError;

      setMessage('¡Genial! Hemos enviado un enlace de confirmación a tu correo. Revísalo para activar tus beneficios mágicos.');
      if (onUpgradeSuccess) onUpgradeSuccess();
      
    } catch (err) {
      setError(err.message || 'Ocurrió un error al vincular el correo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 sm:px-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="bg-brand-red/5 p-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-lg p-3 mb-6 relative">
                <img src={graphitaLogo} alt="Graphita IA" className="w-full h-full object-contain drop-shadow-md animate-bounce" />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 italic tracking-tight">
                ¡Hola! Casi estamos listos...
              </h3>
              <p className="mt-3 text-sm text-slate-600 font-medium">
                Para que pueda guardar tus archivos de hasta 30MB y usar mis herramientas de edición, necesito que vincules tu correo principal. <span className="font-bold text-slate-900">¡Es solo un paso rápido para que tu cuenta esté 100% segura!</span>
              </p>
            </div>

            <div className="p-8">
              {message ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 text-sm font-medium text-center">
                  {message}
                </div>
              ) : (
                <form onSubmit={handleUpgrade} className="space-y-4">
                  <div>
                    <label htmlFor="upgrade-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Tu Correo Principal
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="upgrade-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red sm:text-sm bg-slate-50 transition-colors"
                        placeholder="ejemplo@gmail.com"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-brand-red/20 transition-all flex justify-center items-center gap-2"
                  >
                    {submitting ? 'Vinculando...' : 'Vincular y Desbloquear IA'}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-4">
                    Al vincular tu correo recibirás un enlace de confirmación.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
