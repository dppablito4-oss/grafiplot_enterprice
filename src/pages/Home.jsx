import { useState, useEffect } from 'react';

import { Printer, Scissors, Scan, Maximize2, ArrowRight, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const quickActions = [
  { id: 1, title: 'Impresión Rápida', desc: 'Para PDFs, documentos, A4/A3', icon: Printer },
  { id: 2, title: 'Gigantografías y Ploteos', desc: 'Para lonas, vinilos, planos', icon: Maximize2 },
  { id: 3, title: 'Acabados Especiales', desc: 'Laminado, corte, encuadernado', icon: Scissors },
  { id: 4, title: 'Digitalización', desc: 'Escaneo profesional, OCR', icon: Scan },
];

export function Home() {
  const [stats, setStats] = useState({ enProceso: 0, listos: 0, nuevos: 0 });
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        if (!user) return;

        const { data: jobs, error } = await supabase
          .from('pedidos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (jobs) {
          const enProceso = jobs.filter(j => j.status === 'En Proceso').length;
          const listos = jobs.filter(j => j.status === 'Listo' || j.status === 'Entregado').length;
          const nuevos = jobs.filter(j => j.status === 'Pendiente').length;
          setStats({ enProceso, listos, nuevos });

          const recientesFormateados = jobs.slice(0, 5).map(job => ({
            id: job.id,
            title: job.file_name,
            date: new Date(job.created_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
            status: job.status
          }));
          setRecentJobs(recientesFormateados);
        }
      } catch (err) {
        console.error('Error al obtener datos para Home:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-12">
      {/* Sección 1: Resumen del Estado */}
      <div>
        <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white tracking-tight">Resumen del Estado</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950/50 border border-gray-100 dark:border-white/5 hover:border-brand-yellow/50 transition-all group">
            <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Trabajos en Proceso</p>
            <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{stats.enProceso}</h2>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950/50 border border-gray-100 dark:border-white/5 hover:border-emerald-500/50 transition-all group">
            <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Listos para Entrega</p>
            <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{stats.listos}</h2>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950/50 border border-gray-100 dark:border-white/5 hover:border-brand-red/50 transition-all group">
            <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Nuevas Solicitudes</p>
            <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{stats.nuevos}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Sección 3: Acciones Rápidas (Izquierda) */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {quickActions.map(action => (
              <Link to="/dashboard/nuevo-pedido" key={action.id} className="block group">
                <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950/50 border border-gray-100 dark:border-white/5 group-hover:border-brand-red/30 group-hover:bg-brand-red/5 dark:group-hover:bg-brand-red/5 transition-all h-full flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-brand-red group-hover:scale-110 group-hover:rotate-3 transition-transform border border-gray-100 dark:border-white/5">
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">{action.title}</h3>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed">{action.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sección 2: Mis Trabajos Recientes (Derecha) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Mis Trabajos</h2>
            <Link to="/dashboard/historial" className="text-xs font-bold text-brand-red uppercase tracking-widest hover:text-brand-yellow transition-colors">
              Ver todos
            </Link>
          </div>
          <div className="rounded-2xl bg-white dark:bg-zinc-950/50 border border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {recentJobs.length > 0 ? (
                recentJobs.map(job => (
                  <div key={job.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">{job.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400">{job.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-700"></span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          job.status === 'Listo' ? 'text-emerald-500' :
                          job.status === 'En Proceso' ? 'text-amber-500' :
                          'text-gray-500'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-gray-400 group-hover:text-brand-red group-hover:scale-110 transition-all border border-gray-100 dark:border-white/5">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center mb-5 border border-gray-100 dark:border-white/5">
                    <FolderOpen className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Aún no hay trabajos</h3>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 max-w-[200px]">Tus pedidos recientes aparecerán aquí.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
