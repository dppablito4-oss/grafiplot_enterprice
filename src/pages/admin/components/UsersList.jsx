import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Database } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

export function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      fetchUsers();
    }, 0);
  }, []);

  const filteredUsers = users.filter(user => 
    (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.phone_number?.includes(searchTerm))
  );

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Gestión de Usuarios
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visualiza los clientes registrados, su almacenamiento utilizado y su estado de verificación.
          </p>
        </div>
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-red text-slate-900 dark:text-white transition-colors"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 dark:text-slate-400 border-b border-slate-200 dark:border-white/5">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Contacto</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Gas (Storage)</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider text-right">Rol</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-yellow/20 text-brand-yellow flex items-center justify-center font-bold">
                          {user.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {user.full_name || 'Sin nombre'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 dark:text-white font-medium">{user.phone_number || '-'}</div>
                      <div className="text-xs text-slate-500">{user.email || 'Sin correo vinculado'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_verified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <UserCheck className="w-3.5 h-3.5" /> Verificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          <UserX className="w-3.5 h-3.5" /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <Database className="w-4 h-4 text-brand-red" />
                        {formatBytes(user.storage_used || 0)} / 30 MB
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-brand-red h-1.5 rounded-full" 
                          style={{ width: `${Math.min(((user.storage_used || 0) / (30 * 1024 * 1024)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-black tracking-widest uppercase ${
                        user.role === 'admin' 
                          ? 'bg-slate-900 text-white dark:bg-brand-yellow dark:text-slate-900'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
