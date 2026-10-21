# Layer Zero — Git-Backed Read-Only Engineering Hub

Convert **Layer Zero** into an authoritative, strictly read-only personal engineering hub where all content—**The Logs**, **Operation Flaggo** milestones, and the **12-Week DevOps Roadmap**—is managed via the Git CLI by committing Markdown files and a clean JSON state manifest to GitHub.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your answers, all in-browser editing, creation, deletion, and toggle controls will be removed so visitors cannot alter local state or see scratchpad UI. Instead, every visitor will see the exact canonical state you commit to Git.

- **Confirmed Decision 1 — Strictly Read-Only Website**: Remove `+ New Log Entry`, `Remove`, `Git Repo Sync Settings`, browser token inputs, interactive `Pending / AI Assisted / Independent` selector buttons, `[Edit]` bio inputs, and `+/-` application counters. Replace interactive row selectors with high-contrast, read-only status badges (`PENDING`, `AI ASSISTED` in `#512B58` purple, and `INDEPENDENT` in `#2A7886` teal).
- **Confirmed Decision 2 — Git CLI Workflow (`logs/*.md` + `state.json`)**: You manage the site entirely from your terminal (`vim`/`nvim`/VS Code + `git commit && git push`):
  1. **Logs**: Commit `.md` files with YAML frontmatter into `logs/` in your GitHub repo.
  2. **Roadmap & Operation Flaggo Progress**: Edit a single, human-readable `state.json` file (alongside a built-in fallback in `index.html`) to update task statuses (`pending`, `ai_assisted`, `independent`), passed gates, deliverable statuses, and competency grades.

---

## 1. Overview & Core Concept

- **What It Does**: Serves as Ricardo Giro's (`xarop_pa_toss`) public engineering hub, hosting **The Logs** (searchable, tag-filtered technical posts), **Operation Flaggo** (the 5-milestone Feature Flag & Runtime Configuration Platform assessment progress), the **12-Week DevOps Roadmap**, **Flaggo Architecture & Live GitHub Repos**, the **Bio** modal, and the bottom **Git Stream** ticker.
- **Target Audience / Persona**: Hiring managers, senior Cloud/DevOps engineers, and peers reviewing Ricardo's engineering work, roadmap progress, and technical write-ups.
- **Key Value**: Every visitor sees the exact same canonical, tamper-proof progress and logs backed directly by Ricardo's Git commits—with zero backend servers, databases, or exposed edit controls.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Reading & Filtering "The Logs"**: Visitors land on **The Logs**, filter entries by `#tag` or search query, and click **Read Full Entry** to open the full Markdown post in a clean workstation reader modal.
  2. **Inspecting Operation Flaggo & DevOps Roadmap**: Visitors navigate to **Operation Flaggo** or **DevOps Roadmap** to view Ricardo's current milestone completion percentages, passed acceptance gates, deliverable badges, and per-task statuses (`PENDING`, `AI ASSISTED`, `INDEPENDENT`).
  3. **Viewing Bio & Live Git Activity**: Visitors click **Bio // Ricardo Giro** in the top bar from any page, browse live repositories pulled from `github.com/xarop-pa-toss`, and watch recent commits scroll slowly across the compact bottom **GIT STREAM** bar.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Restrained 90s workstation / old-school operating system window chrome with subtle Bayer dither accents and generous whitespace.
  - *Color Palette & Mood*:
    - `--bg-canvas`: `#F1F3F4` (Light workstation surface)
    - `--cyan-soft`: `#79BAC1` (Soft cyan accents, borders, and highlights)
    - `--teal-deep`: `#2A7886` (Deep teal secondary titlebars, `INDEPENDENT` badges, and dithered progress fills)
    - `--plum-deep`: `#512B58` (Deep plum primary window chrome, headings, and `AI ASSISTED` badges)
  - *Typography & Hierarchy*: `Chakra Petch` for display headers, `IBM Plex Sans` for body copy, and `IBM Plex Mono` (`tabular-nums`) for status badges, metrics, tags, and commit hashes.
