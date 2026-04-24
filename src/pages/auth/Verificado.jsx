import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export function Verificado() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Redirigir automáticamente después de 5 segundos
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-brand-red/5 max-w-md w-full text-center border border-slate-100 dark:border-white/5"
      >
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
          ¡Verificación Exitosa!
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">
          Tu correo electrónico ha sido confirmado correctamente. Ya puedes acceder a todas las funciones y herramientas de Grafiplot.
        </p>

        <Link 
          to="/dashboard"
          className="w-full py-4 bg-brand-red hover:bg-red-700 text-white rounded-xl font-black tracking-widest text-sm flex items-center justify-center gap-2 transition-all uppercase shadow-lg shadow-brand-red/20 mb-4"
        >
          <Home className="w-5 h-5" />
          Ir al Dashboard
        </Link>
        
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          Redirigiendo en {countdown}s...
        </p>
      </motion.div>
    </div>
  );
}
