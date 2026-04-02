import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import SkillsProgress from "@/components/sections/SkillsProgress";
import ProjectsPreview from "@/components/sections/ProjectsPreview";
import GitHubStats from "@/components/sections/GitHubStats";
import Testimonials from "@/components/sections/Testimonials";
import Newsletter from "@/components/sections/Newsletter";
import Contact from "@/components/sections/Contact";
import AIAssistant from "@/components/sections/AIAssistant";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Skills />
      <SkillsProgress />
      <ProjectsPreview />
      <GitHubStats />
      <Testimonials />
      <Newsletter />
      <Contact />
      <Footer />
      <AIAssistant />
    </main>
  );
}