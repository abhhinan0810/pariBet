# Real User Data Transition & DOB-Based Classroom Authentication

Transition pariBet from mock/seed data to a 100% real-user system for the 53 MCA students of College of Engineering Chengannur. Replace email verification with a frictionless **Date of Birth (`DDMMYYYY`) initial password** mechanism, mandatory first-login password reset, instant 1,000 PTS bonus, nickname onboarding, and clean real-user leaderboards and prediction feeds.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed by the user in Phase 1:
> - **Initial Password**: Date of birth in `DDMMYYYY` format used as initial default password for all 53 roster students (e.g., `15082001`). No verification emails will be sent.
> - **First Login Onboarding**: Students must change their password on first login, select their custom player nickname/avatar, and receive an instant 1,000 PTS welcome credit.
> - **Data Cleanup**: Remove all dummy predictions, mock bets, mock loans, and fake leaderboard entries, while retaining the approved 53-student roster and administrative controls.
> - **Admin Reset Fallback**: The Master Administrator can reset any student's password back to their initial DOB if forgotten.

---

## 1. Overview & Core Concept

- **What It Does**: 
  1. Students log in directly using their college email (or admission number) and their Date of Birth (`DDMMYYYY`) without waiting for email verification links.
  2. On first sign-in, an onboarding flow prompts them to create a permanent password and choose their casino nickname.
  3. Their wallet is credited with 1,000 virtual PTS, and their profile is permanently activated.
  4. All dummy bets, mock loan requests, and synthetic leaderboard rows are replaced by live data generated strictly by registered classmates.
- **Target Audience**: The 53 verified students of CEC MCA Class of 2025 (`@ceconline.edu`) and the Master Administrator.
- **Key Value**: Immediate zero-friction adoption in the physical classroom. No student gets locked out by missing email verification links or spam filters.

---

## 2. User Experience & Flow Architecture

### A. Frictionless Sign-In Flow
```
┌─────────────────────────────────────────────────────────────┐
│ 1. Student enters College Email / Admission Number           │
│    + Initial Password (DOB: DDMMYYYY)                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. System validates against 53-Student Roster               │
│    - If first login: Shows "First-Time Lounge Activation"   │
│    - If returning student: Enforces their custom password    │
└──────────────────────────────┬──────────────────────────────┘
                               │ (First Login)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. First-Time Setup Modal                                    │
│    - Set New Permanent Password (min 6 characters)          │
│    - Choose Player Nickname (e.g. "Shadow", "Ace")           │
│    - Select DiceBear Bottts Casino Avatar                   │
│    - Claim 1,000 PTS Welcome Bankroll                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Direct Entry to Cinematic Class Casino Lounge             │
│    - Live Wallet: 1,000 PTS                                  │
│    - Ready to create predictions or wager                   │
└─────────────────────────────────────────────────────────────┘
```

### B. Clean Slate Experience (Zero Dummy Data)
- **Live Bets (`/discover` & Home)**: 
  - When no active predictions exist yet: Shows an inviting "The Table is Ready" state with a prominent "Create First Class Prediction" button.
- **Hall of Fame (`/leaderboard`)**:
  - Populates strictly with real students who have registered and activated their accounts, ranked by real points and streak statistics.
  - Pre-registered roster students are shown in an "Awaiting First Table Entry" section or cleanly integrated with default 1,000 PTS once active.
- **Classroom Activity Feed**:
  - Powered strictly by actual ledger transactions (`walletService`) and real prediction stakes placed by students.

---

## 3. Technical Architecture & Component Mapping

```
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
│  src/data/approved_students.json (53 verified students with DOB)│
│  localStorage / Firestore ('users', 'predictions', 'txs')       │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Authentication Service                      │
│  - src/services/studentService.ts (Roster lookup & DOB verify)  │
│  - src/context/AuthContext.tsx (DOB auth, firstLogin flag)       │
│  - src/services/userService.ts (1,000 PTS grant & profile save) │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        UI Interfaces                            │
│  - src/pages/auth/LoginPage.tsx (DOB helper text & guidance)    │
│  - src/components/auth/FirstLoginModal.tsx (Password & Nickname)│
│  - src/pages/leaderboard/LeaderboardPage.tsx (Real users only)  │
│  - src/services/predictionService.ts (Zero mock seed data)      │
│  - src/services/loanService.ts (Zero mock seed data)            │
└─────────────────────────────────────────────────────────────────┘
```

### Key Implementation Details:
1. **Roster Enrichment (`src/data/approved_students.json`)**:
   - Ensure each of the 53 students has a valid `dob` entry in standard `DDMMYYYY` format (e.g., `01012002` as standard batch baseline or individual DOBs) and `isFirstLogin: true`.
2. **Authentication Refactoring (`src/context/AuthContext.tsx`)**:
   - Allow login with either full email (`chn25mca045@ceconline.edu`) or bare admission number (`chn25mca045`).
   - If user has not changed their password yet, accept their `dob` as the valid credential, set `isFirstLogin: true`, and present the `FirstLoginModal`.
   - On completion of `FirstLoginModal`, encrypt/store their new password, update profile with their chosen nickname, credit 1,000 PTS, and set `isFirstLogin: false`.
3. **Dummy Data Wipe**:
   - Purge `INITIAL_MOCK_PREDICTIONS` from `predictionService.ts`.
   - Purge `INITIAL_SEED_REQUESTS` from `loanService.ts`.
   - Clear existing local mock storage keys (`paribet_mock_predictions`, `paribet_mock_loans`, `paribet_mock_transactions`) so the browser begins in a pristine, real-user state.
4. **Leaderboard Roster Real-Time Sync (`LeaderboardPage.tsx`)**:
   - Eliminate hardcoded `baseEntries` with fake points.
   - Aggregate actual registered users from `paribet_mock_users` / Firestore, showing real active rankings and qualifying spots for the Sem 4 Mandhi Grand Prize.

---

## 4. Verification & Testing Steps

1. **Test Initial DOB Login**:
   - Sign in with an approved student email / admission number and default DOB `DDMMYYYY`.
   - Verify that no email verification prompt appears.
   - Verify that the `FirstLoginModal` opens immediately.
2. **Test Password Reset & Nickname Selection**:
   - Set a new password and custom nickname.
   - Confirm 1,000 PTS is credited to `walletBalance`.
   - Log out and log back in using the *new* password (verify old DOB is no longer accepted).
3. **Verify Empty/Pristine State**:
   - Verify that no synthetic bets, fake loans, or artificial users exist.
   - Create a real prediction as a student, place a wager, and verify that the activity feed and leaderboard reflect only that real action.
4. **Compile & Lint**:
   - Run `compile_applet` and `lint_applet` together to verify zero syntax or typing errors.
