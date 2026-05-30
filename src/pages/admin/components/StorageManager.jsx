import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { HardDrive, Trash2, Download, Search, FileText, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';

export function StorageManager() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Límite gratuito de Supabase (1 GB = 1024 MB)
  const MAX_STORAGE_MB = 1024;

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.storage.from('pedidos').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

      if (error) throw error;
      
      // Filtrar ".emptyFolderPlaceholder" si existe
      const validFiles = data.filter(file => file.name !== '.emptyFolderPlaceholder');
      setFiles(validFiles);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los archivos. Asegúrate de tener permisos de Administrador.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchFiles();
    }, 0);
  }, []);

  const handleDelete = async (fileName) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el archivo "${fileName}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase.storage.from('pedidos').remove([fileName]);
      if (error) throw error;
      
      // Actualizar la lista localmente
      setFiles(prev => prev.filter(f => f.name !== fileName));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el archivo. ¿Ejecutaste el script SQL de Políticas de Administrador?');
    } finally {
      setIsDeleting(false);
    }
  };

  const getPublicUrl = (fileName) => {
    const { data } = supabase.storage.from('pedidos').getPublicUrl(fileName);
    return data.publicUrl;
  };

  // Calcular espacio usado
  const totalBytes = files.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
  const percentageUsed = Math.min(100, ((totalMB / MAX_STORAGE_MB) * 100)).toFixed(1);

  // Filtrado de archivos
  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Formatear nombre para quitar el timestamp largo si es posible
  const formatName = (name) => {
    // Si sigue el formato timestamp_userId_name
    const parts = name.split('_');
    if (parts.length >= 3 && !isNaN(parts[0])) {
      return parts.slice(2).join('_');
    }
    return name;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-brand-red" />
            Gestor de Archivos
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Administra los PDFs subidos por los clientes temporalmente.
          </p>
        </div>
        <button 
          onClick={fetchFiles}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors"
        >
          <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Tarjeta de Uso de Almacenamiento */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Espacio Utilizado</h3>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {totalMB} <span className="text-lg text-slate-400">MB</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-slate-500">Límite Gratuito: 1 GB</div>
            <div className={`text-sm font-bold ${percentageUsed > 80 ? 'text-red-500' : 'text-emerald-500'}`}>
              {percentageUsed}% Usado
            </div>
          </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mt-4 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${percentageUsed > 80 ? 'bg-red-500' : 'bg-brand-red'}`} 
            style={{ width: `${percentageUsed}%` }}
          ></div>
        </div>
      </div>

      {/* Controles de Lista */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] focus:outline-none focus:border-brand-red text-sm"
          />
        </div>
        <div className="text-sm font-bold text-slate-500">
          {filteredFiles.length} Archivo(s) encontrados
        </div>
      </div>

      {/* Lista de Archivos */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        {error && (
          <div className="p-8 text-center text-red-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
          </div>
        ) : !error && filteredFiles.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-bold">No hay archivos en el servidor en este momento.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Nombre del Archivo</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Peso</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Fecha de Subida</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-brand-red" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs" title={file.name}>
                            {formatName(file.name)}
                          </p>
                          <p className="text-xs text-slate-400 font-mono truncate max-w-[200px] sm:max-w-xs opacity-50">{file.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 rounded-md text-xs font-bold">
                        {((file.metadata?.size || 0) / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(file.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <a
                        href={getPublicUrl(file.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                        title="Descargar"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(file.name)}
                        disabled={isDeleting}
                        className="inline-flex p-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar Permanente"
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
