import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ModuleCard from "@/components/learn/ModuleCard";
import { Button } from "@/components/ui/button";
import { modules, countries } from "@/data/trivia-data";
import { useTriviaProgress } from "@/hooks/use-trivia-progress";
import { ArrowLeft, Lock, ChevronRight } from "lucide-react";
import module1Img from "@/assets/learn/module1-header.jpg";
import module2Img from "@/assets/learn/module2-header.jpg";
import module3Img from "@/assets/learn/module3-header.jpg";
import module4Img from "@/assets/learn/module4-header.jpg";
import module5Img from "@/assets/learn/module5-header.jpg";

const moduleImages: Record<number, string> = {
  1: module1Img,
  2: module2Img,
  3: module3Img,
  4: module4Img,
  5: module5Img,
};

const CountryDashboard = () => {
  const navigate = useNavigate();
  const { progress, getModuleProgress } = useTriviaProgress();
  const [selectedZone, setSelectedZone] = useState<string | null>("south-west");
  const [selectedEra, setSelectedEra] = useState<string>("pre-colonial");

  const country = countries.find((c) => c.id === "nigeria")!;
  const eras = country.eras;

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          {/* Back button */}
          <Button variant="ghost" onClick={() => navigate("/learn")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Map
          </Button>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            🇳🇬 Nigeria
          </h1>
          <p className="text-muted-foreground mb-8">
            Explore the rich pre-colonial history of Nigeria's geopolitical zones.
          </p>

          {/* Geopolitical Zones */}
          <div className="mb-8">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">Geopolitical Zone</h2>
            <div className="flex flex-wrap gap-2">
              {country.zones.map((zone) => (
                <Button
                  key={zone.id}
                  variant={selectedZone === zone.id ? "default" : "outline"}
                  size="sm"
                  disabled={!zone.active}
                  onClick={() => zone.active && setSelectedZone(zone.id)}
                  className="gap-1"
                >
                  {!zone.active && <Lock className="w-3 h-3" />}
                  {zone.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Era Selector */}
          <div className="mb-8">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">Chronological Era</h2>
            <div className="flex items-center gap-1 bg-card p-1 rounded-lg border border-border w-fit">
              {eras.map((era, i) => (
                <div key={era.id} className="flex items-center">
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedEra === era.id
                        ? "bg-primary text-primary-foreground"
                        : era.locked
                        ? "text-muted-foreground/50 cursor-not-allowed"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    disabled={era.locked}
                    onClick={() => !era.locked && setSelectedEra(era.id)}
                  >
                    {era.locked && <Lock className="w-3 h-3 inline mr-1" />}
                    {era.name}
                  </button>
                  {i < eras.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Module Grid */}
          {selectedZone === "south-west" && selectedEra === "pre-colonial" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((mod) => {
                const modProgress = getModuleProgress(mod.id);
                return (
                  <ModuleCard
                    key={mod.id}
                    module={mod}
                    completedSets={modProgress.completed}
                    totalSets={modProgress.total}
                    onClick={() => navigate(`/learn/nigeria/module/${mod.number}`)}
                    imageUrl={moduleImages[mod.number]}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Lock className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">Content Coming Soon</p>
              <p className="text-sm">This zone and era will be unlocked in future updates.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CountryDashboard;
