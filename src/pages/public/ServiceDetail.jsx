import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, MessageCircle, Info, Tag, X } from 'lucide-react';
import { servicesData } from '../../data/servicesData';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import { PublicFooter } from '../../components/public/PublicFooter';
import { supabase } from '../../lib/supabaseClient';

export function ServiceDetail() {
  const { serviceId } = useParams();
  const service = servicesData.find(s => s.id === serviceId);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('opciones'); // 'opciones' | 'detalles'
  const [selectedItem, setSelectedItem] = useState(null); // Estado para el modal

  useEffect(() => {
    window.scrollTo(0, 0);
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

  // Variantes para animación en cascada de las fichas
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors relative">
      <PublicNavbar onNavigateSection={() => {}} profile={profile} />

      {/* === HERO DEL SERVICIO === */}
      <section className="pt-28 md:pt-36 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]">
          <img src={service.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 dark:to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/#servicios" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-red dark:hover:text-brand-yellow transition-colors uppercase tracking-wider mb-8">
              <ArrowLeft className="w-4 h-4" /> Volver a Servicios
            </Link>
          </motion.div>

          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16 mb-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex-1 max-w-2xl">
              <div className={`w-16 h-16 md:w-20 md:h-20 ${service.bg} rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 shadow-sm`}>
                <Icon className={`w-8 h-8 md:w-10 md:h-10 ${service.color}`} />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-6">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                {service.fullDesc}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full md:w-auto shrink-0 flex items-center justify-center">
              <img src={service.image} alt={service.title} className="w-full max-w-[280px] h-auto object-contain dark:opacity-85 drop-shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* === ZONA INTERACTIVA (TABS Y CONTENIDO) === */}
      <section className="pb-24 md:pb-32 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Navegación por Pestañas */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-full relative">
              {['opciones', 'detalles'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 md:px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-colors z-10 capitalize
                    ${activeTab === tab ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
                >
                  <span className="flex items-center gap-2">
                    {tab === 'opciones' ? <Tag className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                    {tab === 'opciones' ? 'Catálogo de Opciones' : 'Características'}
                  </span>
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-brand-red dark:bg-brand-yellow rounded-full -z-10 shadow-md shadow-brand-red/20 dark:shadow-brand-yellow/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Contenedor Animado de Contenido */}
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              
              {/* VISTA: OPCIONES Y PRECIOS (FICHAS) */}
              {activeTab === 'opciones' && (
                <motion.div
                  key="opciones"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                  >
                    {service.pricing.map((item, i) => (
                      <motion.div 
                        key={i} 
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        onClick={() => setSelectedItem(item)}
                        className="group cursor-pointer relative bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 border border-slate-200 dark:border-white/10 hover:border-brand-red/50 dark:hover:border-brand-yellow/50 transition-all shadow-sm hover:shadow-xl hover:shadow-brand-red/5 overflow-hidden flex flex-col justify-between h-full"
                      >
                        {/* Brillo de fondo al hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-transparent to-brand-red pointer-events-none" />
                        
                        <div>
                          <div className={`w-10 h-10 ${service.bg} rounded-xl flex items-center justify-center mb-4`}>
                            <Tag className={`w-5 h-5 ${service.color}`} />
                          </div>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                            {item.item}
                          </h3>
                          <div className="text-3xl font-black text-brand-red dark:text-brand-yellow mb-2">
                            {item.price}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-brand-red dark:group-hover:text-brand-yellow uppercase tracking-wider transition-colors">
                          <Info className="w-4 h-4" />
                          <span>Ver detalles</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                  <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-8 font-medium">
                    * Haz clic en cualquier opción para ver detalles o solicitar cotización exacta.
                  </p>
                </motion.div>
              )}

              {/* VISTA: CARACTERÍSTICAS GENERALES */}
              {activeTab === 'detalles' && (
                <motion.div
                  key="detalles"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-white/10 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                      <Icon className={`w-8 h-8 ${service.color}`} />
                      ¿Qué incluye nuestro servicio?
                    </h2>
                    
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                    >
                      {service.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-colors group"
                        >
                          <CheckCircle2 className={`w-6 h-6 shrink-0 mt-0.5 ${service.color} group-hover:scale-110 transition-transform`} />
                          <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm text-center sm:text-left">
                        ¿Tienes un proyecto especial o necesitas características diferentes?
                      </p>
                      <a
                        href={`https://wa.me/952628844?text=Hola%2C%20tengo%20una%20consulta%20especial%20sobre%20el%20servicio%20de%20${encodeURIComponent(service.title)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 py-3 px-6 bg-brand-red text-white font-black text-sm rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-brand-red/20 shrink-0"
                      >
                        Hablar con un asesor
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* === MODAL FLOTANTE DE DETALLES DE OPCIÓN === */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#141414] rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedItem(null)} 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`w-14 h-14 ${service.bg} rounded-2xl flex items-center justify-center mb-6`}>
                <Tag className={`w-7 h-7 ${service.color}`} />
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight pr-8">
                {selectedItem.item}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Este servicio pertenece a la categoría de <strong className="text-slate-700 dark:text-slate-300">{service.title}</strong>. El precio indicado es referencial base.
              </p>

              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Precio Referencial</span>
                <span className="text-4xl font-black text-brand-red dark:text-brand-yellow">{selectedItem.price}</span>
              </div>

              <a
                href={`https://wa.me/952628844?text=Hola%2C%20quisiera%20solicitar%20el%20servicio%20de%20*${encodeURIComponent(selectedItem.item)}*%20(${encodeURIComponent(service.title)}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-brand-red hover:bg-red-700 text-white font-black rounded-xl transition-all shadow-lg shadow-brand-red/20 uppercase tracking-wider group"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Solicitar por WhatsApp</span>
              </a>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PublicFooter />
    </div>
  );
}
