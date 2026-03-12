# WellTrack - Implementation Tasks

Tasks are organized by phase. Each task is a discrete unit of work. Check off items as you complete them.

---

## Phase 1: Backend Foundation

### Project Setup
- [ ] Initialize Node.js + TypeScript project in `backend/`, configure `tsconfig.json` and `package.json` scripts (`dev`, `build`, `start`)
- [ ] Set up Express app with basic middleware (JSON parsing, CORS, request logging)
- [ ] Configure ESLint and Prettier
- [ ] Create `.env.example` with required environment variables (`DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`, `SMTP_*`)
- [ ] Set up Docker Compose file with a PostgreSQL service for local development

### Database Schema
- [ ] Initialize Prisma, configure `datasource` and `generator` in `schema.prisma`
- [ ] Define `User` model (id, email, passwordHash, displayName, timezone, createdAt)
- [ ] Define `Symptom` model (id, userId nullable, name, category, isActive)
- [ ] Define `SymptomLog` model (id, userId, symptomId, severity, notes, loggedAt, createdAt) with index on `(userId, loggedAt)`
- [ ] Define `MoodLog` model (id, userId, moodScore, energyLevel, stressLevel, notes, loggedAt, createdAt) with index on `(userId, loggedAt)`
- [ ] Define `Medication` model (id, userId, name, dosage, frequency, isActive, createdAt)
- [ ] Define `MedicationLog` model (id, userId, medicationId, taken, takenAt, notes, createdAt) with index on `(userId, createdAt)`
- [ ] Define `Habit` model (id, userId nullable, name, trackingType enum, unit, isActive)
- [ ] Define `HabitLog` model (id, userId, habitId, valueBoolean, valueNumeric, valueDuration, notes, loggedAt, createdAt) with index on `(userId, loggedAt)`
- [ ] Define `PasswordResetToken` model (id, userId, token, expiresAt, usedAt)
- [ ] Run initial migration (`prisma migrate dev --name init`)
- [ ] Write seed script that inserts default symptoms (Headache, Fatigue, Joint Pain, Muscle Pain, Nausea, Brain Fog, Dizziness, Insomnia, Anxiety, Stomach Pain, Back Pain) and default habits (Sleep Duration, Water Intake, Exercise, Alcohol, Caffeine)

### Auth Endpoints
- [ ] `POST /api/auth/register` — validate input, hash password with bcrypt, create user, return access + refresh tokens
- [ ] `POST /api/auth/login` — verify credentials, return access + refresh tokens
- [ ] `POST /api/auth/refresh` — validate refresh token, issue new access token
- [ ] `POST /api/auth/logout` — invalidate refresh token (remove from DB or blocklist)
- [ ] `POST /api/auth/forgot-password` — generate reset token, send reset email via SMTP
- [ ] `POST /api/auth/reset-password` — validate token, update password hash, mark token used
- [ ] Write `authenticateToken` middleware that validates JWT and attaches `req.user`

### User Endpoints
- [ ] `GET /api/users/me` — return current user profile
- [ ] `PATCH /api/users/me` — update displayName and/or timezone
- [ ] `DELETE /api/users/me` — delete user and all related data (cascade)

### Symptoms & Symptom Logs
- [ ] `GET /api/symptoms` — return system symptoms (userId null) + user's custom symptoms
- [ ] `POST /api/symptoms` — create a custom symptom for the current user
- [ ] `PATCH /api/symptoms/:id` — update name, category, or isActive (user must own it or it's a system symptom they're hiding)
- [ ] `DELETE /api/symptoms/:id` — delete custom symptom (must be owned by user)
- [ ] `GET /api/symptom-logs` — list logs with optional `startDate`, `endDate`, `limit`, `offset` query params
- [ ] `POST /api/symptom-logs` — create a new symptom log entry
- [ ] `PATCH /api/symptom-logs/:id` — update severity, notes, or loggedAt
- [ ] `DELETE /api/symptom-logs/:id` — delete a log entry

### Mood Logs
- [ ] `GET /api/mood-logs` — list mood logs with optional date range filters
- [ ] `POST /api/mood-logs` — create a mood log (moodScore required, energy/stress optional)
- [ ] `PATCH /api/mood-logs/:id` — update fields
- [ ] `DELETE /api/mood-logs/:id` — delete entry

