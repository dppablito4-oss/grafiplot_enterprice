import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const ProfileContext = createContext(null);

/**
 * ProfileProvider — Proveedor centralizado del perfil de usuario.
 * 
 * Evita queries Supabase duplicados. Todos los componentes que necesiten
 * datos del perfil deben usar el hook useProfile() en vez de hacer
 * su propio fetch.
 */
export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    let mounted = true;

    // 1. Obtener sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const currentSession = data.session;
      setSession(currentSession);

      if (currentSession?.user?.id) {
        fetchProfile(currentSession.user.id).then(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // 2. Escuchar cambios de autenticación
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);

      if (nextSession?.user?.id) {
        fetchProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const refetch = useCallback(() => {
    if (session?.user?.id) {
      return fetchProfile(session.user.id);
    }
  }, [session, fetchProfile]);

  const isAdmin = profile?.role === 'admin';

  return (
    <ProfileContext.Provider value={{ profile, session, loading, isAdmin, refetch }}>
      {children}
    </ProfileContext.Provider>
  );
}

/**
 * useProfile — Hook para acceder al perfil del usuario actual.
 * 
 * @returns {{ profile: object|null, session: object|null, loading: boolean, isAdmin: boolean, refetch: function }}
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === null) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
