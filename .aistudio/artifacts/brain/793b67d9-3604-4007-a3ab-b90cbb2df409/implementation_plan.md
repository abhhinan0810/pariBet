# Implementation Plan — Cinematic "Class Casino" Experience

> **Brand Slogan**: *"NORMAL CLASS. **ABNORMAL** BETS."*  
> **Supporting Copy**: *"Predict the nonsense. Risk your points. Beat your classmates."*  
> **Currency Model**: Virtual classroom points only (`PTS`) — strictly zero real-money gambling.

---

## User Review & Critical Decisions

Based on user clarifications and requirements:
1. **Full Feature Suite**: Implement all three high-energy community features:
   - **Live Activity Feed ("The Table is Moving")**: Real-time peer wagers, odds shifts, streak alerts, and rivalry highlights.
   - **Class Personalities ("Meet the High Rollers")**: Dynamic titles and badges auto-assigned to verified MCA batch roster members based on their betting history and stats (e.g. *The Oracle*, *The High Roller*, *Chaos Agent*, *Safe Punter*, *The Comeback Kid*).
   - **Hall of Disasters**: Chronicle of legendary classroom upsets where overwhelming classroom favorites collapsed.
2. **Inline Bet Slip Interaction**:
   - Rather than forcing users into full modals or detached forms, clicking **YES** or **NO** on any prediction card expands an integrated, tactile bet slip directly beneath the choice buttons.
   - Features quick chip buttons (`50`, `100`, `250`, `500`, `MAX`), real-time pari-mutuel payout and multiplier calculations, balance checks, and a single-tap "Lock In [X] PTS" confirmation.
3. **Preserve Design Language**:
   - Strictly retain the dark obsidian palette (`#07080B`), subtle crimson atmospheric glows (`rgba(185, 28, 28, 0.16)`), champagne gold highlights (`#F59E0B` / `#FDE68A`), and crisp typography (Cinzel display serif + Inter UI sans-serif).
   - No cartoonish casino cliches or unnecessary multi-color gradients.
4. **Semester 4 Grand Prize Integration**:
   - Prominently maintain the **Full Mandhi Feast sponsored by Abhinav (Varkkala / pari)** for the top 4 leaderboard players at the end of Semester 4, complete with the poster asset and countdown/qualification tracker.

---

## Section 1: Core Concept & Classroom Vibe

The platform captures the feeling of a tight-knit 53-student MCA batch secretly operating a high-stakes Monte Carlo casino inside room 204.

```
+-----------------------------------------------------------------------------------+
|  CLASSROOM REALITY                                  CASINO PRESENTATION           |
|  - Surprise seminar pop quizzes           --->      "HIGH ROLLER ROULETTE"        |
|  - Rahul arriving 10 minutes late         --->      "ODDS AGAINST THE CLOCK"      |
|  - Lab external viva viva examiners       --->      "THE HOUSE ALWAYS WINS"       |
|  - Top 4 students at Sem 4 graduation     --->      "MANDHI FEAST GRAND PRIZE"    |
+-----------------------------------------------------------------------------------+
```

- **Tokens & Economy**: 
  - All users start with a grant of virtual `PTS`.
  - Daily login refills and peer-to-peer prediction pools.
  - Zero financial transactions; strictly friendly classroom bragging rights and the grand Mandhi feast.

---

## Section 2: UX & Feature Specifications

### 2.1 Hero Section ("The High Table")
- **Visuals**: Full cinematic hero with dark vignette, crimson and amber lighting, and subtle film grain overlay.
- **Copy**:
  - `CLASSBET` eyebrow badge.
  - Headline: `NORMAL CLASS.` with glowing golden `ABNORMAL BETS.`
  - Subhead: *"Your class has entered the high-stakes world of completely unnecessary predictions."*
- **Call-to-Action**: `ENTER THE TABLE →` (direct route to Discover/Login) and `VIEW GRAND PRIZE 🍗`.
- **Floating Live Bet Ticker**: Interactive teaser card displaying real-time live classroom wager (e.g. *"Will Rahul be early today? Yes 38% | No 62%"*).

### 2.2 Inline Expandable Bet Slip on Prediction Cards
When a student clicks either **YES** or **NO**:
1. The chosen button lights up with active borders (Emerald for YES, Crimson for NO).
2. The card seamlessly expands downward revealing the **Inline Slip**:
   - Dynamic user balance display (`Balance: 1,450 PTS`).
   - Quick chip selection chips: `+50`, `+100`, `+250`, `+500`, `MAX`.
   - Real-time return preview: shows estimated multiplier (e.g., `2.34x`) and potential win payout computed via the Pari-Mutuel engine.
   - Primary action: `LOCK IN [X] PTS ON [YES/NO]`.
   - Close / cancel toggle to collapse the slip.

### 2.3 "The Table is Moving" (Live Activity Ticker)
- Live, scrolling community activity feed featuring simulated and live Firestore events:
  - *"Anand doubled down: 500 PTS on Rahul Being Late"*
  - *"⚠️ OD SHIFT: 'Surprise Lab Test' odds flipped to 78% YES"*
  - *"🔥 SNEHA IS ON A 4-WIN STREAK (+1,250 PTS)"*
  - *"Alen jumped to #3 on the Sem 4 Mandhi Leaderboard"*
- Gives the application an electric, bustling casino floor feel.

