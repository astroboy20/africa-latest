import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  id: string;
  username: string;
  total_points: number;
  current_streak: number;
  best_streak: number;
}

export async function getOrCreateProfile(username: string): Promise<ProfileData | null> {
  // Try to find existing profile
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (existing) return existing as ProfileData;

  // Create new profile
  const { data: created, error } = await supabase
    .from("profiles")
    .insert({ username, total_points: 0, current_streak: 0, best_streak: 0 })
    .select()
    .single();

  if (error) {
    console.error("Error creating profile:", error);
    return null;
  }

  return created as ProfileData;
}

export async function syncProgressToCloud(
  profileId: string,
  totalPoints: number,
  currentStreak: number,
  bestStreak: number,
  completedSets: Record<string, { score: number; total: number; perfect: boolean; points: number }>,
  earnedBadges: string[],
  modulesRead: string[]
) {
  try {
    // Update profile points
    await supabase
      .from("profiles")
      .update({ total_points: totalPoints, current_streak: currentStreak, best_streak: bestStreak })
      .eq("id", profileId);

    // Upsert completed sets
    for (const [setId, result] of Object.entries(completedSets)) {
      await supabase
        .from("completed_sets")
        .upsert(
          {
            profile_id: profileId,
            set_id: setId,
            score: result.score,
            total: result.total,
            perfect: result.perfect,
            points: result.points,
          },
          { onConflict: "profile_id,set_id" }
        );
    }

    // Insert earned badges (ignore duplicates)
    for (const badgeId of earnedBadges) {
      await supabase
        .from("earned_badges")
        .upsert(
          { profile_id: profileId, badge_id: badgeId },
          { onConflict: "profile_id,badge_id" }
        );
    }

    // Insert modules read (ignore duplicates)
    for (const moduleId of modulesRead) {
      await supabase
        .from("modules_read")
        .upsert(
          { profile_id: profileId, module_id: moduleId },
          { onConflict: "profile_id,module_id" }
        );
    }
  } catch (error) {
    console.error("Error syncing to cloud:", error);
  }
}
