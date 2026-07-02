import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import graphitaLogo from '../../assets/graphita_ia.svg';
import { GraphitaChatSidebar } from '../dashboard/GraphitaChatSidebar';
import { GraphitaUpgradeModal } from './GraphitaUpgradeModal';
import { useProfile } from '../../contexts/ProfileContext';

export function GlobalGraphita() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { profile, session } = useProfile();

  const handleToggle = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    if (!supabase) {
      setIsOpen(true);
      return;
    }

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
      {/* Botón flotante para abrir Grafi-bot */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="fixed bottom-6 right-24 md:bottom-8 md:right-28 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-900 shadow-xl shadow-brand-red/20 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 hover:scale-105 transition-transform group"
        >
          <div className="absolute inset-0 bg-brand-red/20 group-hover:bg-brand-red/40 transition-colors" />
          <img src={graphitaLogo} alt="Grafi-bot" className="w-full h-full object-cover relative z-10" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center animate-pulse">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        </button>
      )}

      {/* Panel de Chat de Grafi-bot */}
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
