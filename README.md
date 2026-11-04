# TutorIQ — demo web app

**Every student understood. Every hour well spent.**

AI-enabled home tuition for Physics, Chemistry, Maths and Biology — taught by IIT, NIT and medical specialists.

A proof of concept for TutorIQ, an AI-enabled home-tuition platform for JEE/NEET students. The public site explains the platform and the team. Everything else needs a login, and there are two portals:

- **Student portal:** pick a test (the full 15-question Chemistry progress check, or a 3-question check on one topic), get a report a parent can read, and track progress on a dashboard.
- **Faculty portal:** see the whole batch on one screen (topic map, session priorities), open any student's progress and 2-week plan, and read every report.

It is a demo: one student and one faculty account, and no database. Login is checked on the server with a signed, httpOnly session cookie that carries the role, so each portal only opens for its own role. Test results are saved in the browser's `localStorage`.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Recharts · Anthropic TypeScript SDK.

## Demo logins

| Portal | Username | Password |
|---|---|---|
| Student | `aarav` | `tutoriq2026` |
| Faculty | `nimish` | `tutoriq2026` |

These are deliberately **not shown anywhere on the site**; share them with partners directly. To change the passwords without touching code, set `DEMO_STUDENT_PASSWORD` and `DEMO_FACULTY_PASSWORD` in Vercel's Environment Variables (and redeploy). Accounts are defined in `lib/auth.ts`; profiles in `lib/user.ts`.

**Demo story:** log in as the student, take a test, sign out, then log in as faculty. The new result appears on Aarav's row and profile, because both portals read the same browser's results. The other four students in the batch (Priya, Rohan, Sneha, Kabir) have generated, deterministic demo results (`lib/roster.ts`). Aarav's account starts with two pre-loaded results labelled **Demo**; **Results → Reset demo data** restores that state.

## Pages

| Route | Access | What it does |
|---|---|---|
| `/` | Public | Marketing site: what TutorIQ is, how it works, the platform for students / faculty / parents, subjects, the team, and login buttons. No tests or reports are reachable from here |
| `/login` | Public | Student / Faculty switch and sign-in form. `?as=faculty` opens the faculty tab |
| `/dashboard` | Student | Greeting, stats, "Where you are now" mastery chart, recommended next test, score trend, recent results |
| `/tests` | Student | Test library: the full progress check, five quick topic checks, other subjects marked "Coming soon" |
| `/tests/[testId]` | Student | Runs a test: one question at a time, timer, **Sure / Unsure** toggle. Keyboard: 1–4, S/U, Enter |
| `/results` | Student | Every attempt, newest first |
| `/results/[attemptId]` | Student | The full report for one attempt, with a PDF download |
| `/faculty` | Faculty | Batch overview: stats, topic map (each student × topic), session priorities, roster |
| `/faculty/students` | Faculty | Roster: average mastery, change since last full check, strongest topic, last check |
| `/faculty/students/[id]` | Faculty | One student: mastery, score trend, next 2-week plan, concepts to revisit first, all checks |
| `/faculty/students/[id]/results/[attemptId]` | Faculty | The same report the student sees |
| `POST /api/login`, `/api/logout` | — | Set or clear the session cookie |
| `POST /api/summary` | — | Writes the parent summary with Claude if `ANTHROPIC_API_KEY` is set. Otherwise it uses the built-in template |