### Medications & Medication Logs
- [ ] `GET /api/medications` — list user's active (and inactive) medications
- [ ] `POST /api/medications` — add a new medication
- [ ] `PATCH /api/medications/:id` — update name, dosage, frequency, or isActive
- [ ] `DELETE /api/medications/:id` — soft-delete or hard-delete medication
- [ ] `GET /api/medication-logs` — list logs with optional date range filters
- [ ] `POST /api/medication-logs` — record whether a medication was taken
- [ ] `PATCH /api/medication-logs/:id` — update taken, takenAt, or notes
- [ ] `DELETE /api/medication-logs/:id` — delete entry

### Habits & Habit Logs
- [ ] `GET /api/habits` — return system habits + user's custom habits
- [ ] `POST /api/habits` — create a custom habit (name, trackingType, unit)
- [ ] `PATCH /api/habits/:id` — update habit fields or hide a system habit (isActive)
- [ ] `DELETE /api/habits/:id` — delete custom habit
- [ ] `GET /api/habit-logs` — list logs with optional date range filters
- [ ] `POST /api/habit-logs` — create a habit log (include the correct value field based on trackingType)
- [ ] `PATCH /api/habit-logs/:id` — update value or notes
- [ ] `DELETE /api/habit-logs/:id` — delete entry

### Insights & Export
- [ ] `GET /api/stats` — return user stats (current streak, days logged this week, total log counts)
- [ ] `GET /api/insights/trends` — return aggregated data for charts; accepts `type` (symptom, mood, habit) and `days` (7, 30, 90) query params
- [ ] `GET /api/export/csv` — stream a CSV of all user data within optional `startDate`/`endDate`

### Validation & Error Handling
- [ ] Add input validation (e.g. with `zod` or `express-validator`) to all POST/PATCH routes
- [ ] Create a centralized error handler middleware that returns consistent JSON error responses
- [ ] Add a `GET /api/health` endpoint that returns `{ status: "ok" }`

### Testing
- [ ] Set up Jest with a test database (separate `.env.test`)
- [ ] Write integration tests for auth endpoints (register, login, refresh, reset flow)
- [ ] Write integration tests for at least one full CRUD resource (e.g. symptom logs)

---

## Phase 2: Frontend Foundation

### Project Setup
- [ ] Initialize Vite + React + TypeScript project in `frontend/`
- [ ] Install and configure Tailwind CSS
- [ ] Set up React Router (`react-router-dom`) with a root layout
- [ ] Create an `api.ts` service wrapper (axios or fetch) that attaches the JWT to requests and handles 401 refresh logic
- [ ] Create `AuthContext` that stores the current user and exposes `login`, `logout`, `register` methods

### Auth Pages
- [ ] Build `LoginPage` — email/password form, link to register and forgot password
- [ ] Build `RegisterPage` — name, email, password form with basic client-side validation
- [ ] Build `ForgotPasswordPage` — email input, submits to forgot-password endpoint
- [ ] Build `ResetPasswordPage` — reads token from URL query param, shows new password form
- [ ] Create `ProtectedRoute` component that redirects to `/login` if not authenticated
- [ ] Create `PublicRoute` component that redirects to `/dashboard` if already authenticated

### App Layout & Navigation
- [ ] Build `AppLayout` with a sidebar (desktop) and bottom navigation bar (mobile)
- [ ] Add navigation links: Dashboard, Log, History, Trends, Settings
- [ ] Build `Header` component showing current page title and user display name

### Dashboard Page
- [ ] Fetch today's log summary (symptom count, mood logged, medications taken, habits logged)
- [ ] Display today's date and a "days logged this week" or streak indicator using stats from `GET /api/stats`
- [ ] Add quick-add buttons that open the appropriate logging modal
- [ ] Show a summary list of what's been logged today

