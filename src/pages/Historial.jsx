import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Filter, MoreVertical } from 'lucide-react';

const allJobs = [];

export function Historial() {
  return (
    <div className="space-y-8">
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
              placeholder="Buscar pedido..." 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-sm transition-all shadow-sm"
            />
          </div>
          <Button variant="outline" className="px-3 h-10 border-gray-200 dark:border-zinc-800 rounded-xl hover:border-gray-300 dark:hover:border-zinc-700">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 dark:bg-zinc-900/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">ID Pedido</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Descripción</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Cliente</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Fecha</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Estado</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {allJobs.length > 0 ? (
                allJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{job.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">{job.title}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{job.client}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{job.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${job.status === 'Listo' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-emerald-500/20' : ''}
                        ${job.status === 'En Proceso' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 ring-1 ring-amber-500/20' : ''}
                        ${job.status === 'Entregado' ? 'bg-gray-50 text-gray-600 dark:bg-zinc-800 dark:text-gray-400 ring-1 ring-gray-500/20' : ''}
                      `}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">{job.amount}</td>
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
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">No hay trabajos registrados</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tus nuevos pedidos y su historial de estado aparecerán en esta lista.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
