import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Courses } from "@/components/Courses";
import { Steps } from "@/components/Steps";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans mt-30 selection:bg-primary/30">

      <Hero />
      <Features />
      <Courses />
      <Steps />
      <Pricing />
      <Footer />
    </main>
  );
}
