# Ekagra — demo web app

**Every student diagnosed. Every hour targeted.**

A proof of concept for Ekagra, an AI-enabled home-tuition platform for JEE/NEET students. A student takes a 15-question Chemistry diagnostic. The app then builds a report a parent can read and a tutor can act on. There is no login and no database. The browser computes everything, and the only server code is one optional route handler that calls Claude.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Recharts · Anthropic TypeScript SDK.

## Pages

| Route | What it does |
|---|---|
| `/` | Landing page: hero, the four subject cards (only Chemistry is live), how it works, the faculty, and a call to action |
| `/test` | 15 MCQs shown one at a time. Each has a timer and a **Sure / Unsure** toggle. The app records the answer, the time taken and the confidence. Keyboard: 1–4 to choose, S/U for confidence, Enter for the next question |
| `/report` | Report built from the responses in `sessionStorage`. If no test has been taken in this browser session, it shows a sample student, labelled with a **Demo data** banner |
| `POST /api/summary` | Writes the parent summary with Claude if `ANTHROPIC_API_KEY` is set. Otherwise it uses the built-in template |

### What the report computes (`lib/analysis.ts`)

- **Overall score** and **mastery % per topic**, weighted by difficulty (easy ×1, medium ×2, hard ×3), shown as a bar chart
- **Status per topic:** Strong ≥ 75%, On track 50–74%, Focus < 50%
- **Speed flag:** a correct answer that took longer than the question's `targetSec` (45 s easy, 75 s medium, 105 s hard)
- **Confidence flags:** *lucky guess* (correct but unsure) and *misconception* (wrong but sure)
- **Error type** for each wrong answer. In the JSON, every wrong option is pre-labelled `concept gap`, `calculation slip` or `misread`, with a one-line reason
- **Focus for the next 2 weeks:** the two weakest topics. Ties are broken by misconceptions, then by lucky guesses. The sub-concepts listed are the ones the student actually missed, then the syllabus list for that topic
- **Parent summary:** built from a template, or written by Claude if a key is set
- **Download report as PDF:** calls `window.print()`, with print CSS tuned for A4

## Question bank

`data/questions.json` holds 15 Class 11–12 Chemistry MCQs, 3 for each of these topics: Mole concept, Atomic structure, Thermodynamics, Chemical equilibrium and GOC. Each question has `chapter`, `topic`, `concept`, `difficulty`, `targetSec`, the options (wrong ones carry `errorType` and `why`), `answer` and `explanation`. To change the test, edit this file. No code changes are needed.

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

The model is `claude-opus-5-5`, run at low effort, and set in `app/api/summary/route.ts`. If the key is missing or invalid, or the API errors or refuses, the route returns the template summary, so the demo never breaks.

## Deploy on Vercel

No configuration is needed.

1. Push this repository to GitHub (already done if you're reading this there).
2. Go to **vercel.com → Add New… → Project** and import the repository.
3. Vercel detects **Next.js** on its own. Leave the build command, output directory and root directory at their defaults.
4. *(Optional)* Under **Environment Variables**, add `ANTHROPIC_API_KEY` to get AI-written parent summaries.
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
  page.tsx               landing
  test/page.tsx          diagnostic test (client)
  report/page.tsx        report (client)
  api/summary/route.ts   Claude-written parent summary (optional)
  layout.tsx, globals.css  fonts (Domine, Nunito Sans), colour tokens, print CSS
components/              logo/header, mastery chart
data/questions.json      question bank
lib/                     scoring, summary template, sample attempt, storage
```

Design tokens: navy `#16233F`, paper `#F7F4EC`, saffron `#E0892B`, teal `#1F6B60`.

> Demo only: responses are kept in the browser's `sessionStorage` and nothing is sent to a server, except the summary request when a key is set. That request carries the first name and the topic scores.
