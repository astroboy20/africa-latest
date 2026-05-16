import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTriviaProgress } from "@/hooks/use-trivia-progress";
import { Trophy, BookOpen, Flame, MapPin } from "lucide-react";

const countries = [
  { id: "nigeria", name: "Nigeria", active: true, description: "Southwest Nigeria — Pre-Colonial Era" },
  { id: "ghana", name: "Ghana", active: false, description: "Ashanti Kingdom & Gold Coast" },
  { id: "egypt", name: "Egypt", active: false, description: "Ancient Kingdoms of the Nile" },
  { id: "ethiopia", name: "Ethiopia", active: false, description: "The Solomonic Dynasty" },
  { id: "kenya", name: "Kenya", active: false, description: "Swahili Coast & Trade Routes" },
  { id: "south-africa", name: "South Africa", active: false, description: "Zulu Kingdom & Beyond" },
  { id: "mali", name: "Mali", active: false, description: "Empire of Mali & Mansa Musa" },
  { id: "senegal", name: "Senegal", active: false, description: "Jolof Empire & French West Africa" },
  { id: "tanzania", name: "Tanzania", active: false, description: "Kilwa Sultanate & Great Zimbabwe Trade" },
  { id: "drc", name: "DR Congo", active: false, description: "Kingdom of Kongo" },
  { id: "morocco", name: "Morocco", active: false, description: "Berber Dynasties & Al-Andalus" },
  { id: "zimbabwe", name: "Zimbabwe", active: false, description: "Great Zimbabwe & Mutapa Empire" },
];

const Learn = () => {
  const navigate = useNavigate();
  const { progress, setUsername } = useTriviaProgress();
  const [showNameInput, setShowNameInput] = useState(!progress.username);
  const [nameValue, setNameValue] = useState("");

  const handleCountrySelect = (countryId: string) => {
    if (countryId === "nigeria") {
      navigate("/learn/nigeria");
    }
  };

  const handleSetName = () => {
    if (nameValue.trim()) {
      setUsername(nameValue.trim());
      setShowNameInput(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
              Africa Learning Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test your knowledge of African pre-colonial history through interactive trivia.
              Earn badges, climb leaderboards, and discover the untold stories.
            </p>
          </div>

          {/* Username prompt */}
          {showNameInput && (
            <div className="max-w-md mx-auto mb-10 bg-card p-6 rounded-xl shadow-sm border border-border animate-scale-in">
              <h2 className="font-heading text-lg font-bold mb-3 text-foreground">Choose Your Scholar Name</h2>
              <div className="flex gap-2">
                <Input
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  placeholder="Enter your name..."
                  onKeyDown={(e) => e.key === "Enter" && handleSetName()}
                />
                <Button onClick={handleSetName} disabled={!nameValue.trim()}>
                  Start
                </Button>
              </div>
            </div>
          )}

          {/* Stats bar */}
          {progress.username && (
            <div className="flex flex-wrap justify-center gap-6 mb-10 animate-fade-in">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border">
                <Trophy className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{progress.totalPoints} points</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{progress.earnedBadges.length} badges</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border">
                <Flame className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium">{progress.bestStreak} best streak</span>
              </div>
            </div>
          )}

          {/* Country Selection */}
          <div className="text-center mb-6">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
              Select a Country
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose a country to explore its history. More countries coming soon!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => country.active && handleCountrySelect(country.id)}
                disabled={!country.active}
                className={`group relative p-5 rounded-xl border text-left transition-all duration-200 ${
                  country.active
                    ? "bg-card border-primary/40 hover:border-primary hover:shadow-md cursor-pointer"
                    : "bg-muted/30 border-border opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className={`w-5 h-5 mt-0.5 shrink-0 ${country.active ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <h3 className={`font-heading font-bold text-base ${country.active ? "text-foreground" : "text-muted-foreground"}`}>
                      {country.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{country.description}</p>
                    {!country.active && (
                      <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 bg-muted px-2 py-0.5 rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" onClick={() => navigate("/learn/badges")}>
              🎖️ Badge Gallery
            </Button>
            <Button variant="outline" onClick={() => navigate("/learn/leaderboard")}>
              🏆 Leaderboard
            </Button>
            <Button variant="outline" onClick={() => navigate("/learn/nigeria")}>
              📚 Modules
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Learn;
