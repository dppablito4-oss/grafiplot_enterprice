import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import logo from '../../assets/brand/grafiplot-logo.webp';
import { GraphitaFloatingChat } from '../../components/common/GraphitaFloatingChat';

export function Login({ hasSupabaseEnv }) {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!supabase) {
      setErrorMessage('Supabase no esta configurado en este entorno.');
      return;
    }

    setSubmitting(true);

    const fakeEmail = `${phone}@grafiplot.temp`;
    const { error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });

    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm p-2 border border-gray-100">
              <img src={logo} alt="Grafiplot" className="w-full h-full object-contain" />
            </div>
            <div className="text-center mt-2">
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">
                GRAFIPLOT <span className="text-brand-red">VASQUEZ</span>
              </h1>
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          O{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            crear una cuenta nueva
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {!hasSupabaseEnv && (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                Falta configurar variables de Supabase en produccion.
              </p>
            )}

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Número de celular
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ej. 999888777"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-brand-red hover:text-red-700">
                  ¿Olvidaste tu contraseña?
                </a>
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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <LogIn className="w-5 h-5 mr-2" />
                {submitting ? 'Ingresando...' : 'Ingresar al panel'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <GraphitaFloatingChat message="Drop your data here! No te preocupes, tus archivos están safe conmigo." />
    </div>
  );
}
