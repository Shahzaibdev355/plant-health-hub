import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { MissionVisionSection } from "@/components/landing/MissionVisionSection";
import { ContactSection } from "@/components/landing/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <MissionVisionSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
