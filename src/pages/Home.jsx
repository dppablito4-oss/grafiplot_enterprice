import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Carousel } from '../components/ui/Carousel';
import { Button } from '../components/ui/Button';
import { Clock, CheckCircle, FileText, Printer, Scissors, Scan, Maximize2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const carouselItems = [
  {
    title: 'Nueva Promoción de Lonas',
    description: 'Impresión de alta resolución con 20% de descuento.',
    image: 'https://images.unsplash.com/photo-1598555437435-08e82a8dc4e3?auto=format&fit=crop&q=80&w=1200&h=600'
  },
  {
    title: 'Plotter de Arquitectura',
    description: 'Imprime tus planos A0, A1, A2 con la mejor calidad.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200&h=600'
  },
  {
    title: 'Tarjetas de Presentación',
    description: 'Dale una primera impresión profesional a tus clientes.',
    image: 'https://images.unsplash.com/photo-1616628188540-9a25ab8167f6?auto=format&fit=crop&q=80&w=1200&h=600'
  }
];

const quickActions = [
  { id: 1, title: 'Impresión Rápida', desc: 'PDFs, documentos, A4/A3', icon: Printer, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 2, title: 'Gigantografías', desc: 'Lonas, vinilos, planos', icon: Maximize2, color: 'text-brand-red', bg: 'bg-red-50 dark:bg-red-900/20' },
  { id: 3, title: 'Acabados', desc: 'Laminado, corte, encuadernado', icon: Scissors, color: 'text-brand-yellow', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 4, title: 'Digitalización', desc: 'Escaneo profesional, OCR', icon: Scan, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
];

const recentJobs = [
  { id: 'PD-1004', title: 'Impresión Lona 3x2m', status: 'En Proceso', date: 'Hoy, 10:30', amount: '$45.00' },
  { id: 'PD-1003', title: 'Planos A1 x10', status: 'Listo', date: 'Hoy, 09:15', amount: '$15.00' },
  { id: 'PD-1002', title: 'Tarjetas Personales', status: 'Entregado', date: 'Ayer', amount: '$25.00' },
];

export function Home() {
  return (
    <div className="space-y-8">
      {/* Resumen del Estado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-brand-yellow hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Trabajos en Proceso</p>
              <h2 className="text-3xl font-bold mt-1">12</h2>
            </div>
            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center text-brand-yellow">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-emerald-500 hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Listos para Entrega</p>
              <h2 className="text-3xl font-bold mt-1">5</h2>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-500">
              <CheckCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-brand-red hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nuevas Solicitudes</p>
              <h2 className="text-3xl font-bold mt-1">3</h2>
            </div>
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-brand-red">
              <FileText className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Carousel */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Novedades y Ofertas</h2>
            <Carousel items={carouselItems} />
          </div>

          {/* Acciones Rápidas */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Servicios Frecuentes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map(action => (
                <Link to="/nuevo-pedido" key={action.id}>
                  <Card className="hover:border-brand-red transition-colors cursor-pointer h-full group">
                    <CardContent className="p-0 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{action.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Trabajos Recientes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Trabajos Recientes</h2>
            <Link to="/historial" className="text-sm text-brand-red hover:underline">Ver todos</Link>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentJobs.map(job => (
                  <div key={job.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{job.id}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{job.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium
                        ${job.status === 'Listo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                        ${job.status === 'En Proceso' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                        ${job.status === 'Entregado' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : ''}
                      `}>
                        {job.status}
                      </span>
                      <Button variant="ghost" className="w-8 h-8 p-0 ml-2 rounded-full">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
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
