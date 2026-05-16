import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/learn/QuestionCard";
import BadgeModal from "@/components/learn/BadgeModal";
import SocialShare from "@/components/learn/SocialShare";
import LeaderboardTable from "@/components/learn/LeaderboardTable";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { modules } from "@/data/trivia-data";
import { useTriviaProgress } from "@/hooks/use-trivia-progress";
import { ArrowLeft, BookOpen, ChevronRight, RotateCcw } from "lucide-react";
import { SCORING } from "@/data/badge-data";
import confetti from "canvas-confetti";

const TriviaGame = () => {
  const { moduleNumber, setId } = useParams();
  const navigate = useNavigate();
  const { progress, completeSet, markModuleRead } = useTriviaProgress();

  const modNum = parseInt(moduleNumber || "1");
  const mod = modules.find((m) => m.number === modNum);
  const triviaSet = mod?.sets.find((s) => s.id === setId);

  const [currentQ, setCurrentQ] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streakInSet, setStreakInSet] = useState(0);
  const [timeBonus, setTimeBonus] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [badgeToShow, setBadgeToShow] = useState<string | null>(null);

  const previousBadges = useMemo(() => [...progress.earnedBadges], []);

  const handleAnswer = useCallback(
    (isCorrect: boolean, timeRemaining: number) => {
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        setStreakInSet((s) => s + 1);
        // Time bonus: faster = more points
        const bonus = Math.floor(timeRemaining / 3);
        setTimeBonus((t) => t + bonus);
      } else {
        setStreakInSet(0);
      }

      setTimeout(() => {
        if (triviaSet && currentQ < triviaSet.questions.length - 1) {
          setCurrentQ((q) => q + 1);
        } else {
          setGameOver(true);
        }
      }, 300);
    },
    [currentQ, triviaSet]
  );

  // Calculate final score when game ends
  const finalResult = useMemo(() => {
    if (!gameOver || !triviaSet || !setId) return null;

    const result = completeSet(
      setId,
      correctCount,
      triviaSet.questions.length,
      streakInSet
    );

    // Add time bonus to the display (already tracked client-side)
    const totalWithTime = result.points + timeBonus;

    // Check for new badges
    setTimeout(() => {
      const newBadges = progress.earnedBadges.filter(
        (b) => !previousBadges.includes(b)
      );
      if (newBadges.length > 0) {
        setBadgeToShow(newBadges[0]);
      }
    }, 500);

    return { ...result, totalWithTime };
  }, [gameOver]);

  // Confetti on perfect score
  useEffect(() => {
    if (gameOver && triviaSet && correctCount === triviaSet.questions.length) {
      const duration = 2000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#C84B31", "#F4A261", "#2A9D8F"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#C84B31", "#F4A261", "#2A9D8F"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [gameOver]);

  if (!mod || !triviaSet) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Module or set not found.</p>
          <Button
            onClick={() => navigate("/learn/nigeria")}
            className="mt-4"
          >
            Back to Modules
          </Button>
        </div>
      </Layout>
    );
  }

  const questions = triviaSet.questions;
  const progressPercent = gameOver
    ? 100
    : (currentQ / questions.length) * 100;

  if (gameOver && finalResult) {
    const scorePercent = (correctCount / questions.length) * 100;
    const isPerfect = correctCount === questions.length;

    return (
      <Layout>
        <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
          <div className="container max-w-2xl mx-auto px-4 py-12">
            <div className="text-center animate-fade-in">
              <div className="text-6xl mb-4">
                {isPerfect
                  ? "🏆"
                  : scorePercent >= 70
                  ? "🎉"
                  : scorePercent >= 50
                  ? "👍"
                  : "📚"}
              </div>
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                {isPerfect
                  ? "Perfect Score!"
                  : scorePercent >= 70
                  ? "Great Job!"
                  : scorePercent >= 50
                  ? "Good Effort!"
                  : "Keep Learning!"}
              </h1>
              <p className="text-muted-foreground mb-6">
                {mod.title} — {triviaSet.label}
              </p>

              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {correctCount}/{questions.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">
                      {finalResult.totalWithTime}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Points
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {streakInSet}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Best Streak
                    </div>
                  </div>
                </div>

                {/* Points breakdown */}
                <div className="mt-4 pt-4 border-t border-border text-left text-sm space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      Correct answers ({correctCount} ×{" "}
                      {SCORING.CORRECT_ANSWER})
                    </span>
                    <span>+{correctCount * SCORING.CORRECT_ANSWER}</span>
                  </div>
                  {timeBonus > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>⚡ Speed bonus</span>
                      <span>+{timeBonus}</span>
                    </div>
                  )}
                  {streakInSet >= SCORING.STREAK_THRESHOLD && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Streak bonus</span>
                      <span>
                        +
                        {Math.floor(
                          streakInSet - SCORING.STREAK_THRESHOLD + 1
                        ) * SCORING.STREAK_BONUS}
                      </span>
                    </div>
                  )}
                  {isPerfect && (
                    <div className="flex justify-between text-accent font-medium">
                      <span>Perfect set bonus</span>
                      <span>+{SCORING.PERFECT_SET_BONUS}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    markModuleRead(mod.id);
                    navigate(`/learn/nigeria/module/${modNum}/content`);
                  }}
                  className="gap-2"
                >
                  <BookOpen className="w-4 h-4" /> Read More (+5 pts)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentQ(0);
                    setCorrectCount(0);
                    setStreakInSet(0);
                    setTimeBonus(0);
                    setGameOver(false);
                  }}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Retry
                </Button>
                <Button
                  onClick={() => navigate(`/learn/nigeria/module/${modNum}`)}
                  className="gap-2"
                >
                  Next Set <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Social sharing */}
              <SocialShare
                score={correctCount}
                total={questions.length}
                moduleName={`${mod.title} — ${triviaSet.label}`}
                points={finalResult.totalWithTime}
              />

              {/* Module Leaderboard */}
              <div className="mt-8">
                <LeaderboardTable
                  userScore={progress.totalPoints}
                  username={progress.username}
                  moduleFilter={`module-${modNum}`}
                />
              </div>
            </div>
          </div>
        </section>

        {badgeToShow && (
          <BadgeModal
            badgeId={badgeToShow}
            score={correctCount}
            maxScore={questions.length}
            open={!!badgeToShow}
            onClose={() => setBadgeToShow(null)}
          />
        )}
      </Layout>
    );
  }

  const question = questions[currentQ];

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
        <div className="container max-w-3xl mx-auto px-4 py-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/learn/nigeria/module/${modNum}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Exit
            </Button>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">
                {mod.title}
              </span>
              <span className="text-sm text-muted-foreground ml-2">•</span>
              <span className="text-sm font-medium text-foreground ml-2">
                {triviaSet.label}
              </span>
            </div>
          </div>

          <Progress value={progressPercent} className="h-2 mb-8" />

          {/* Score indicator */}
          <div className="flex justify-between mb-6 text-sm">
            <span className="text-muted-foreground">
              Score:{" "}
              <span className="font-bold text-foreground">
                {correctCount}/{currentQ}
              </span>
            </span>
            {streakInSet >= 3 && (
              <span className="text-accent font-medium animate-fade-in">
                🔥 {streakInSet} streak!
              </span>
            )}
          </div>

          <QuestionCard
            key={question.id}
            questionNumber={currentQ + 1}
            totalQuestions={questions.length}
            text={question.text}
            options={question.options}
            correctIndex={question.correctIndex}
            timeLimit={30}
            onAnswer={handleAnswer}
          />
        </div>
      </section>
    </Layout>
  );
};

export default TriviaGame;
