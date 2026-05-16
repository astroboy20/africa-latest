import { useState, useCallback, useEffect, useRef } from "react";
import { SCORING } from "@/data/badge-data";
import { getOrCreateProfile, syncProgressToCloud } from "@/lib/cloud-sync";

interface SetResult {
  score: number;
  total: number;
  perfect: boolean;
  completedAt: string;
  points: number;
}

interface UserProgress {
  username: string;
  profileId: string | null;
  totalPoints: number;
  completedSets: Record<string, SetResult>;
  earnedBadges: string[];
  currentStreak: number;
  bestStreak: number;
  perfectSets: string[];
  modulesRead: string[];
}

const STORAGE_KEY = "africa-learning-hub-progress";

const defaultProgress: UserProgress = {
  username: "",
  profileId: null,
  totalPoints: 0,
  completedSets: {},
  earnedBadges: [],
  currentStreak: 0,
  bestStreak: 0,
  perfectSets: [],
  modulesRead: [],
};

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultProgress };
}

function saveProgress(p: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function checkBadges(p: UserProgress): string[] {
  const earned: string[] = [];
  for (let m = 1; m <= 5; m++) {
    const prefix = `M${m}`;
    const allSets = ["A", "B", "C"].every((s) => !!p.completedSets[`${prefix}-${s}`]);
    if (allSets) {
      const badgeId = [
        "stone-age-scholar", "ife-apprentice", "bronze-master",
        "oyo-warrior", "post-colonial-witness",
      ][m - 1];
      earned.push(badgeId);
    }
  }
  if (p.perfectSets.length >= 1) earned.push("perfect-bronze");
  if (p.perfectSets.length >= 5) earned.push("perfect-silver");
  if (p.perfectSets.length >= 10) earned.push("perfect-gold");
  if (p.bestStreak >= 20) earned.push("on-fire");
  if (p.bestStreak >= 50) earned.push("unstoppable");
  if (p.modulesRead.length >= 5) earned.push("read-all");
  const allModules = [1, 2, 3, 4, 5].every((m) => {
    const prefix = `M${m}`;
    return ["A", "B", "C"].every((s) => !!p.completedSets[`${prefix}-${s}`]);
  });
  if (allModules) earned.push("nigeria-expert");
  return earned;
}

export function useTriviaProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const syncTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    saveProgress(progress);
    // Debounced cloud sync
    if (progress.profileId) {
      clearTimeout(syncTimeout.current);
      syncTimeout.current = setTimeout(() => {
        syncProgressToCloud(
          progress.profileId!,
          progress.totalPoints,
          progress.currentStreak,
          progress.bestStreak,
          Object.fromEntries(
            Object.entries(progress.completedSets).map(([k, v]) => [
              k,
              { score: v.score, total: v.total, perfect: v.perfect, points: v.points },
            ])
          ),
          progress.earnedBadges,
          progress.modulesRead
        );
      }, 2000);
    }
  }, [progress]);

  const setUsername = useCallback(async (name: string) => {
    const profile = await getOrCreateProfile(name);
    setProgress((p) => ({
      ...p,
      username: name,
      profileId: profile?.id || null,
    }));
  }, []);

  const calculateSetScore = useCallback(
    (setId: string, correctAnswers: number, totalQuestions: number, streakInSet: number) => {
      let points = correctAnswers * SCORING.CORRECT_ANSWER;
      const perfect = correctAnswers === totalQuestions;
      if (streakInSet >= SCORING.STREAK_THRESHOLD) {
        const streakBonuses = Math.floor(streakInSet - SCORING.STREAK_THRESHOLD + 1);
        points += streakBonuses * SCORING.STREAK_BONUS;
      }
      if (perfect) points += SCORING.PERFECT_SET_BONUS;
      const isFirstTime = !progress.completedSets[setId];
      if (isFirstTime) points += SCORING.FIRST_COMPLETION_BONUS;
      return { points, perfect, isFirstTime };
    },
    [progress.completedSets]
  );

  const completeSet = useCallback(
    (setId: string, correctAnswers: number, totalQuestions: number, streakInSet: number) => {
      const { points, perfect } = calculateSetScore(setId, correctAnswers, totalQuestions, streakInSet);
      setProgress((p) => {
        const newCompletedSets = {
          ...p.completedSets,
          [setId]: {
            score: correctAnswers,
            total: totalQuestions,
            perfect,
            completedAt: new Date().toISOString(),
            points,
          },
        };
        const newPerfectSets = perfect && !p.perfectSets.includes(setId)
          ? [...p.perfectSets, setId]
          : p.perfectSets;
        const newStreak = p.currentStreak + correctAnswers;
        const newBestStreak = Math.max(p.bestStreak, newStreak);
        const newProgress: UserProgress = {
          ...p,
          totalPoints: p.totalPoints + points,
          completedSets: newCompletedSets,
          perfectSets: newPerfectSets,
          currentStreak: correctAnswers === totalQuestions ? newStreak : correctAnswers,
          bestStreak: newBestStreak,
        };
        const newBadges = checkBadges(newProgress);
        newProgress.earnedBadges = [...new Set([...p.earnedBadges, ...newBadges])];
        return newProgress;
      });
      return { points, perfect };
    },
    [calculateSetScore]
  );

  const markModuleRead = useCallback((moduleId: string) => {
    setProgress((p) => {
      if (p.modulesRead.includes(moduleId)) return p;
      const updated = {
        ...p,
        modulesRead: [...p.modulesRead, moduleId],
        totalPoints: p.totalPoints + SCORING.READ_MORE_BONUS,
      };
      const newBadges = checkBadges(updated);
      updated.earnedBadges = [...new Set([...p.earnedBadges, ...newBadges])];
      return updated;
    });
  }, []);

  const isSetCompleted = useCallback(
    (setId: string) => !!progress.completedSets[setId],
    [progress.completedSets]
  );

  const getModuleProgress = useCallback(
    (moduleId: string) => {
      const sets = ["A", "B", "C"];
      const prefix = moduleId.split("-").pop();
      const completed = sets.filter((s) => {
        const key = `${prefix}-${s}`;
        return !!progress.completedSets[key];
      });
      return { completed: completed.length, total: sets.length };
    },
    [progress.completedSets]
  );

  const getNewBadges = useCallback(
    (previousBadges: string[]) => {
      return progress.earnedBadges.filter((b) => !previousBadges.includes(b));
    },
    [progress.earnedBadges]
  );

  const resetProgress = useCallback(() => {
    setProgress({ ...defaultProgress });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    progress,
    setUsername,
    completeSet,
    markModuleRead,
    isSetCompleted,
    getModuleProgress,
    getNewBadges,
    resetProgress,
    calculateSetScore,
  };
}
