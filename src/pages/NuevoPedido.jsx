import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function NuevoPedido() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nuevo Pedido</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Trabajo</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-brand-red">
                  <option>Impresión de Planos</option>
                  <option>Gigantografía / Lona</option>
                  <option>Tarjetas Personales</option>
                  <option>Afiches / Volantes</option>
                  <option>Digitalización</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
                <input type="number" defaultValue={1} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-brand-red" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Especificaciones Adicionales</label>
              <textarea rows={4} placeholder="Medidas exactas, tipo de papel, acabados especiales..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-brand-red"></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Archivos (Opcional)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                <p className="text-sm text-gray-500">Arrastra tus archivos aquí o haz clic para subir</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, TIFF (Máx. 50MB)</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="ghost">Cancelar</Button>
              <Button variant="primary">Crear Pedido</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
