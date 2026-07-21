# Mytrix

**Turn repositories into intelligence.**

Mytrix reconstructs a codebase's memory — its purpose, architecture, key decisions, and
risks — directly from its code, dependencies, and documentation, then guides a developer
through it with a grounded AI mentor. Built for OpenAI Build Week 2026.

🔗 **Live demo:** https://mytrix-seven.vercel.app
📹 **Demo video:** [link]
💻 **Codex session:** [019f71ac-5e66-73e3-94f2-e3add23332de]

---

## The problem

Every year, engineering teams lose real, measurable time when knowledge leaves with a
developer, or a new hire has to reconstruct context that was never written down. The
code survives. The *why* doesn't. Existing AI coding assistants can explain what a
function does — almost none can tell you why a repository is shaped the way it is, what
decisions got it there, or what's still fragile.

Mytrix is built to close that gap: not another code-explainer, but a system that
reconstructs a project's memory and hands it to a new developer as a guided, evidence-backed
briefing instead of a wall of source code.

---

## What it does

- **Repository Intelligence Engine** — clones a public GitHub repo and deterministically
  parses its languages, frameworks, dependencies, entry points, config files, environment
  variables, Docker/CI setup, and folder structure. No AI involved in this step — it's
  pure static analysis, which keeps everything downstream grounded in fact rather than
  inference.
- **AI-Generated Repository Overview** — GPT-5.6 synthesizes the above into a plain-language
  purpose, architecture summary, strengths, weaknesses, and risks — **with every claim
  required to cite a specific file, dependency, or framework actually present in the
  repository.** Nothing is allowed to sound generic; if the model can't tie a statement to
  real evidence, it's instructed to leave it out rather than guess.
- **Knowledge Graph** — an interactive, type-grouped visualization of the repository's real
  structure (languages, frameworks, dependencies, config, entry points) built from the same
  parsed data, not a black box.
- **AI Mentor** — a grounded Q&A assistant that answers questions about the specific
  repository using only its actual parsed context. When the available context can't fully
  support an answer, it says so explicitly instead of inventing detail — this is a hard
  constraint in its system prompt, not a hope.
- **Saved Projects** — persists every analyzed repository so a developer (or a judge) can
  return to it without re-running analysis.

---

## Built with Codex

Codex was used throughout the build, not just at the end for polish. Concretely:

- **Parser detectors** — the entire Repository Intelligence Engine (`detectLanguages`,
  `detectFramework`, `detectDependencies`, `detectEntrypoints`, `detectEnvironment`, and
  more) was scaffolded and iterated on with Codex, working from a precise specification of
  the shared file-walk architecture and exact output schema for each detector.
- **Full-stack wiring** — Codex built the Express controllers, routes, and storage layer
  (atomic JSON writes, project listing, metadata persistence) as well as the majority of
  the React frontend: the analysis flow, dashboard, Knowledge Graph visualization, and
  Mentor chat interface.
- **Debugging real production bugs live** — several genuine bugs surfaced during
  development and were diagnosed and fixed iteratively with Codex: a missing evidence-graph
  citation schema, a hard-coded model provider mismatch between Groq (dev) and GPT-5.6
  (submission), a nested function-declaration syntax error, and a Tailwind-vs-plain-CSS
  styling conflict across the app. Each fix was scoped precisely to the actual bug rather
  than broad rewrites, to avoid destabilizing working code close to deadline.
- **Key human decisions, kept out of Codex's hands on purpose** — what to scope in vs. cut
  (an interactive AI chat and full authentication system were deliberately removed once it
  was clear they'd compromise a working demo), and the non-negotiable requirement that
  every AI-generated claim carry a real citation. These were product and trust decisions,
  made explicitly rather than left to an agent's judgment.

---

## Powered by GPT-5.6

GPT-5.6 runs both the Repository Overview generation and the AI Mentor, via the OpenAI
Responses API. Both share the same core discipline:

> *"Base every statement strictly on the supplied repository context. Never hallucinate.
> Never invent files, dependencies, frameworks, or architecture details not present in the
> context. If you cannot tie a claim to something specific in the context, omit it rather
> than write generically."*

This isn't just a system prompt claim — it's visibly working in production. For example,
when asked about implementation details the parsed context couldn't fully verify, the
Mentor responded:

> *"...the supplied context does not provide enough implementation detail to confirm how
> every described feature is built."*

That's the model correctly declining to guess, live, rather than confidently hallucinating
— which was the single hardest problem to get right in this build, and the thing we
prioritized over every other feature.

Development iteration was done against Groq (Llama 3.3) for speed and cost while tuning
prompts; the submitted, deployed version runs on real GPT-5.6.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Flow (Knowledge Graph) |
| Backend | Node.js, Express |
| AI | GPT-5.6 via OpenAI Responses API |
| Repository access | simple-git |
| Storage | Local JSON, atomic writes (no database — kept intentionally simple) |
| Deployment | Vercel |

---

## Getting started

```bash
git clone <this-repo>

# Backend
cd backend
npm install
# .env: OPENAI_API_KEY=..., AI_PROVIDER=openai
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
```

Paste any public GitHub repository URL on the landing page to analyze it. Try a small-to-
medium repo first — huge repositories (e.g. `vercel/next.js`) will take longer to clone and
parse.

---

## What's next: Mytrix as a Codex extension

The long-term direction for Mytrix isn't a standalone web app a developer has to
context-switch into — it's meeting developers where they already work. A natural next step
is packaging Mytrix's grounded repository analysis as a **Codex plugin/tool**, so a
developer (or Codex itself, acting agentically) could pull a grounded project briefing,
onboarding plan, or "what's risky here" summary directly inside their existing Codex
workflow — no separate dashboard required. The deterministic parsing layer we built is
already decoupled from the UI, which makes this a realistic extension rather than a
rewrite: the same Knowledge Object that powers the dashboard today could just as easily
power a Codex tool call tomorrow.

---
## License

MIT
