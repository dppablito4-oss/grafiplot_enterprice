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
      <FeaturesSection />
      <PublicFooter />
      <a
        href="https://wa.me/952628844?text=Hola%20Grafiplot%2C%20quiero%20consultar%20un%20producto"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
