import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Filter, MoreVertical } from 'lucide-react';

const allJobs = [
  { id: 'PD-1004', client: 'Roy Admin', title: 'Impresión Lona 3x2m', status: 'En Proceso', date: '23 Abr 2026', amount: '$45.00' },
  { id: 'PD-1003', client: 'Estudio Arquitectura', title: 'Planos A1 x10', status: 'Listo', date: '23 Abr 2026', amount: '$15.00' },
  { id: 'PD-1002', client: 'Juan Pérez', title: 'Tarjetas Personales', status: 'Entregado', date: '22 Abr 2026', amount: '$25.00' },
  { id: 'PD-1001', client: 'María Gómez', title: 'Volantes A5 x1000', status: 'Entregado', date: '20 Abr 2026', amount: '$60.00' },
  { id: 'PD-1000', client: 'Colegio San José', title: 'Diplomas x50', status: 'Entregado', date: '18 Abr 2026', amount: '$35.00' },
];

export function Historial() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-bold">Mis Trabajos</h1>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar pedido..." 
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-brand-red text-sm"
            />
          </div>
          <Button variant="outline" className="px-3">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 font-medium">ID Pedido</th>
                <th className="px-6 py-4 font-medium">Descripción</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {allJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{job.id}</td>
                  <td className="px-6 py-4">{job.title}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{job.client}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{job.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium
                      ${job.status === 'Listo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                      ${job.status === 'En Proceso' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                      ${job.status === 'Entregado' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : ''}
                    `}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{job.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" className="w-8 h-8 p-0 rounded-full">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
