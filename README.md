# TutorIQ — demo web app

**Every student understood. Every hour well spent.**

AI-enabled home tuition for Physics, Chemistry, Maths and Biology — taught by IIT, NIT and medical specialists.

A proof of concept for TutorIQ, an AI-enabled home-tuition platform for JEE/NEET students. A student logs in, picks a test (the full 15-question Chemistry progress check, or a 3-question check on one topic), and gets a report a parent can read and a tutor can act on. A dashboard tracks progress across tests.

It is a demo: there is one hard-coded student account and no database. Login is checked on the server with a signed, httpOnly session cookie. Test results are saved in the browser's `localStorage`.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Recharts · Anthropic TypeScript SDK.

## Demo login

| Username | Password |
|---|---|
| `aarav` | `tutoriq2026` |

The login page shows these and has a one-click **Sign in as Aarav (demo)** button. They are set in `lib/user.ts`. On first login the account is pre-loaded with two earlier results (labelled **Demo**) so the dashboard has history. **Results → Reset demo data** restores that starting state.

## Pages

| Route | Access | What it does |
|---|---|---|
| `/` | Public | Landing page: hero, subject cards, how it works, the faculty, and **Student login** |
| `/login` | Public | Login form plus the demo-account card. Signed-in students are sent to the dashboard |
| `/dashboard` | Student | Greeting, stats (tests taken, average score, strong topics, latest result), "Where you are now" mastery chart from the latest check in each topic, a recommended next test, score trend, recent results |
| `/tests` | Student | Test library: the full progress check, five quick topic checks (with last result), and Physics / Maths / Biology marked "Coming soon" |
| `/tests/[testId]` | Student | Runs a test: one question at a time, with a timer and a **Sure / Unsure** toggle. Keyboard: 1–4 to choose, S/U for confidence, Enter for the next question |
| `/results` | Student | Every attempt, newest first, with per-topic mini bars |
| `/results/[attemptId]` | Student | The full report for one attempt (below), with a PDF download |
| `POST /api/login`, `/api/logout` | — | Set or clear the session cookie |
| `POST /api/summary` | — | Writes the parent summary with Claude if `ANTHROPIC_API_KEY` is set. Otherwise it uses the built-in template |

`proxy.ts` (Next.js 16's renamed middleware) redirects logged-out visitors on student pages to `/login?next=…`. The old `/test` and `/report` URLs redirect to `/tests` and `/results`.

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
4. *(Optional)* Under **Environment Variables**, add `ANTHROPIC_API_KEY` to get AI-written parent summaries, and `AUTH_SECRET` (any long random string) to sign session cookies with your own secret.
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
  page.tsx                         landing (public)
  login/page.tsx                   login (public)
  (student)/layout.tsx             app shell: top nav, mobile tab bar, account menu
  (student)/dashboard/page.tsx
  (student)/tests/page.tsx         test library
  (student)/tests/[testId]/page.tsx   test runner
  (student)/results/page.tsx       results history
  (student)/results/[attemptId]/page.tsx   report
  api/login, api/logout            session cookie
  api/summary/route.ts             Claude-written parent summary (optional)
  layout.tsx, globals.css          fonts (Domine, Nunito Sans), colour tokens, print CSS
proxy.ts                           protects student routes
components/                        logo, app shell, mastery chart, score trend
data/questions.json                question bank
lib/                               auth, demo user, tests, scoring, progress, summary, storage, seed history
```

## Language guide

All student- and parent-facing text is encouraging. Use *analyse / analysis / progress check*, *focus area*, *Revisit concept*, *Needs confirmation*, *Concept to revisit*, *Read the question again*. Avoid *diagnose*, *weak*, *misconception*, *lucky guess* and other negative or clinical words. Chemistry terms inside the question bank (for example "weak base") are subject vocabulary and stay as they are.

Design tokens: navy `#16233F`, paper `#F7F4EC`, saffron `#E0892B`, teal `#1F6B60`.

> Demo only: results are kept in the browser's `localStorage`, so they don't follow the student to another device. Nothing is sent to a server except the login request and, when a key is set, the summary request (first name and topic scores). A real version would swap `lib/storage.ts` for a database and `lib/auth.ts` for a proper identity provider.
