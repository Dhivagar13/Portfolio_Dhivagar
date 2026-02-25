import ParticleNetwork from "../components/ParticleNetwork";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import CredentialsSection from "../components/CredentialsSection";
import ContactSection from "../components/ContactSection";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-[hsl(260,30%,8%)]" />
      
      <ParticleNetwork />
      <Navbar />
      
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <CredentialsSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