`proxy.ts` (Next.js 16's renamed middleware) sends logged-out visitors to `/login`, and sends a logged-in user who opens the other role's portal back to their own. The old `/test` and `/report` URLs redirect to `/tests` and `/results`.

### What the report computes (`lib/analysis.ts`)

- **Overall score** and **mastery % per topic**, weighted by difficulty (easy ×1, medium ×2, hard ×3), shown as a bar chart
- **Strengths** (shown first): Strong / On track topics, concepts answered correctly *and* marked sure, and how many correct answers came in at exam pace
- **Status per topic:** Strong ≥ 75%, On track 50–74%, Focus area < 50%
- **Build speed:** a correct answer that took longer than the question's `targetSec` (45 s easy, 75 s medium, 105 s hard)
- **Confidence flags:** *Needs confirmation* (correct but marked unsure) and *Revisit concept* (incorrect but marked sure)
- **Answer analysis** for each incorrect answer, shown as *Concept to revisit*, *Calculation slip* or *Read the question again*. In the JSON these are the keys `concept gap`, `calculation slip` and `misread`; `ERROR_LABEL` in `lib/types.ts` maps them to the wording people see
- **Your next 2-week plan:** the two focus areas with the lowest mastery. Ties are broken by concepts to revisit, then by answers needing confirmation. The sub-concepts listed are the ones the student actually missed, then the syllabus list for that topic
- **Parent summary:** strengths first, then focus areas, in encouraging language. Built from a template, or written by Claude if a key is set
- **Download report as PDF:** calls `window.print()`, with print CSS tuned for A4

## Question bank

`data/questions.json` holds 15 Class 11–12 Chemistry MCQs, 3 for each of these topics: Mole concept, Atomic structure, Thermodynamics, Chemical equilibrium and GOC. Each question has `chapter`, `topic`, `concept`, `difficulty`, `targetSec`, the options (wrong ones carry `errorType` and `why`), `answer` and `explanation`. `lib/tests.ts` builds the test library from it: one full check plus one quick check per topic. Adding questions or topics to the JSON updates the tests with no other code changes.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
# or, for a production build:
npm run build && npm start
```

To use Claude for the parent summary (optional):

```bash
cp .env.example .env.local
# then set ANTHROPIC_API_KEY=sk-ant-... in .env.local
```

The model is `claude-opus-5-5`, run at low effort, and set in `app/api/summary/route.ts`. Its prompt requires positive, growth-oriented language and bans words such as weak, poor, diagnose and deficient. If the key is missing or invalid, or the API errors or refuses, the route returns the template summary, so the demo never breaks.

## Deploy on Vercel

No configuration is needed.

1. Push this repository to GitHub (already done if you're reading this there).
2. Go to **vercel.com → Add New… → Project** and import the repository.
3. Leave the build command, output directory and root directory at their defaults. `vercel.json` pins the framework to Next.js, so it builds correctly even if the project was created with another preset.
4. *(Optional)* Under **Environment Variables**, add `ANTHROPIC_API_KEY` to get AI-written parent summaries, `AUTH_SECRET` (any long random string) to sign session cookies with your own secret, and `DEMO_STUDENT_PASSWORD` / `DEMO_FACULTY_PASSWORD` to change the demo passwords.
5. Click **Deploy**. Every later push to the branch redeploys it, and pull requests get preview URLs.

From the CLI instead:

```bash
npm i -g vercel
vercel            # preview deployment
vercel --prod     # production
# optional:
vercel env add ANTHROPIC_API_KEY
```

## Project layout

```
app/
  page.tsx                         marketing site (public)
  login/page.tsx                   student / faculty login (public)
  (student)/layout.tsx             app shell: top nav, mobile tab bar, account menu
  (student)/dashboard/page.tsx
  (student)/tests/page.tsx         test library
  (student)/tests/[testId]/page.tsx   test runner
  (student)/results/page.tsx       results history
  (student)/results/[attemptId]/page.tsx   report
  faculty/layout.tsx               faculty app shell
  faculty/page.tsx                 batch overview
  faculty/students/...             roster, student profile, student reports
  api/login, api/logout            session cookie
  api/summary/route.ts             Claude-written parent summary (optional)
  layout.tsx, globals.css          fonts (Domine, Nunito Sans), colour tokens, print CSS
proxy.ts                           login + role checks for both portals
components/                        logo, app shell, report view, faculty roster, charts
data/questions.json                question bank
lib/                               auth, people, tests, scoring, progress, roster, summary, storage, seed history
```

## Language guide

All student- and parent-facing text is encouraging. Use *analyse / analysis / progress check*, *focus area*, *Revisit concept*, *Needs confirmation*, *Concept to revisit*, *Read the question again*. Avoid *diagnose*, *weak*, *misconception*, *lucky guess* and other negative or clinical words. Chemistry terms inside the question bank (for example "weak base") are subject vocabulary and stay as they are.

Design tokens: navy `#16233F`, paper `#F7F4EC`, saffron `#E0892B`, teal `#1F6B60`.

> Demo only: results are kept in the browser's `localStorage`, so they don't follow the student to another device. Nothing is sent to a server except the login request and, when a key is set, the summary request (first name and topic scores). A real version would swap `lib/storage.ts` for a database and `lib/auth.ts` for a proper identity provider.
