import { useState, useEffect } from 'react';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import { HeroSection } from '../../components/public/HeroSection';
import { ServicesSection } from '../../components/public/ServicesSection';
import { PublicFooter } from '../../components/public/PublicFooter';
import { supabase } from '../../lib/supabaseClient';

export function LandingPage() {
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

  const navigateSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar onNavigateSection={navigateSection} profile={profile} />
      <HeroSection />
      <ServicesSection />
      <PublicFooter />
    </div>
  );
}
