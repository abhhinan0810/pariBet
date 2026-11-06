# Implementation Plan — Semester-Long Engagement & Retention System

> **Goal**: Keep all 53 MCA students returning every single day until the end of Semester 4 to compete for the **Full Mandhi Feast sponsored by Abhinav (Varkkala / pari)**.  
> **Key Themes**: Daily habit loops, secret social wagers, Friday jackpot events, and intense mathematical race tracking.

---

## User Review & Critical Decisions

Based on user selections:
1. **Daily Check-in Streak + Lucky Spin Wheel**:
   - A daily reward drawer/modal accessible from the top navbar and dashboard.
   - Consecutive daily check-ins grant escalating PTS (`+50`, `+100`, `+150`, `+250`, `+500` PTS on Day 7).
   - Once every 24 hours, users get 1 free spin on the **Daily Lucky Wheel** to win instant tokens (`+25` to `+500` PTS) or Friday Jackpot tickets.
2. **End-of-Week Classroom Jackpot Lottery**:
   - Active participation in bets throughout the week automatically enters the student into the **Friday 5:00 PM Batch Jackpot**.
   - A communal prize pot funded by a slice of weekly pool turnover, drawn every Friday with a live reveal animation.
3. **Anonymous Predictions & Secret Wagers ("Phantom Mode")**:
   - When placing an inline bet or creating a market, students can check **"Incognito / Phantom Wager"**.
   - Their identity remains masked as *"Shadow Punter"* or *"Classmate #??"* until the market resolves, allowing bold contrarian bets without immediate classroom peer pressure.
4. **Mandhi Race Target Gap Calculator**:
   - Embedded directly on the **Dashboard** and **Leaderboard**.
   - Dynamically calculates the exact PTS gap between the logged-in student and the **#4 Cutoff Seat** (the threshold for the free Mandhi feast).
   - Features an interactive "What-If" betting simulator: *"Win 2 bets of 200 PTS at 2.2x to claim Seat #4!"*

---

## Feature Architecture & Specifications

### 1. Daily Check-in Streak & Lucky Spin Wheel
- **Location**: Floating action pill in header/navbar + widget on `HomePage.tsx`.
- **Logic**:
  - Checks `lastCheckInDate` stored in user profile or local storage.
  - If consecutive day, increments `currentStreak`; if missed >48 hours, resets streak with a one-time "Streak Shield" option.
  - Interactive tactile wheel with spin animation, audio-visual celebration, and instant wallet balance credit.

### 2. Friday Batch Jackpot Lottery Pool
- **Location**: `HomePage.tsx` (right sidebar) & `TokenBankPage.tsx`.
- **Mechanics**:
  - Every 100 PTS staked in any market generates 1 Lottery Ticket.
  - Friday 5:00 PM countdown ticker (e.g. *"Next Vault Draw in 2d 14h • Current Jackpot: 4,500 PTS"*).
  - Clean modal displaying ticket holder distribution and previous week's winner.

### 3. Anonymous "Phantom Wagers" & Secret Pools
- **Location**: `PredictionCard.tsx` (inline slip) & `CreatePredictionPage.tsx`.
- **Slip Control**: A sleek toggle button: `🕶️ Anonymous Phantom Bet`.
- When checked:
  - The public bet log / feed records the wager under a mysterious moniker (e.g., *"Phantom Whale committed 500 PTS"*).
  - Only when the prediction resolves to a winner is their identity unveiled in the Hall of Fame.

### 4. Mandhi Cutoff Target Gap Calculator
- **Location**: `LeaderboardPage.tsx` & `HomePage.tsx`.
- **Features**:
  - Displays user's live rank relative to Seat #4.
  - **Chaser Mode** (Ranks 5–53): Shows points deficit to #4, required win count, and suggested odds.
  - **Defender Mode** (Ranks 1–4): Shows cushion over Rank #5 and warns if a chaser is within 300 PTS.
  - Interactive slider allowing students to calculate how many PTS they need to stake to breach the Mandhi zone.

---

## Component & File Changes

1. **`src/components/engagement/DailyStreakModal.tsx`** *(New Component)*:
   - 7-day streak tracker + interactive Lucky Spin Wheel canvas/animation + claim button.
2. **`src/components/engagement/TargetGapCalculator.tsx`** *(New Component)*:
   - Dynamic math widget calculating live deficit or cushion relative to the #4 Mandhi cutoff seat with what-if simulator.
3. **`src/components/engagement/WeeklyJackpotBanner.tsx`** *(New Component)*:
   - Countdown to Friday 5 PM draw, live communal pot size, user's ticket count.
4. **`src/components/predictions/PredictionCard.tsx`**:
   - Add the `🕶️ Phantom Wager` toggle inside the inline bet slip.
5. **`src/pages/dashboard/HomePage.tsx`**:
   - Dock the Streak button, Weekly Jackpot card, and Target Gap preview.
6. **`src/pages/leaderboard/LeaderboardPage.tsx`**:
   - Integrate the Target Gap Calculator directly above the leaderboard table.

---

## Verification & Build Plan

1. Co-execute `compile_applet` and `lint_applet` to ensure clean TypeScript compilation with zero errors.
2. Verify local persistence of streaks and lottery ticket counts.
3. Verify that the Target Gap Calculator dynamically adjusts when switching categories or viewing different student profiles.
4. Restart development server and ensure smooth mobile responsiveness across all modal and wheel animations.
