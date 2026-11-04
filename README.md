# pariBet — Private MCA Classroom Prediction & Virtual Gaming Platform

A private, mobile-first social gaming platform built exclusively for verified Master of Computer Applications (MCA) classmates at College of Engineering Chengannur (CEC).

Features a premium casino aesthetic featuring Obsidian Black (`#0B0B0F`), Velvet Card elevations (`#17171F`), Gold Gradients (`#D4AF37` / `#F4D477`), dynamic pari-mutuel odds, virtual tokens, peer lending bank, and real-time classroom competition.

---

## 🏛️ Project Architecture

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, React Router v7.
- **PWA**: Fully installable on iOS and Android with `vite-plugin-pwa` service workers and web manifest.
- **Backend & Database**: Firebase Authentication, Cloud Firestore, Firebase Cloud Functions (TypeScript), Firebase Storage.
- **Authoritative Student Roster**: Strict validation against the 53 approved student accounts from `data/student_roster.csv` (`admission_number@ceconline.edu`).

---

## ⚡ Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

### 3. Run Automated Test Suites
```bash
npm test
```
Runs both the 53-Student Roster Verification Suite and the Comprehensive Pari-Mutuel / Loan Calculation Test Suite.

### 4. Build for Production
```bash
npm run build
```

---

## 🎮 Game Systems & Core Modules

### 1. Dynamic Pari-Mutuel Staking Engine (`src/utils/pariMutuel.ts`)
- **Formula**: `Payout = S + (S / W) * L`
  - $S$ = Individual winning participant's stake
  - $W$ = Total stake committed to winning entries
  - $L$ = Total stake committed to losing entries
- **Multiplier Estimate**: $\text{Total Pool} / \text{Selected Option Pool}$ (e.g. $1000 / 200 = 5.00x$).
- **Integer-Safe Tokens**: Guaranteed that the sum of payouts strictly equals the total pool; fractional remainder tokens are deterministically awarded based on highest fractional share.

### 2. Four Prediction Formats
- **Type A: YES / NO**: Binary predictions (e.g. college announcements, sports events).
- **Type B: MULTIPLE CHOICE**: Custom options with independent option pools.
- **Type C: CLOSEST ANSWER WINS**: Numerical predictions with configurable units (Marks, Minutes, Points), integer/decimal modes, and min/max limits. Tied closest guesses share the reward pool proportionally to stake.
- **Type D: GROUP POLL**: Class voting where the option with the highest valid vote count wins the accumulated pool.

### 3. Virtual Token Wallet & Ledger (`src/services/walletService.ts`)
- Initial welcome bonus: **1,000 complimentary virtual tokens**.
- Immutable audit ledger categorizing:
  - `INITIAL_ALLOCATION`
  - `PREDICTION_COMMITMENT`
  - `PREDICTION_REWARD`
  - `PREDICTION_REFUND`
  - `LOAN_RECEIVED` / `LOAN_GIVEN`
  - `LOAN_REPAYMENT` / `INTEREST_RECEIVED`
  - `ADMINISTRATIVE_ADJUSTMENT`
- Tokens are non-monetary fictional points with no real-world financial deposits or withdrawals.

### 4. Token Bank & Peer Lending (`src/services/loanService.ts`)
- Peer-to-peer virtual token lending with simple flat interest.
- Workflow: Request $\to$ Offers $\to$ Accept $\to$ Atomic Transfer $\to$ Repayment (full or partial).
- Safeguards: 2,000 token request limit, lender balance verification, self-lending prohibition, and overdue borrowing restrictions.

### 5. Classroom Hall of Fame (`src/pages/leaderboard/LeaderboardPage.tsx`)
- 7 Competitive Categories:
  1. Overall Champion (Lifetime Tokens Won)
  2. Most Victories
  3. Longest Winning Streak
  4. Highest Win Rate
  5. Most Active
  6. Top Lender
  7. Best Comeback
- Time Filters: All Time, Monthly, Weekly.

### 6. Administration Dashboard (`src/pages/admin/AdminDashboardPage.tsx`)
- Oversight of all 53 student seats.
- Prediction cancellation and emergency refund controls.
- Administrative token grants with required justification.
- Immutable administrative audit logs (`admin_logs`).

---

## 🔒 Security Rules & Cloud Functions

- **Firestore Security Rules**: Configured in [`firestore.rules`](file:///d:/Downloads/pariBet/firestore.rules) enforcing read-only student names, non-tamperable wallet balances, immutable transactions, and role verification.
- **Cloud Functions**: Provided in [`functions/src/index.ts`](file:///d:/Downloads/pariBet/functions/src/index.ts) for atomic participation transactions and server-side payout finalization.
