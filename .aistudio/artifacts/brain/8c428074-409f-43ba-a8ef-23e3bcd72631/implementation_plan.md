# Dual-Host GitOps Architecture: GitHub Pages (`xarop.link`) + AI Studio (`layer-zero.ai.studio`)

Maintain seamless **two-way compatibility** between **GitHub Pages (`https://xarop.link`)** and **AI Studio (`layer-zero.ai.studio`)**, so you can update your site from **either** AI Studio or your local terminal (`git push origin main`) and have both environments stay synchronized.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **How Dual Hosting Works Without Conflicts:**
> Your GitHub repository (`xarop-pa-toss/devblog-layer-zero` on `main`) serves as the single canonical bridge between AI Studio and GitHub Pages. You never lose the ability to edit in AI Studio: changes made here and pushed to GitHub automatically deploy to `xarop.link`, and changes pushed from your local terminal automatically load on both `xarop.link` and `layer-zero.ai.studio`.

- **Confirmed Decision — Dual Support (`Keep dual support for GitHub Pages and AI Studio`)**:
  1. **Update from AI Studio**: Build or tweak features here in AI Studio -> push/sync to GitHub -> GitHub Actions deploys the static build to `https://xarop.link` while AI Studio serves `layer-zero.ai.studio`.
  2. **Update from Local Git CLI**: Edit Markdown logs, `state.json`, or `index.html` locally -> `git push origin main` -> GitHub Actions rebuilds `https://xarop.link` AND the live GitHub API loader updates `layer-zero.ai.studio` immediately.

---

## 1. Overview & Core Concept

- **What It Does**: Unifies static GitHub Pages deployment (custom domain `xarop.link` with automated HTTPS and Markdown indexing) with AI Studio's live GitHub Contents API loader and bootloader.
- **Target Audience / Persona**: Ricardo Giro (`xarop-pa-toss`) switching fluidly between local terminal Git commits for day-to-day logs/roadmap updates and AI Studio for visual or architectural iterations.
- **Key Value**: Best of both worlds—native custom domain hosting on `https://xarop.link` plus full interactive AI Studio editing whenever you want it.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **AI Studio -> GitHub -> Live Sites**: You prompt changes in AI Studio, preview them live, and sync to GitHub. The GitHub Actions workflow builds and publishes to `xarop.link` automatically.
  2. **Local Terminal -> GitHub -> Live Sites**: You commit a new `.md` post or `state.json` change locally and run `git push origin main`. Both `xarop.link` and `layer-zero.ai.studio` reflect the commit immediately.
  3. **Live Host & Sync Telemetry**: In **Other Stuff -> GitOps Engine & Terminal Workflow**, the telemetry panel displays which host is currently serving the page (`GitHub Pages · xarop.link`, `AI Studio · layer-zero.ai.studio`, or `Local Workstation`), the active commit SHA (`@sha`), and side-by-side guides for both workflows.
- **Visual Identity & Theme**:
  - Preserves the Restrained 90s Workstation Light Mode palette (`#F1F3F4` canvas, `#FFFFFF` window surfaces, `#2A7886` deep teal, `#512B58` royal plum, `Chakra Petch` + `IBM Plex Sans` + `IBM Plex Mono`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Instant Bundled Render + Live GitHub API Overlay on All Hosts**
  - *Chosen Approach*: Load the local/same-origin static files (`./state.json`, `./logs/*.md`, `./keebs/*.md`) immediately for zero-latency first paint and rate-limit resilience, while simultaneously querying the GitHub Contents API (`cache: 'no-store'`) so even a brand-new commit pushed 1 second ago overrides stale cache on both `xarop.link` and `layer-zero.ai.studio`.
  - *Why*: Guarantees instant page load on `xarop.link` even if GitHub's API rate limit is reached, while ensuring zero propagation delay right after a `git push`.

- **Decision 2: Automated Content Indexing at Build Time**
  - *Chosen Approach*: Automatically generate `logs/index.json` and `keebs/index.json` during the build step before bundling static assets.
  - *Why*: Allows you to add new `.md` files from either AI Studio or your terminal without manually editing `index.json`.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Dual-Host Sync Diagram

```
   ┌──────────────────────────────┐         ┌──────────────────────────────┐
   │   Workflow A: Local CLI      │         │   Workflow B: AI Studio      │
   │   (Neovim / Terminal Git)    │         │   (Interactive Build & Sync) │
   └──────────────┬───────────────┘         └──────────────┬───────────────┘
                  │ git push origin main                   │ Push / Sync to GitHub
                  ▼                                        ▼
   ┌───────────────────────────────────────────────────────────────────────┐
   │              GitHub Repository (Single Source of Truth)               │
   │                xarop-pa-toss/devblog-layer-zero (main)                │
   └──────────────────┬─────────────────────────────────┬──────────────────┘
                      │                                 │
                      ▼ (GitHub Actions Build)          ▼ (Live Contents API + Bootloader)
   ┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
   │   Host 1: GitHub Pages (xarop.link)  │  │  Host 2: AI Studio (layer-zero...)   │
   │  • Native Custom Domain + Free HTTPS │  │  • Live Bootloader for index.html    │
   │  • Same-Origin Fast Asset Delivery   │  │  • Live GitHub API State & MD Sync   │
   │  • Live GitHub API Instant Overlay   │  │  • Interactive AI Studio Editing     │
   └──────────────────────────────────────┘  └──────────────────────────────────────┘
```

### Interactive Component & State Mapping

- **Host Environment Detection (`detectHostEnvironment`)**:
  - Classifies `window.location.hostname` into `'github-pages'` (`xarop.link` / `*.github.io`), `'ai-studio'` (`*.ai.studio` / `*.run.app`), or `'local'` (`localhost` / `127.0.0.1`) and surfaces this status in the GitOps telemetry panel.
- **Unified Content Hydration**:
  - Hydrates `state.json`, `logs/*.md`, and `keebs/*.md` from same-origin static files for instant startup, then applies fresh GitHub Contents API payloads (`xarop-pa-toss/devblog-layer-zero@main`) when online so both hosts always display the latest commit.
