import { PublicNavbar } from '../../components/public/PublicNavbar';
import { HeroSection } from '../../components/public/HeroSection';
import { ServicesSection } from '../../components/public/ServicesSection';
import { PublicFooter } from '../../components/public/PublicFooter';
import { useProfile } from '../../contexts/ProfileContext';

export function LandingPage() {
  const { profile } = useProfile();

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
