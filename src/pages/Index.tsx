import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import ProgramsOverview from "@/components/ProgramsOverview";
import ContentEcosystem from "@/components/ContentEcosystem";
import CommunitySection from "@/components/CommunitySection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <MissionSection />
      <ProgramsOverview />
      <ContentEcosystem />
      <CommunitySection />
    </Layout>
  );
};

export default Index;
