import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, MessageCircle } from 'lucide-react';
import { servicesData } from '../../data/servicesData';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import { PublicFooter } from '../../components/public/PublicFooter';
import { supabase } from '../../lib/supabaseClient';

export function ServiceDetail() {
  const { serviceId } = useParams();
  const service = servicesData.find(s => s.id === serviceId);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Opcional pero recomendado para que empiece arriba
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      }
    };
    fetchProfile();
  }, [serviceId]);

  if (!service) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4">404</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Servicio no encontrado</p>
        <Link to="/" className="text-brand-red font-bold hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <PublicNavbar onNavigateSection={() => {}} profile={profile} />

      {/* Hero del servicio */}
      <section className="pt-28 md:pt-36 pb-16 md:pb-24 relative overflow-hidden">
        {/* Imagen de fondo sutil */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]">
          <img src={service.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 dark:to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/#servicios"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-red dark:hover:text-brand-yellow transition-colors uppercase tracking-wider mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Servicios
            </Link>
          </motion.div>

          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 max-w-2xl"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 ${service.bg} rounded-2xl md:rounded-3xl flex items-center justify-center mb-6`}>
                <Icon className={`w-8 h-8 md:w-10 md:h-10 ${service.color}`} />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-6">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                {service.fullDesc}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full md:w-auto shrink-0"
            >
              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/10 max-w-sm">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full max-w-[200px] mx-auto h-auto object-contain dark:opacity-80 mb-6"
                />
                <a
                  href={`https://wa.me/952628844?text=Hola%2C%20quisiera%20consultar%20sobre%20el%20servicio%20de%20${encodeURIComponent(service.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-brand-red hover:bg-red-700 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-brand-red/20 uppercase tracking-wider"
                >
                  <MessageCircle className="w-5 h-5" />
                  Consultar por WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contenido: Features + Precios */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-5xl">
            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mb-6">
                Características
              </h2>
              <div className="space-y-4">
                {service.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5"
                  >
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${service.color}`} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Precios */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mb-6">
                Precios Referenciales
              </h2>
              <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5">
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Servicio</th>
                      <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {service.pricing.map((item, i) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{item.item}</td>
                        <td className="px-6 py-4 text-right text-sm font-black text-slate-900 dark:text-white">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 font-medium">
                * Los precios pueden variar según cantidad y especificaciones del trabajo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
