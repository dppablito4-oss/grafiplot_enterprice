import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Search, Filter, MoreVertical, Loader2, FileText } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export function Historial() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let subscription = null;
    let mounted = true;

    const fetchJobs = async () => {
      if (!supabase) {
        if (mounted) setIsLoading(false);
        return;
      }
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        
        if (!user) {
          if (mounted) setIsLoading(false);
          return;
        }

        // Obtener historial inicial
        const { data, error } = await supabase
          .from('pedidos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted) setJobs(data || []);

        // Suscribirse a cambios en tiempo real para este usuario
        subscription = supabase.channel(`pedidos-usuario-${user.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos', filter: `user_id=eq.${user.id}` }, (payload) => {
            if (!mounted) return;
            if (payload.eventType === 'INSERT') {
              setJobs(current => [payload.new, ...current]);
            } else if (payload.eventType === 'UPDATE') {
              setJobs(current => current.map(job => job.id === payload.new.id ? payload.new : job));
            } else if (payload.eventType === 'DELETE') {
              setJobs(current => current.filter(job => job.id !== payload.old.id));
            }
          })
          .subscribe();

      } catch (err) {
        console.error('Error cargando historial:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchJobs();

    return () => {
      mounted = false;
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredJobs = jobs.filter(job => 
    job?.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job?.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Mis Trabajos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Gestiona y revisa el estado de tus pedidos recientes.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-red transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar archivo o ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-sm transition-all shadow-sm"
            />
          </div>
          <Button variant="outline" className="px-3 h-10 border-gray-200 dark:border-zinc-800 rounded-xl hover:border-gray-300 dark:hover:border-zinc-700">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 dark:bg-zinc-900/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">ID Pedido</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Archivo</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Páginas</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Fecha</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Estado</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Total</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                        {job?.id?.split('-')[0]}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-brand-red" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]" title={job.file_name}>
                              {job.file_name}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              {job.details?.size} • {job.details?.paper}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                        {job.pages} <span className="text-gray-400 text-xs">pág.</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                        {formatDate(job.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                          ${job.status === 'Pendiente' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 ring-1 ring-amber-500/20' : ''}
                          ${job.status === 'En Proceso' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 ring-1 ring-blue-500/20' : ''}
                          ${job.status === 'Entregado' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-emerald-500/20' : ''}
                        `}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-gray-900 dark:text-white">
                        S/ {Number(job.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" className="w-8 h-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center mb-4 border border-gray-100 dark:border-zinc-800">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                          {searchTerm ? 'No hay resultados' : 'No hay trabajos registrados'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {searchTerm ? 'Intenta buscar con otro nombre.' : 'Tus nuevos pedidos y su historial de estado aparecerán en esta lista.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