- **Interactive Feedback & Motion**:
  - Navigation tabs, tag filter pills, search input, log reader modals, and the Bio modal remain fully interactive for visitors.
  - Task rows in **Operation Flaggo** and the **12-Week Plan** display a clear color-coded left border bar, tinted surface, and status badge on the right (`PENDING` in white, `AI ASSISTED` in `#512B58` purple, `INDEPENDENT` in `#2A7886` teal) without editable buttons.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Resolution Git Loader (Relative `./state.json` + GitHub Contents API)**
  - *Chosen Approach*: On page load, the app checks `./state.json` (when hosted alongside `index.html` on GitHub Pages / Cloudflare Pages) and also polls your GitHub repository's `logs/` directory via `api.github.com` to automatically discover and parse all `.md` files.
  - *Why*: You never have to manually register new `.md` files in an index array if your repo is on GitHub—just `git add logs/my-post.md && git commit && git push`, and the site discovers and renders it automatically.
  - *Alternatives Considered*: Requiring a static site generator build step (Hugo/Jekyll), which adds build dependencies and breaks the single-file portability of `index.html`.
- **Decision 2: Replacing 3-Button Row Selectors with Read-Only Status Indicators**
  - *Chosen Approach*: Replace the interactive `Pending | AI Assisted | Independent` toggle group on each row with a clean, non-clickable status display that keeps the `#512B58` purple styling for `AI Assisted` and `#2A7886` teal styling for `Independent`.
  - *Why*: Eliminates clutter on every task row while making each entry's current status even cleaner and faster to scan.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Git Repository (Managed via Git CLI)                 │
│  ┌──────────────────────────┐        ┌───────────────────────────────┐  │
│  │ state.json               │        │ logs/*.md                     │  │
│  │ (Tasks, Gates, Matrix,   │        │ (Markdown posts with YAML     │  │
│  │  Deliverables, Cohorts)  │        │  frontmatter: title/date/tag) │  │
│  └────────────┬─────────────┘        └───────────────┬───────────────┘  │
└───────────────┼──────────────────────────────────────┼──────────────────┘
                │ Fetch on load                        │ GitHub Contents API
                ▼                                      ▼ + Raw .md Fetch
┌─────────────────────────────────────────────────────────────────────────┐
│                     Layer Zero (Single-File index.html)                 │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Top Bar: "Layer Zero"  |  4 Section Tabs  |  "Bio // Ricardo Giro"│  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                   │                                     │
│        ┌──────────────────────────┼──────────────────────────┐          │
│        ▼                          ▼                          ▼          │
│  ┌───────────────┐      ┌───────────────────┐      ┌─────────────────┐  │
│  │   The Logs    │      │ Operation Flaggo  │      │ Flaggo & Repos  │  │
│  │ • Tag Filter  │      │ & DevOps Roadmap  │      │ • 4-App Spec    │  │
│  │ • Search Bar  │      │ • Read-Only Rows  │      │ • Live GitHub   │  │
│  │ • Reader Modal│      │ • Purple AI Badge │      │   Repos Feed    │  │
│  └───────────────┘      └───────────────────┘      └─────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Compact Bottom Bar: "GIT STREAM" (Slow 115s Marquee: GitHub/Gitea)│  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State (`state.json`)**:
  - `bio`: Ricardo Giro's canonical profile, GitHub username (`xarop-pa-toss`), logs repo/folder path, and optional Gitea URL.
  - `opTasks` & `opGates`: Key-value map of Operation Flaggo task IDs (`fm1_1`..`fm5_4`) and gate IDs (`fg_m1`..`fg_m5`) to `'pending' | 'ai_assisted' | 'independent'`.
  - `deliverables`: Key-value map of deliverable IDs (`del_1`..`del_8`) to `true | false`.
  - `tasks` & `gates`: Key-value map of 12-Week Roadmap task IDs (`w0_1`..`w11_4`) and gate IDs (`g0`..`g6`) to `'pending' | 'ai_assisted' | 'independent'`.
  - `assessments`, `branch`, `portfolio`, `applications`: Read-only roadmap sub-tab states controlled via `state.json`.
- **Interactive Component & State Mapping**:
  - **Visitor Read-Only Controls**: Section navigation tabs, roadmap sub-tabs (`01. Overview` through `06. Job Cohorts`), log tag filters, log search input, **Read Full Entry** modal, and **Bio // Ricardo Giro** modal remain interactive.
  - **Removed Mutation Handlers**: All `localStorage` write hooks, form submission handlers, delete handlers, and status mutation buttons are removed so the UI strictly reflects the committed Git state.
