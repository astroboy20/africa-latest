import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { badges as allBadges } from "@/data/badge-data";
import { useTriviaProgress } from "@/hooks/use-trivia-progress";
import { ArrowLeft, Lock } from "lucide-react";

const BadgeGallery = () => {
  const navigate = useNavigate();
  const { progress } = useTriviaProgress();

  const categories = [
    { key: "completion", label: "Completion" },
    { key: "perfection", label: "Perfection" },
    { key: "streak", label: "Streak" },
    { key: "leaderboard", label: "Leaderboard" },
    { key: "explorer", label: "Explorer" },
    { key: "country", label: "Country" },
    { key: "coming-soon", label: "Coming Soon" },
  ];

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate("/learn")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </Button>

          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">🎖️ Badge Gallery</h1>
          <p className="text-muted-foreground mb-8">
            {progress.earnedBadges.length} of {allBadges.length} badges earned
          </p>

          {categories.map((cat) => {
            const catBadges = allBadges.filter((b) => b.category === cat.key);
            if (catBadges.length === 0) return null;

            return (
              <div key={cat.key} className="mb-8">
                <h2 className="font-heading text-lg font-bold text-foreground mb-3">{cat.label}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {catBadges.map((badge) => {
                    const earned = progress.earnedBadges.includes(badge.id);
                    return (
                      <Card
                        key={badge.id}
                        className={`text-center transition-all ${
                          earned ? "border-accent/50 bg-accent/5" : "opacity-50"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className={`text-4xl mb-2 ${earned ? "" : "grayscale"}`}>
                            {earned ? badge.icon : <Lock className="w-8 h-8 mx-auto text-muted-foreground" />}
                          </div>
                          <h3 className="text-sm font-bold text-foreground">{badge.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default BadgeGallery;
