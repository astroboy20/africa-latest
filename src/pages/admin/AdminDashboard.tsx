import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminGuard from "@/components/admin/AdminGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Trophy,
  BookOpen,
  LogOut,
  ChevronRight,
  Upload,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import AdminModuleUpload from "@/components/admin/AdminModuleUpload";
import logoImg from "@/assets/logo.jpg";

interface PlayerRow {
  id: string;
  username: string;
  email: string | null;
  total_points: number;
  best_streak: number;
  current_streak: number;
  created_at: string;
  sets_completed?: number;
  badges_earned?: number;
}

interface PlayerDetail {
  player: PlayerRow;
  completedSets: {
    set_id: string;
    score: number;
    total: number;
    perfect: boolean;
    points: number;
    completed_at: string;
  }[];
  badges: { badge_id: string; earned_at: string }[];
  modulesRead: { module_id: string; read_at: string }[];
}

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const SkeletonRow = () => (
  <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
    <div className="w-6 h-4 bg-muted rounded shrink-0" />
    <div className="flex-1 h-4 bg-muted rounded" />
    <div className="w-16 h-4 bg-muted rounded shrink-0" />
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [tab, setTab] = useState("overview");
  // On mobile, show detail panel instead of list when a player is selected
  const [showDetailMobile, setShowDetailMobile] = useState(false);

  const totalPoints = players.reduce((s, p) => s + p.total_points, 0);
  const totalSets = players.reduce((s, p) => s + (p.sets_completed || 0), 0);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .order("total_points", { ascending: false });

    if (!profileData) {
      setLoading(false);
      return;
    }

    const enriched = await Promise.all(
      profileData.map(async (p) => {
        const { count: setsCount } = await supabase
          .from("completed_sets")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", p.id);
        const { count: badgesCount } = await supabase
          .from("earned_badges")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", p.id);
        return {
          ...p,
          sets_completed: setsCount || 0,
          badges_earned: badgesCount || 0,
        } as PlayerRow;
      })
    );

    setPlayers(enriched);
    setLoading(false);
  };

  const fetchPlayerDetail = async (player: PlayerRow) => {
    setLoadingDetail(true);
    setSelectedPlayer(null);
    setShowDetailMobile(true);

    const [{ data: sets }, { data: badges }, { data: modules }] =
      await Promise.all([
        supabase
          .from("completed_sets")
          .select("*")
          .eq("profile_id", player.id)
          .order("completed_at", { ascending: false }),
        supabase
          .from("earned_badges")
          .select("*")
          .eq("profile_id", player.id)
          .order("earned_at", { ascending: false }),
        supabase
          .from("modules_read")
          .select("*")
          .eq("profile_id", player.id),
      ]);

    setSelectedPlayer({
      player,
      completedSets: sets || [],
      badges: badges || [],
      modulesRead: modules || [],
    });
    setLoadingDetail(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const PlayerDetailPanel = () => {
    if (loadingDetail) {
      return (
        <Card>
          <CardContent className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </CardContent>
        </Card>
      );
    }

    if (!selectedPlayer) {
      return (
        <div className="hidden md:flex items-center justify-center h-48 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
          Select a player to view their progress
        </div>
      );
    }

    return (
      <Card>
        <CardHeader className="pb-3">
          {/* Back button — mobile only */}
          <button
            className="md:hidden flex items-center gap-1 text-sm text-muted-foreground mb-2 -mt-1"
            onClick={() => setShowDetailMobile(false)}
          >
            <ArrowLeft className="w-4 h-4" /> Back to players
          </button>
          <CardTitle className="text-base">{selectedPlayer.player.username}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {selectedPlayer.player.email || "No email"} • Joined{" "}
            {new Date(selectedPlayer.player.created_at).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Points", value: selectedPlayer.player.total_points },
              { label: "Best Streak", value: selectedPlayer.player.best_streak },
              { label: "Badges", value: selectedPlayer.badges.length },
            ].map((s) => (
              <div key={s.label} className="bg-muted/50 rounded-lg p-3">
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Module progress — derived from completed sets */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Module Progress
            </h4>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((m) => {
                const sets = ["A", "B", "C"].map((s) => `M${m}-${s}`);
                const done = sets.filter((sid) =>
                  selectedPlayer.completedSets.some((cs) => cs.set_id === sid)
                ).length;
                const pct = Math.round((done / 3) * 100);
                return (
                  <div key={m}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Module {m}</span>
                      <span>{done}/3 sets</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completed sets */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Completed Sets ({selectedPlayer.completedSets.length})
            </h4>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {selectedPlayer.completedSets.length === 0 ? (
                <p className="text-xs text-muted-foreground">None yet</p>
              ) : (
                selectedPlayer.completedSets.map((s) => (
                  <div
                    key={s.set_id}
                    className="flex items-center gap-2 text-xs bg-muted/30 rounded px-3 py-2"
                  >
                    <span className="font-mono font-medium flex-1">{s.set_id}</span>
                    <span>{s.score}/{s.total}</span>
                    {s.perfect && (
                      <span className="text-accent">⭐</span>
                    )}
                    <span className="text-muted-foreground">+{s.points}pts</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Badges */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Badges ({selectedPlayer.badges.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedPlayer.badges.length === 0 ? (
                <p className="text-xs text-muted-foreground">None yet</p>
              ) : (
                selectedPlayer.badges.map((b) => (
                  <Badge key={b.badge_id} variant="secondary" className="text-xs">
                    {b.badge_id}
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Modules read */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Modules Read ({selectedPlayer.modulesRead.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedPlayer.modulesRead.length === 0 ? (
                <p className="text-xs text-muted-foreground">None yet</p>
              ) : (
                selectedPlayer.modulesRead.map((m) => (
                  <Badge key={m.module_id} variant="outline" className="text-xs">
                    {m.module_id}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border px-4 md:px-6 py-2 flex items-center justify-between">
          <img src={logoImg} alt="Africa Retold" className="h-9 w-auto object-contain" />
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </header>

        <main className="container max-w-6xl mx-auto px-3 md:px-4 py-6">
          <Tabs value={tab} onValueChange={setTab}>
            {/* Scrollable tabs on mobile */}
            <div className="overflow-x-auto mb-6 -mx-3 px-3 md:mx-0 md:px-0">
              <TabsList className="inline-flex w-auto min-w-full md:min-w-0">
                <TabsTrigger value="overview" className="gap-1.5 text-xs md:text-sm whitespace-nowrap">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="players" className="gap-1.5 text-xs md:text-sm whitespace-nowrap">
                  <Users className="w-3.5 h-3.5" />
                  <span>Players</span>
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="gap-1.5 text-xs md:text-sm whitespace-nowrap">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Leaderboard</span>
                </TabsTrigger>
                <TabsTrigger value="modules" className="gap-1.5 text-xs md:text-sm whitespace-nowrap">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* OVERVIEW */}
            <TabsContent value="overview">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <StatCard icon={Users} label="Total Players" value={loading ? "—" : players.length} />
                <StatCard icon={Trophy} label="Points Earned" value={loading ? "—" : totalPoints.toLocaleString()} />
                <StatCard icon={BookOpen} label="Sets Completed" value={loading ? "—" : totalSets} />
                <StatCard
                  icon={TrendingUp}
                  label="Avg Points"
                  value={loading || players.length === 0 ? "—" : Math.round(totalPoints / players.length)}
                />
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm md:text-base">Top 5 Players</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loading
                    ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                    : players.slice(0, 5).map((p, i) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
                          onClick={() => { setTab("players"); fetchPlayerDetail(p); }}
                        >
                          <span className="w-6 text-sm font-bold text-muted-foreground shrink-0">
                            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                          </span>
                          <span className="flex-1 font-medium text-sm text-foreground truncate">
                            {p.username}
                          </span>
                          <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-[140px]">
                            {p.email || "—"}
                          </span>
                          <span className="text-sm font-bold text-foreground shrink-0">
                            {p.total_points.toLocaleString()} pts
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </div>
                      ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* PLAYERS */}
            <TabsContent value="players">
              {/* Mobile: show either list or detail */}
              <div className="md:hidden">
                {!showDetailMobile ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        All Players
                        <Badge variant="secondary">{players.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {loading
                        ? [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                        : players.map((p, i) => (
                            <div
                              key={p.id}
                              onClick={() => fetchPlayerDetail(p)}
                              className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-muted/40 transition-colors"
                            >
                              <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">{i + 1}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{p.username}</p>
                                <p className="text-xs text-muted-foreground truncate">{p.email || "No email"}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-bold text-foreground">{p.total_points} pts</p>
                                <p className="text-xs text-muted-foreground">{p.sets_completed} sets</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                            </div>
                          ))}
                    </CardContent>
                  </Card>
                ) : (
                  <PlayerDetailPanel />
                )}
              </div>

              {/* Desktop: side by side */}
              <div className="hidden md:grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      All Players
                      <Badge variant="secondary">{players.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                    {loading
                      ? [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
                      : players.map((p, i) => (
                          <div
                            key={p.id}
                            onClick={() => fetchPlayerDetail(p)}
                            className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-muted/40 ${
                              selectedPlayer?.player.id === p.id
                                ? "bg-primary/5 border-l-2 border-l-primary"
                                : ""
                            }`}
                          >
                            <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{p.username}</p>
                              <p className="text-xs text-muted-foreground truncate">{p.email || "No email"}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-bold text-foreground">{p.total_points} pts</p>
                              <p className="text-xs text-muted-foreground">{p.sets_completed} sets</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          </div>
                        ))}
                  </CardContent>
                </Card>
                <PlayerDetailPanel />
              </div>
            </TabsContent>

            {/* LEADERBOARD */}
            <TabsContent value="leaderboard">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm md:text-base">Global Leaderboard</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Scrollable table wrapper */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] text-sm">
                      <thead>
                        <tr className="bg-muted/50 text-xs text-muted-foreground font-semibold border-b border-border">
                          <th className="text-left px-4 py-2 w-10">#</th>
                          <th className="text-left px-4 py-2">Player</th>
                          <th className="text-left px-4 py-2 hidden sm:table-cell">Email</th>
                          <th className="text-right px-4 py-2">Points</th>
                          <th className="text-right px-4 py-2 hidden md:table-cell">Sets</th>
                          <th className="text-right px-4 py-2 hidden md:table-cell">Badges</th>
                          <th className="text-right px-4 py-2">Streak</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading
                          ? [...Array(8)].map((_, i) => (
                              <tr key={i} className="border-b border-border animate-pulse">
                                <td className="px-4 py-3"><div className="h-4 w-4 bg-muted rounded" /></td>
                                <td className="px-4 py-3"><div className="h-4 w-24 bg-muted rounded" /></td>
                                <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 w-32 bg-muted rounded" /></td>
                                <td className="px-4 py-3"><div className="h-4 w-12 bg-muted rounded ml-auto" /></td>
                                <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-8 bg-muted rounded ml-auto" /></td>
                                <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-8 bg-muted rounded ml-auto" /></td>
                                <td className="px-4 py-3"><div className="h-4 w-10 bg-muted rounded ml-auto" /></td>
                              </tr>
                            ))
                          : players.map((p, i) => (
                              <tr
                                key={p.id}
                                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                              >
                                <td className="px-4 py-3 font-bold text-muted-foreground">
                                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                                </td>
                                <td className="px-4 py-3 font-medium text-foreground">{p.username}</td>
                                <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell max-w-[160px] truncate">
                                  {p.email || "—"}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-foreground">
                                  {p.total_points.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                                  {p.sets_completed}
                                </td>
                                <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                                  {p.badges_earned}
                                </td>
                                <td className="px-4 py-3 text-right text-muted-foreground">
                                  🔥 {p.best_streak}
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* UPLOAD MODULE */}
            <TabsContent value="modules">
              <AdminModuleUpload />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboard;
