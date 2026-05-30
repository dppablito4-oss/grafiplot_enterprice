import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, KeyRound, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import logo from '../../assets/brand/grafiplot-logo.webp';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState(1); // 1 = Email, 2 = Token
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!supabase) {
      setErrorMessage('Supabase no está configurado en este entorno.');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
    });

    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage('Te hemos enviado un código de acceso de 6 dígitos a tu correo.');
    setStep(2);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: token.trim(),
      type: 'email',
    });

    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message || 'Código inválido o expirado.');
      return;
    }

    // El inicio de sesión es exitoso, los tokens JWT se guardan automáticamente (cookies/localstorage).
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-2 border border-slate-200 dark:border-slate-800">
              <img src={logo} alt="Grafiplot" className="w-full h-full object-contain" />
            </div>
            <div className="text-center mt-2">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                GRAFIPLOT <span className="text-brand-red">VASQUEZ</span>
              </h1>
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          {step === 1 ? 'Iniciar Sesión o Crear Cuenta' : 'Verificar Código'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {step === 1 
            ? 'Ingresa tu correo para recibir un código de acceso único.' 
            : 'Revisa tu bandeja de entrada o spam.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-[2rem] sm:px-10 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          
          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Correo electrónico
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red sm:text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
              </div>

              {errorMessage && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMessage}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-brand-red/20 text-sm font-bold text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
                >
                  {submitting ? 'Enviando código...' : 'Continuar con Correo'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label htmlFor="token" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Código de 6 dígitos
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="token"
                    name="token"
                    type="text"
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    required
                    maxLength={6}
                    className="appearance-none block w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red text-center tracking-[0.5em] text-lg font-mono bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors"
                    placeholder="000000"
                  />
                </div>
              </div>

              {successMessage && (
                <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 text-center">
                  {successMessage}
                </p>
              )}

              {errorMessage && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 text-center">
                  {errorMessage}
                </p>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={submitting || token.length < 6}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-brand-red/20 text-sm font-bold text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {submitting ? 'Verificando...' : 'Verificar y Entrar'}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep(1); setToken(''); setErrorMessage(''); setSuccessMessage(''); }}
                  className="w-full flex justify-center items-center py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Usar otro correo
                </button>
              </div>
            </form>
          )}

        </div>
        
        <p className="mt-8 text-center text-xs text-slate-500 max-w-sm mx-auto">
          Al iniciar sesión, aceptas nuestros <Link to="/terminos" className="underline hover:text-slate-800 dark:hover:text-slate-300">Términos y Condiciones</Link> y el uso de cookies estrictamente necesarias.
        </p>
      </div>
    </div>
  );
}