### 2.4 Class Personalities ("Meet the High Rollers")
- Dynamic badges and titles calculated from player stats:
  - 👑 **The Oracle**: Highest prediction accuracy (>75% win rate over 10+ bets).
  - 🎲 **The High Roller**: Highest single-bet volume and all-in propensity.
  - ⚡ **Chaos Agent**: Bets predominantly on underdog outcomes (>3.0x odds).
  - 🛡️ **Safe Punter**: Bets strictly on heavy favorites; slow and steady grinder.
  - 📉 **The Comeback Kid**: Rebounded from <50 PTS back into the Top 10.
- Showcase cards featuring roster student names and badges on the Landing Page and Class Group page.

### 2.5 Hall of Disasters (Historic Classroom Upsets)
- Curated classroom lore cards celebrating the most hilarious upsets:
  - **The 98% Consensus Crash**: *"Everyone bet Sir wouldn't take attendance on Friday afternoon. He took it twice."* — Pool size: 8,400 PTS. Single winner took the entire pot.
  - **The Silent Seminar**: *"Bet on whether Gautham would speak during the presentation. Held 12 minutes of pure eye contact."* — Underdog payout: 9.4x.
  - **The Code Did Not Run**: *"92% believed the external wouldn't check line 42."*

### 2.6 Semester 4 Grand Mandhi Feast Showcase
- Dedicated high-contrast banner featuring the official poster of Abhinav (Varkkala / pari).
- Direct qualification counter: *"Top 4 at the close of Semester 4 get a full Mandhi feast on the house."*
- Quick action to open full modal with rules, tie-breaker criteria, and current top 4 contenders.

---

## Section 3: Technical Architecture & Component Tree

```
                       [ App.tsx ]
                            |
   +------------------------+------------------------+
   |                                                 |
[ LandingPage ]                              [ DiscoverPage / Home ]
   |                                                 |
   +-- Hero (Cinematic + Live Floating Slip)         +-- PredictionGrid
   +-- Grand Prize Mandhi Showcase                   |      |
   +-- "The Table is Moving" Activity Feed           |      +-- [ PredictionCard ]
   +-- "Meet the High Rollers" (Personalities)       |             |
   +-- "Hall of Disasters" (Upset Chronicles)        |             +-- Odds ProgressBar
   +-- "How It Works" 4-Step Rules                   |             +-- [ InlineBetSlip ]
   +-- Footer & Disclaimers                          |                   +-- Chip Selectors
                                                     |                   +-- Return Calculator
                                                     |                   +-- Commit Action
                                                     +-- Filter Bar (All / Live / Closing)
```

### State & Logic Flow for Inline Bet Slip
```
[User clicks YES / NO on PredictionCard]
  │
  ├──> Set activeOutcome ('YES' | 'NO')
  ├──> Expand inline tray with CSS animation
  ├──> Calculate pari-mutuel estimated returns based on current pool
  │      payout = stake + (stake / (opposingPool + currentOutcomePool)) * opposingPool
  │
  ├──> User adjusts stake via quick chip buttons (+50, +100, +250, +500, MAX)
  │
  └──> User clicks "Lock In [X] PTS"
         ├──> Validate balance >= stake
         ├──> Call walletService / predictionService.placeBet()
         ├──> Fire Toast confirmation & celebratory micro-haptic
         └──> Auto-collapse inline slip & update live pool bar
```

---

## Section 4: File Modification Plan

1. **`src/components/predictions/PredictionCard.tsx`**:
   - Refactor to include internal state: `isSlipOpen`, `selectedOutcome`, `stakeAmount`.
   - Embed tactile chips (`50`, `100`, `250`, `500`, `MAX`), quick return display, and confirmation button directly within the card body.
   - Maintain fallback to full `ParticipateModal` if requested, but default to frictionless inline action.

2. **`src/pages/landing/LandingPage.tsx`**:
   - Hero upgrade: Dramatic typography `"NORMAL CLASS. ABNORMAL BETS."`, floating live odds card, movie-still casino backdrop styling.
   - Integrate **Activity Feed** ("The Table is Moving") with animated entry transitions.
   - Add **Class Personalities** showcase grid using approved MCA roster personas and auto-assigned titles.
   - Add **Hall of Disasters** chronicle section.
   - Add **How It Works** 4-step cards (`01 PREDICT`, `02 BET`, `03 WAIT`, `04 FLEX`).
   - Polish **Grand Prize Mandhi Feast** banner with Abhinav's poster and qualification criteria.

3. **`src/pages/leaderboard/LeaderboardPage.tsx`**:
   - Add dynamic personality badges (*The Oracle*, *The High Roller*, *Chaos Agent*, *Safe Punter*) next to student ranks.
   - Emphasize the **Top 4 Mandhi Qualification Cutoff Zone** with special gold-rimmed highlighting.

4. **`src/types/prediction.ts` & helper utilities**:
   - Support personality badge types and live activity item data structures.

---

## Section 5: Verification & Quality Checks

1. **Build & Typecheck**: Co-execute `compile_applet` and `lint_applet` to ensure zero compilation or TypeScript errors.
2. **Mobile Responsiveness**: Verify that the expanded inline bet slip fits cleanly on mobile screens without viewport overflow.
3. **Pari-Mutuel Math**: Ensure edge cases (first bettor, 0-pool side, insufficient balance) are handled gracefully with instant UI feedback.
4. **Theme Consistency**: Verify that all accents adhere strictly to `#07080B` dark background, `#F59E0B` gold, and `#EF4444` crimson, retaining the authentic Class Casino identity.
