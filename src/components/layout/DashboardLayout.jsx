import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { supabase } from '../../lib/supabaseClient';

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      }
    };
    fetchProfile();
  }, []);


  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f9fafb] dark:bg-black transition-colors">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} profile={profile} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} profile={profile} />
        
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>

    </div>
  );
}