### Logging Modals
- [ ] Build `SymptomLogModal` — symptom selector (from `GET /api/symptoms`), severity slider (1–10), notes field, date picker
- [ ] Build `MoodLogModal` — mood score selector (1–5), optional energy and stress sliders, notes field, date picker
- [ ] Build `MedicationLogModal` — medication selector (from `GET /api/medications`), taken toggle, optional takenAt time and notes
- [ ] Build `HabitLogModal` — habit selector, dynamic value input (boolean toggle / number input / duration input depending on trackingType), notes field, date picker
- [ ] Wire all modals to their respective POST API endpoints and refresh dashboard on success

### Shared UI Components
- [ ] `Button` — primary, secondary, destructive variants
- [ ] `Input` — text input with label and error state
- [ ] `Textarea` — multi-line input with label
- [ ] `Select` — dropdown with label
- [ ] `Slider` — range slider with visible value (used for severity/mood ratings)
- [ ] `Modal` — accessible dialog wrapper with backdrop and close button
- [ ] `Alert` — info/success/error banner component
- [ ] `Checkbox` — styled checkbox input

---

## Phase 3: Full Features

### History Page
- [ ] Fetch all log entries grouped by day using the existing GET endpoints with date filters
- [ ] Display entries in a scrollable list, newest day first, with each day as a collapsible section
- [ ] Show symptom logs (name + severity), mood logs (score + energy/stress), medication logs (taken/not), habit logs (value)
- [ ] Add a filter bar to show/hide entry types (symptoms, mood, medications, habits)
- [ ] Add edit and delete actions on each entry (open the relevant modal pre-filled, or confirm delete)

### Trends Page
- [ ] Install a charting library (e.g. `recharts`)
- [ ] Build a date range picker with presets: Last 7 days, 30 days, 90 days
- [ ] Build a line chart for symptom severity over time (one line per symptom, filterable)
- [ ] Build a line chart for mood score, energy, and stress over time
- [ ] Build a calendar heatmap showing which days had log entries (color intensity = number of entries)
- [ ] Connect charts to `GET /api/insights/trends`

### Settings Page
- [ ] Build "Edit Profile" section — update display name and timezone, save via `PATCH /api/users/me`
- [ ] Build "Manage Symptoms" section — list symptoms, toggle isActive, add custom symptom, delete custom symptom
- [ ] Build "Manage Habits" section — list habits, toggle isActive, add custom habit (name, type, unit), delete custom habit
- [ ] Build "Manage Medications" section — list medications, add/edit (name, dosage, frequency), toggle active, delete
- [ ] Build "Export Data" section — date range picker, download CSV via `GET /api/export/csv`
- [ ] Build "Delete Account" section — confirmation dialog, calls `DELETE /api/users/me`, then logs out
- [ ] Add logout button that clears auth state and redirects to login

### Log Page (standalone)
- [ ] Build a `/log` page that shows all four log type buttons and opens the appropriate modal (for users who want to log without going through the dashboard)

---

## Phase 4: Polish & Deploy

### Bug Fixes & UX
- [ ] Audit all forms for accessibility (labels, keyboard navigation, focus management in modals)
- [ ] Ensure all times are displayed in the user's timezone (use `Intl` API or a library like `date-fns-tz`)
- [ ] Add loading spinners/skeletons to data-fetching components
- [ ] Add empty states for pages with no data yet (e.g. "No entries yet — start logging!")
- [ ] Test on mobile viewports and fix any layout issues
- [ ] Review color palette — use soft teal/sage tones, avoid harsh clinical blues

### Security & Performance
- [ ] Ensure all API responses use HTTPS in production
- [ ] Add rate limiting middleware to auth endpoints (e.g. `express-rate-limit`)
- [ ] Review and add any missing DB indexes
- [ ] Add `helmet` middleware to set secure HTTP headers

### Deployment
- [ ] Choose hosting: Vercel (frontend) + Railway or Render (backend + DB)
- [ ] Set up environment variables in the hosting provider
- [ ] Configure CORS to allow only the production frontend origin
- [ ] Run `prisma migrate deploy` as part of the backend deploy process
- [ ] Verify the full sign-up → log → view trends flow works in production

---

## Stretch Goals (If Time Permits)

- [ ] Onboarding flow for new users (guided first-log experience)
- [ ] Daily reminder emails (cron job that emails users who haven't logged by a certain time)
- [ ] Correlation insights — surface patterns like "You report more fatigue on days with low sleep"
- [ ] PDF export formatted for doctor visits
