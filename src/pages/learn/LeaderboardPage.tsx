import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import LeaderboardTable from "@/components/learn/LeaderboardTable";
import { Button } from "@/components/ui/button";
import { useTriviaProgress } from "@/hooks/use-trivia-progress";
import { ArrowLeft } from "lucide-react";

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { progress } = useTriviaProgress();

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate("/learn")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </Button>

          <h1 className="font-heading text-3xl font-bold text-foreground mb-6">🏆 Leaderboard</h1>

          <LeaderboardTable
            userScore={progress.totalPoints}
            username={progress.username}
          />

          <p className="text-xs text-muted-foreground text-center mt-6">
            Live leaderboards coming soon with cloud integration. Currently showing mock data.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default LeaderboardPage;
