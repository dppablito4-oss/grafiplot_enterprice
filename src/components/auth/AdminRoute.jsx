import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';

export function AdminRoute() {
  const { profile, loading, isAdmin, session } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#111827]">
        <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}
