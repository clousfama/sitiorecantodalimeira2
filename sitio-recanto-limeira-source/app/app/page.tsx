
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import GallerySection from '@/components/gallery-section';
import LocationSection from '@/components/location-section';
import ReservationSection from '@/components/reservation-section';
import ContactSection from '@/components/contact-section';
import PoliciesSection from '@/components/policies-section';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div id="inicio">
        <HeroSection />
      </div>
      <AboutSection />
      <GallerySection />
      <LocationSection />
      <ReservationSection />
      <ContactSection />
      <PoliciesSection />
      <Footer />
    </main>
  );
}
