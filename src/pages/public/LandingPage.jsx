import { PublicNavbar } from '../../components/public/PublicNavbar';
import { HeroSection } from '../../components/public/HeroSection';
import { ServicesSection } from '../../components/public/ServicesSection';
import { FeaturesSection } from '../../components/public/FeaturesSection';
import { PublicFooter } from '../../components/public/PublicFooter';
import { MessageCircle } from 'lucide-react';

export function LandingPage() {
  const navigateSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar onNavigateSection={navigateSection} />
      <HeroSection />
      <ServicesSection />
      <PublicFooter />
    </div>
  );
}
