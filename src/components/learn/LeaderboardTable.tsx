import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  badges_earned: number;
}

interface LeaderboardTableProps {
  userScore?: number;
  username?: string;
  moduleFilter?: string;
}

const getRankStyle = (rank: number) => {
  if (rank === 1) return "text-accent font-bold";
  if (rank === 2) return "text-muted-foreground font-semibold";
  if (rank === 3) return "text-copper font-semibold";
  return "";
};

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="text-sm text-muted-foreground font-medium">{rank}</span>;
};

const LeaderboardTable = ({ userScore, username, moduleFilter }: LeaderboardTableProps) => {
  const [globalEntries, setGlobalEntries] = useState<LeaderboardEntry[]>([]);
  const [moduleEntries, setModuleEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(moduleFilter ? "module" : "global");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Global leaderboard
        const { data: globalData } = await supabase
          .from("leaderboard")
          .select("*")
          .limit(20);

        if (globalData && globalData.length > 0) {
          setGlobalEntries(
            globalData.map((row: any, i: number) => ({
              rank: i + 1,
              username: row.username,
              score: row.total_points,
              badges_earned: row.badges_earned || 0,
            }))
          );
        } else {
          setGlobalEntries(getMockData());
        }

        // Module leaderboard (if filter provided)
        if (moduleFilter) {
          const { data: modData } = await supabase
            .from("completed_sets")
            .select("profile_id, points, profiles!completed_sets_profile_id_fkey(username)")
            .like("set_id", `${moduleFilter}%`)
            .order("points", { ascending: false })
            .limit(20);

          if (modData && modData.length > 0) {
            // Aggregate by profile
            const agg = new Map<string, { username: string; total: number }>();
            modData.forEach((row: any) => {
              const pid = row.profile_id;
              const existing = agg.get(pid);
              const uname = row.profiles?.username || "Unknown";
              if (existing) {
                existing.total += row.points;
              } else {
                agg.set(pid, { username: uname, total: row.points });
              }
            });
            const sorted = Array.from(agg.values())
              .sort((a, b) => b.total - a.total)
              .map((e, i) => ({
                rank: i + 1,
                username: e.username,
                score: e.total,
                badges_earned: 0,
              }));
            setModuleEntries(sorted);
          }
        }
      } catch {
        setGlobalEntries(getMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [userScore, moduleFilter]);

  const getMockData = (): LeaderboardEntry[] => [
    { rank: 1, username: "HistorianKing", score: 950, badges_earned: 3 },
    { rank: 2, username: "YorubaWarrior", score: 890, badges_earned: 2 },
    { rank: 3, username: "IfeExplorer", score: 820, badges_earned: 1 },
    { rank: 4, username: "OyoScholar", score: 780, badges_earned: 1 },
    { rank: 5, username: "AbujaReader", score: 720, badges_earned: 0 },
    { rank: 6, username: "DiasporaStar", score: 690, badges_earned: 0 },
    { rank: 7, username: "LagosLearner", score: 650, badges_earned: 0 },
    { rank: 8, username: "NaijaQuiz", score: 580, badges_earned: 0 },
    { rank: 9, username: "AccraAce", score: 550, badges_earned: 0 },
    { rank: 10, username: "IfeMaster", score: 520, badges_earned: 0 },
  ];

  const renderList = (entries: LeaderboardEntry[]) => (
    <div className="space-y-1">
      {entries.map((entry) => (
        <div
          key={entry.rank}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
            entry.username === username
              ? "bg-primary/10 border border-primary/20"
              : "hover:bg-muted/50"
          }`}
        >
          <div className="w-8 text-center">
            <RankBadge rank={entry.rank} />
          </div>
          <div className="flex-1">
            <span className={`text-sm ${getRankStyle(entry.rank)}`}>
              {entry.username}
            </span>
            {entry.badges_earned > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                🎖️ {entry.badges_earned}
              </span>
            )}
          </div>
          <span className="text-sm font-bold text-foreground">
            {entry.score.toLocaleString()} pts
          </span>
        </div>
      ))}

      {entries.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">No scores yet. Be the first!</p>
      )}

      {username && userScore !== undefined && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 bg-primary/5 rounded-lg">
            <span className="text-sm text-muted-foreground">Your rank</span>
            <span className="flex-1 text-sm font-medium">{username}</span>
            <span className="text-sm font-bold">{userScore.toLocaleString()} pts</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-xl">🏆 Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading leaderboard...</div>
        ) : moduleFilter ? (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="module">This Module</TabsTrigger>
              <TabsTrigger value="global">Global</TabsTrigger>
            </TabsList>
            <TabsContent value="module">
              {renderList(moduleEntries)}
            </TabsContent>
            <TabsContent value="global">
              {renderList(globalEntries)}
            </TabsContent>
          </Tabs>
        ) : (
          renderList(globalEntries)
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
