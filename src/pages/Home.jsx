import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Printer, Scissors, Scan, Maximize2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickActions = [
  { id: 1, title: 'Impresión Rápida', desc: 'Para PDFs, documentos, A4/A3', icon: Printer },
  { id: 2, title: 'Gigantografías y Ploteos', desc: 'Para lonas, vinilos, planos', icon: Maximize2 },
  { id: 3, title: 'Acabados Especiales', desc: 'Laminado, corte, encuadernado', icon: Scissors },
  { id: 4, title: 'Digitalización', desc: 'Escaneo profesional, OCR', icon: Scan },
];

const recentJobs = [
  { id: 'PD-1005', title: 'Impresión de Planos A1', status: 'En Proceso', date: 'Hoy, 14:30', amount: 'S/ 25.00' },
  { id: 'PD-1004', title: 'Gigantografía 3x2m', status: 'Listo', date: 'Hoy, 10:30', amount: 'S/ 45.00' },
  { id: 'PD-1003', title: 'Encuadernado de Tesis', status: 'Listo', date: 'Hoy, 09:15', amount: 'S/ 15.00' },
  { id: 'PD-1002', title: 'Tarjetas Personales x100', status: 'Entregado', date: 'Ayer', amount: 'S/ 25.00' },
  { id: 'PD-1001', title: 'Fotocopias A4 B/N', status: 'Entregado', date: 'Ayer', amount: 'S/ 10.00' },
];

export function Home() {
  return (
    <div className="space-y-12">
      {/* Sección 1: Resumen del Estado */}
      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Resumen del Estado</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-t-4 border-t-brand-yellow hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Trabajos en Proceso</p>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">12</h2>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-brand-yellow hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Listos para Entrega</p>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">5</h2>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-brand-yellow hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Nuevas Solicitudes</p>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">3</h2>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sección 3: Acciones Rápidas (Izquierda, toma más espacio en desktop) */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {quickActions.map(action => (
              <Link to="/dashboard/nuevo-pedido" key={action.id}>
                <Card className="hover:border-brand-red transition-colors cursor-pointer h-full group bg-white dark:bg-[#1a1a1a]">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-brand-red group-hover:scale-110 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-all">
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{action.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{action.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sección 2: Mis Trabajos Recientes (Derecha) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mis Trabajos</h2>
            <Link to="/dashboard/historial" className="text-sm font-medium text-brand-red hover:text-brand-red-hover transition-colors">
              Ver todos
            </Link>
          </div>
          <Card className="bg-white dark:bg-[#1a1a1a] shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentJobs.map(job => (
                  <div key={job.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{job.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{job.date}</span>
                        <span className="text-xs text-gray-300 dark:text-gray-700">•</span>
                        <span className={`text-xs font-medium ${
                          job.status === 'Listo' ? 'text-yellow-600 dark:text-yellow-500' :
                          job.status === 'En Proceso' ? 'text-blue-600 dark:text-blue-500' :
                          'text-gray-500'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" className="w-8 h-8 p-0 rounded-full text-gray-400 hover:text-brand-red">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
