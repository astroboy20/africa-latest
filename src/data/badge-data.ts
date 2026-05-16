export interface Badge {
  id: string;
  name: string;
  category: "completion" | "perfection" | "streak" | "leaderboard" | "explorer" | "country" | "coming-soon";
  description: string;
  icon: string;
  unlockCondition: string;
}

export const badges: Badge[] = [
  { id: "stone-age-scholar", name: "Stone Age Scholar", category: "completion", description: "Complete Module 1: The Dawn of Humanity (all 3 sets)", icon: "🪨", unlockCondition: "complete_module_1" },
  { id: "ife-apprentice", name: "Ife Apprentice", category: "completion", description: "Complete Module 2: The Cradle of Yoruba (all 3 sets)", icon: "👑", unlockCondition: "complete_module_2" },
  { id: "bronze-master", name: "Bronze Master", category: "completion", description: "Complete Module 3: The Golden Age (all 3 sets)", icon: "🏺", unlockCondition: "complete_module_3" },
  { id: "oyo-warrior", name: "Oyo Warrior", category: "completion", description: "Complete Module 4: The Empire Builders (all 3 sets)", icon: "🐎", unlockCondition: "complete_module_4" },
  { id: "post-colonial-witness", name: "Post-Colonial Witness", category: "completion", description: "Complete Module 5: The Fragmentation (all 3 sets)", icon: "📜", unlockCondition: "complete_module_5" },
  { id: "perfect-bronze", name: "Perfect Set (Bronze)", category: "perfection", description: "Score 10/10 on any trivia set", icon: "🥉", unlockCondition: "perfect_any_1" },
  { id: "perfect-silver", name: "Perfect Set (Silver)", category: "perfection", description: "Score 10/10 on 5 different sets", icon: "🥈", unlockCondition: "perfect_any_5" },
  { id: "perfect-gold", name: "Perfect Set (Gold)", category: "perfection", description: "Score 10/10 on 10 different sets", icon: "🥇", unlockCondition: "perfect_any_10" },
  { id: "on-fire", name: "On Fire", category: "streak", description: "Get 20 correct answers in a row", icon: "🔥", unlockCondition: "streak_20" },
  { id: "unstoppable", name: "Unstoppable", category: "streak", description: "Get 50 correct answers in a row", icon: "⚡", unlockCondition: "streak_50" },
  { id: "top-10-weekly", name: "Top 10 Weekly", category: "leaderboard", description: "Rank in top 10 on any weekly board", icon: "🏆", unlockCondition: "top_10_weekly" },
  { id: "global-1", name: "#1 Global", category: "leaderboard", description: "Rank #1 on Global All-Stars", icon: "👑", unlockCondition: "global_rank_1" },
  { id: "read-all", name: "Read All", category: "explorer", description: 'Click "Read More" on all 5 modules', icon: "📖", unlockCondition: "read_all_modules" },
  { id: "nigeria-expert", name: "Nigeria Expert", category: "country", description: "Complete all Nigeria modules", icon: "🇳🇬", unlockCondition: "complete_nigeria" },
  { id: "pan-africanist", name: "Pan-Africanist", category: "coming-soon", description: "Complete Nigeria + 1 other country", icon: "🌍", unlockCondition: "complete_multi_country" },
];

export const SCORING = {
  CORRECT_ANSWER: 10,
  STREAK_BONUS: 5,
  STREAK_THRESHOLD: 5,
  PERFECT_SET_BONUS: 20,
  FIRST_COMPLETION_BONUS: 15,
  READ_MORE_BONUS: 5,
} as const;
