import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('grafiplot_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('grafiplot_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 md:max-w-md mx-auto md:bottom-6 md:left-6 md:right-auto pointer-events-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-5 relative overflow-hidden">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-start gap-4 pr-6">
          <div className="w-10 h-10 bg-brand-red/10 dark:bg-brand-red/20 rounded-full flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-brand-red" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Privacidad y Cookies
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Usamos cookies y tokens de sesión para mantenerte conectado y mejorar tu experiencia. Al usar nuestra web, aceptas nuestras <Link to="/terminos" className="text-brand-red hover:underline">Políticas de Privacidad</Link>.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={acceptCookies}
                className="px-4 py-2 bg-brand-red hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
