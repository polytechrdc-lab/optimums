import Hero from "@/components/Hero";
import PostHero from "@/components/PostHero";
import WelcomeHealth from "@/components/WelcomeHealth";
import Realisations from "@/components/Realisations";
import Carriere from "@/components/Carriere";
import InterSectionParallax from "@/components/InterSectionParallax";
import WhereWeOperate from "@/components/WhereWeOperate";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <PostHero />
      <WelcomeHealth />
      <InterSectionParallax />
      <Realisations />
      <Carriere />
      <WhereWeOperate />
    </div>
  );
}

