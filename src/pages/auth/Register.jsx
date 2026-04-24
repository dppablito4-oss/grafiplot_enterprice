import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import logo from '../../assets/brand/grafiplot-logo.webp';

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!supabase) {
      setErrorMessage('Supabase no esta configurado en este entorno.');
      return;
    }

    setSubmitting(true);

    const cleanPhone = phone.replace(/\D/g, '');
    const fakeEmail = `${cleanPhone}@grafiplot.com`;
    const { data, error } = await supabase.auth.signUp({
      email: fakeEmail,
      password,
      options: {
        data: {
          full_name: name,
          phone_number: phone,
        },
      },
    });

    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (!data.session) {
      setSuccessMessage('Cuenta creada. Ya puedes iniciar sesión con tu número celular.');
      // En entorno real con "Confirm email" desactivado, data.session debería existir.
      return;
    }

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
          Crear una cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-bold text-brand-red hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 transition-colors">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-[2rem] sm:px-10 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nombre completo
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red sm:text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
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
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red sm:text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors"
                  placeholder="Ej. 999888777"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red sm:text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {successMessage}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-brand-red/20 text-sm font-bold text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
              >
                {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
