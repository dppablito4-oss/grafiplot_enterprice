import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import graphitaLogo from '../../assets/graphita_ia.svg';
import { GraphitaChatSidebar } from '../dashboard/GraphitaChatSidebar';
import { GraphitaUpgradeModal } from './GraphitaUpgradeModal';

export function GlobalGraphita() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!supabase) return;

    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    };
    
    fetchProfile();
    
    const { data } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });
    
    return () => data?.subscription?.unsubscribe();
  }, []);

  const handleToggle = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    if (!supabase) {
      setIsOpen(true);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const userEmail = session?.user?.email || '';
      const isFakeEmail = userEmail.endsWith('@grafiplot.com');
      
      if (!profile?.is_verified && isFakeEmail && profile?.role !== 'admin') {
        setShowUpgrade(true);
        return;
      }
    }
    
    setIsOpen(true);
  };

  return (
    <>
      {/* Botón flotante para abrir Graphita */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="fixed bottom-6 right-24 md:bottom-8 md:right-28 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-900 shadow-xl shadow-brand-red/20 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 hover:scale-105 transition-transform group"
        >
          <div className="absolute inset-0 bg-brand-red/20 group-hover:bg-brand-red/40 transition-colors" />
          <img src={graphitaLogo} alt="Graphita" className="w-full h-full object-cover relative z-10" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center animate-pulse">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        </button>
      )}

      {/* Panel de Chat de Graphita */}
      <GraphitaChatSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} profile={profile} />

      {/* Modal de Upgrade */}
      <GraphitaUpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
        onUpgradeSuccess={() => {
          setIsOpen(true);
        }}
      />
    </>
  );
}
