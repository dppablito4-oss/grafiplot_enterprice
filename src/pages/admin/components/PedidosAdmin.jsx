import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { FileText, Download, CheckCircle, Clock, Package, MoreVertical } from 'lucide-react';

export function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          profiles:user_id (full_name, email, phone_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPedidos(data || []);
    } catch (err) {
      console.error('Error fetching pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();

    // Suscribirse a cambios
    const subscription = supabase.channel('admin-pedidos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => {
        fetchPedidos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleStatusChange = async (pedidoId, newStatus) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ status: newStatus })
        .eq('id', pedidoId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Hubo un error al actualizar el estado.');
    }
  };

  const downloadFile = async (pedido) => {
    try {
      const filePath = pedido.details?.storagePath || pedido.file_name; // Fallback for old orders
      const { data, error } = await supabase.storage.from('pedidos').download(filePath);
      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = pedido.file_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Error al descargar archivo. Es posible que no exista o falten permisos RLS.');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'En Proceso': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Listo': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Entregado': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    };
    const style = styles[status] || styles['Pendiente'];
    return (
      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${style}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Gestión de Pedidos</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Administra los pedidos de tus clientes, cambia estados y descarga los archivos.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5">
              <tr>
                <th className="px-6 py-4">Cliente / Contacto</th>
                <th className="px-6 py-4">Detalles del Trabajo</th>
                <th className="px-6 py-4">Monto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Archivo</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {pedidos.map(pedido => (
                <tr key={pedido.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 dark:text-white">{pedido.profiles?.full_name || 'Desconocido'}</p>
                    <p className="text-xs text-slate-500">{pedido.profiles?.email}</p>
                    {pedido.profiles?.phone_number && <p className="text-xs text-slate-500">{pedido.profiles?.phone_number}</p>}
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(pedido.created_at).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      {pedido.pages} Páginas ({pedido.details.copies} copias)
                    </p>
                    <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">
                      {pedido.details.size} - {pedido.details.color ? 'Color' : 'B/N'} - {pedido.details.paper}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-brand-red">S/ {pedido.amount.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(pedido.status)}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => downloadFile(pedido)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-brand-red bg-brand-red/10 rounded-lg hover:bg-brand-red/20 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-brand-red focus:outline-none"
                      value={pedido.status}
                      onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Listo">Listo</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  </td>
                </tr>
              ))}
              
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No hay pedidos registrados en el sistema.
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
