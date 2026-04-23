import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Smartphone, Mail, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import logo from '../../assets/brand/grafiplot-logo.webp';

export function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [type, setType] = useState('phone'); // 'phone' o 'email'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    if (type === 'phone') {
      // Redirigir a WhatsApp
      const whatsappUrl = `https://wa.me/51952628844?text=Hola%20Roy,%20olvidé%20mi%20contraseña%20de%20Grafiplot.%20Mi%20número%20registrado%20es%20${identifier}`;
      window.open(whatsappUrl, '_blank');
      setMessage('Te hemos redirigido a WhatsApp para que Soporte te asigne una contraseña temporal al instante.');
      setSubmitting(false);
    } else {
      // Recuperación oficial por correo en Supabase
      if (!supabase) {
        setError('Supabase no está configurado.');
        setSubmitting(false);
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(identifier, {
        redirectTo: `${window.location.origin}/dashboard`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage('Si el correo está registrado, te enviamos un enlace de recuperación. Revisa tu bandeja de entrada o spam.');
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-0 inset-x-0 h-64 bg-slate-900 overflow-hidden rounded-b-[4rem] pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Link to="/" className="w-20 h-20 bg-white rounded-2xl shadow-xl p-2 border border-slate-100 hover:-translate-y-1 transition-transform">
            <img src={logo} alt="Grafiplot" className="w-full h-full object-contain" />
          </Link>
        </div>
        
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-[2rem] sm:px-10 border border-slate-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6 text-brand-red" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recuperar Acceso</h2>
            <p className="text-sm text-slate-500 mt-2">Selecciona cómo te registraste para recuperar tu contraseña.</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setType('phone'); setError(''); setMessage(''); setIdentifier(''); }}
              className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                type === 'phone' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Smartphone className="w-4 h-4" /> Celular
            </button>
            <button
              onClick={() => { setType('email'); setError(''); setMessage(''); setIdentifier(''); }}
              className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                type === 'email' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Mail className="w-4 h-4" /> Correo
            </button>
          </div>

          {message ? (
            <div className="text-center pb-4">
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 text-sm font-medium mb-6">
                {message}
              </div>
              <Link to="/login" className="text-brand-red font-bold hover:underline">
                Volver a Iniciar Sesión
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="identifier" className="block text-sm font-bold text-slate-700 mb-2">
                  {type === 'phone' ? 'Número de celular registrado' : 'Correo electrónico'}
                </label>
                <input
                  id="identifier"
                  type={type === 'phone' ? 'tel' : 'email'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red sm:text-sm bg-slate-50"
                  placeholder={type === 'phone' ? 'Ej. 999888777' : 'ejemplo@gmail.com'}
                />
                
                {type === 'phone' && (
                  <p className="mt-2 text-xs text-slate-500 flex gap-1 leading-relaxed">
                    <span className="text-emerald-500 font-bold">*</span>
                    Al continuar, se abrirá WhatsApp para que Soporte te entregue una clave nueva en segundos.
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-medium">
                  {error}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={submitting || !identifier}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {type === 'phone' ? (
                    <>Solicitar por WhatsApp <ExternalLink className="w-4 h-4 ml-2" /></>
                  ) : (
                    'Enviar link de recuperación'
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                  Cancelar y volver al Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
