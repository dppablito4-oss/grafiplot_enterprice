import { useState, useEffect } from 'react';
import { Save, Server, KeyRound, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

export function SmtpSettings() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const [config, setConfig] = useState({
    provider: 'gmail',
    host: 'smtp.gmail.com',
    port: '587',
    user: '',
    password: '' // App Password
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'smtp_config')
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
        
        if (data && data.value) {
          setConfig(data.value);
        }
      } catch (err) {
        console.error('Error loading SMTP settings:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    setTimeout(() => {
      loadSettings();
    }, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleProviderChange = (e) => {
    const provider = e.target.value;
    if (provider === 'gmail') {
      setConfig(prev => ({ ...prev, provider, host: 'smtp.gmail.com', port: '587' }));
    } else if (provider === 'outlook') {
      setConfig(prev => ({ ...prev, provider, host: 'smtp.office365.com', port: '587' }));
    } else {
      setConfig(prev => ({ ...prev, provider, host: '', port: '' }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Intentar actualizar primero
      const { data: existing } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', 'smtp_config')
        .single();

      let error;
      if (existing) {
        const { error: updateErr } = await supabase
          .from('system_settings')
          .update({ value: config, updated_at: new Date() })
          .eq('key', 'smtp_config');
        error = updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('system_settings')
          .insert([{ key: 'smtp_config', value: config }]);
        error = insertErr;
      }

      if (error) throw error;

      setStatus({
        type: 'success',
        message: 'Configuración SMTP guardada correctamente. El sistema ahora usará estas credenciales para enviar correos.'
      });
    } catch (err) {
      console.error('Error saving SMTP settings:', err);
      setStatus({
        type: 'error',
        message: 'No se pudo guardar la configuración. Verifica tus permisos de administrador.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="animate-pulse flex space-x-4"><div className="h-4 bg-slate-200 rounded w-1/4"></div></div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Sistema SMTP
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Configura el servidor de correo saliente para enviar notificaciones automáticas, códigos de verificación y actualizaciones de estado a los clientes.
        </p>
      </div>

      {status.message && (
        <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
          status.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400' 
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
          <p className="text-sm font-medium">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Provider */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Proveedor de Correo
              </label>
              <select
                name="provider"
                value={config.provider}
                onChange={handleProviderChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#2a2a2a] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red text-slate-900 dark:text-white transition-colors"
              >
                <option value="gmail">Gmail / Google Workspace</option>
                <option value="outlook">Outlook / Microsoft 365</option>
                <option value="custom">Servidor SMTP Personalizado</option>
              </select>
            </div>

            {/* Host */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Servidor SMTP (Host)
              </label>
              <div className="relative">
                <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="host"
                  value={config.host}
                  onChange={handleChange}
                  readOnly={config.provider !== 'custom'}
                  className={`w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red text-slate-900 dark:text-white transition-colors ${
                    config.provider !== 'custom' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-50 dark:bg-[#2a2a2a]'
                  }`}
                />
              </div>
            </div>

            {/* Port */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Puerto
              </label>
              <input
                type="text"
                name="port"
                value={config.port}
                onChange={handleChange}
                readOnly={config.provider !== 'custom'}
                className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red text-slate-900 dark:text-white transition-colors ${
                  config.provider !== 'custom' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-50 dark:bg-[#2a2a2a]'
                }`}
              />
            </div>

            {/* User/Email */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Correo Remitente (Usuario)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="user"
                  required
                  value={config.user}
                  onChange={handleChange}
                  placeholder="ej. notificaciones@grafiplot.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#2a2a2a] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red text-slate-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Contraseña de Aplicación
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={config.password}
                  onChange={handleChange}
                  placeholder="••••••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#2a2a2a] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red text-slate-900 dark:text-white transition-colors font-mono"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Para Google/Gmail debes generar una "Contraseña de aplicación" de 16 dígitos en los ajustes de seguridad de tu cuenta de Google, no uses tu contraseña personal normal.
              </p>
            </div>
          </div>

        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-white/5 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-brand-red/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Guardar Configuración
          </button>
        </div>
      </form>
    </div>
  );
}
