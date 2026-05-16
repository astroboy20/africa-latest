
## Phase 1: Africa Learning Hub — Core Trivia Flow

### Route: `/learn` (integrated with existing site navbar/footer)

### What we'll build:

**1. Data Layer**
- Hardcode all 150 questions across 5 modules × 3 sets in a TypeScript data file
- Module metadata (titles, descriptions, image themes)
- Badge definitions and unlock conditions
- localStorage for user progress, scores, and badge tracking

**2. Interactive SVG Africa Map (Splash)**
- Clickable SVG map of Africa at `/learn`
- Nigeria highlighted as active/clickable
- Ghana, Kenya, Rwanda, South Africa greyed out with "Coming Soon" tooltip
- All other countries dimmed

**3. Navigation Flow (6 screens)**
- **Country Dashboard** → Geopolitical zones for Nigeria (6 zones, only South-West active for now)
- **Era Selector** → Horizontal slider: Pre-Colonial (active), Colonial & Post-Colonial (locked)
- **Module Select** → 5 module cards with progress indicators and generated header images
- **Set Select** → 3 sets per module (A, B, C) with completion status
- **Trivia Game** → One question at a time, 4 options, progress bar, score counter
- **Results Screen** → Score breakdown, streak bonuses, perfect set bonus, "Read More" links

**4. Scoring System (localStorage)**
- +10 per correct answer
- +5 streak bonus (5+ in a row)
- +20 perfect set bonus (10/10)
- +15 first-time completion bonus
- Track total points, per-module progress, completed sets

**5. Badge System**
- 15 badge types (completion, perfection, streak, explorer)
- Animated badge reveal modal on unlock
- Badge gallery page showing earned vs locked
- Social share card template (WhatsApp, Twitter/X text ready)

**6. Images**
- Generate 5 module header images (African history themed)
- Module-themed question backgrounds

**7. Leaderboard (Mock)**
- Display mock leaderboard data for now (placeholder for Phase 2 backend)
- Module, set, country, and global tabs

### Files to create:
- `src/data/trivia-data.ts` — All 150 questions + module metadata
- `src/data/badge-data.ts` — Badge definitions
- `src/pages/Learn.tsx` — Main learning hub entry (SVG map)
- `src/pages/learn/CountryDashboard.tsx` — Zones + modules
- `src/pages/learn/TriviaGame.tsx` — Game play screen
- `src/pages/learn/Results.tsx` — Score + badges
- `src/pages/learn/BadgeGallery.tsx` — Badge collection
- `src/pages/learn/Leaderboard.tsx` — Mock leaderboard
- `src/components/learn/AfricaMap.tsx` — Interactive SVG
- `src/components/learn/ModuleCard.tsx` — Module selection card
- `src/components/learn/QuestionCard.tsx` — Trivia question UI
- `src/components/learn/BadgeModal.tsx` — Badge unlock animation
- `src/hooks/use-trivia-progress.ts` — localStorage state management
