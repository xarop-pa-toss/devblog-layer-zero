# xarop.link — GitHub Pages & GitOps Workflow Guide

Because **xarop.link** is a static client-side application backed by `public/state.json` and `public/logs/*.md`, every push to `main` triggers `.github/workflows/deploy-pages.yml` to index your Markdown logs and deploy the site to GitHub Pages.

---

## 1. Publishing a New Log (`flaggo-new-post` + `log-template.md`)

A standalone template lives at **`log-template.md`** and the **`flaggo-new-post`** bash script copies it into `public/logs/YYYY-MM-DD-<slug>.md` with today's date stamped in:

```bash
./flaggo-new-post ramblings-on-code
# -> Created new log entry: public/logs/2026-11-12-ramblings-on-code.md
```

*(Tip: To run `flaggo-new-post ramblings-on-code` from anywhere without `./`, symlink it into a directory on your `$PATH`, e.g. `ln -s "$(pwd)/flaggo-new-post" ~/.local/bin/flaggo-new-post`.)*

> Note: `public/logs/index.json` is regenerated automatically by GitHub Actions on every push — you never need to edit `index.json` by hand.

### Template (`log-template.md`)

```markdown
---
title: "Post Title Here"
date: "YYYY-MM-DD"
tags: [devops, flaggo, linux]
summary: "Short description shown on the Logs card and used by the search filter."
---

## Overview

Write your post content here...
```

---

## 2. Updating Milestone & Roadmap Flags (`public/state.json`)

Open `public/state.json` in your text editor. Every task and gate in `public/state.json` includes its human-readable description right next to its `"status"` field so you can see exactly which task you are updating:

```json
"fm1_1": {
  "status": "independent",
  "task": "Milestone 1: Start Flaggo 4-app stack: Control Plane Frontend, Control Plane API, Data Plane evaluator, and local PostgreSQL."
}
```

*(Note: Both `{ "status": "independent", "task": "..." }` and plain string shorthand `"fm1_1": "independent"` are supported.)*

### Allowed Status Values

| Value | Badge Displayed | Effect on Progress Counters |
| :--- | :--- | :--- |
| `"pending"` | `PENDING` | Default state (0% progress) |
| `"ai_assisted"` | `AI-ASSISTED` | Tracked as AI-assisted |
| `"independent"` | `INDEPENDENT` | Counts toward **DevOps Roadmap %**, **Milestone Done** counts, and **Passed Gates (`X/5 Gates`)** |

---

## 3. Quick Reference of Sections in `public/state.json`

### A. Operation Flaggo (`opTasks`, `opGates`, `deliverables`)
- **`opTasks` (`fm1_1` – `fm5_4`)**: Individual tasks inside Operation Flaggo Milestones 1–5 (`"pending"`, `"ai_assisted"`, or `"independent"`).
  - `fm1_1` – `fm1_5`: Milestone 1 — Local 4-App Stack
  - `fm2_1` – `fm2_5`: Milestone 2 — AWS Terraform Infrastructure
  - `fm3_1` – `fm3_4`: Milestone 3 — Control & Data Plane Operations
  - `fm4_1` – `fm4_4`: Milestone 4 — CI/CD & Diagnostics
  - `fm5_1` – `fm5_4`: Milestone 5 — Incident Recovery & Teardown
- **`opGates` (`fg_m1` – `fg_m5`)**: The 5 Milestone Acceptance Gates (`"pending"`, `"ai_assisted"`, or `"independent"`). Setting a gate to `"independent"` increments the `X/5 Gates` counter in the sidebar.
- **`deliverables` (`del_1` – `del_8`)**: Boolean deliverables checklist (`"done": true` or `"done": false`).

### B. 12-Week DevOps Roadmap (`tasks`, `gates`, `assessments`, `branch`, `portfolio`, `applications`)
- **`tasks` (`w0_1` – `w11_4`)**: Weekly roadmap tasks (`"pending"`, `"ai_assisted"`, or `"independent"`). Setting tasks to `"independent"` increases the `DevOps Roadmap X%` counter in the sidebar:
  - `w0_1` – `w0_5`: Week 0 — Baseline & Public Launch
  - `w1_1` – `w1_5`: Weeks 1–2 — Linux, Git & Scripting (Flaggo Milestone 1)
  - `w3_1` – `w3_4`: Weeks 3–4 — Cloud & Network Translation
  - `w5_1` – `w5_4`: Weeks 5–6 — Terraform & Lateral Probes (Flaggo Milestone 2)
  - `w7_1` – `w7_4`: Weeks 7–8 — Docker, CI/CD & Contribution (Flaggo Milestones 3 & 4)
  - `w9_1` – `w9_4`: Weeks 9–10 — Observability & Operations (Flaggo Milestone 5)
  - `w11_1` – `w11_4`: Weeks 11–12 — Specialization & Market Conversion
- **`gates` (`g0` – `g6`)**: Weekly gate status badges (`"pending"`, `"ai_assisted"`, or `"independent"`).
- **`assessments` (`<skill>_<t0..t4>`)**: Competency matrix cells where `<skill>` is one of `linux`, `git`, `scripting`, `azure`, `networking`, `terraform`, `docker`, `cicd`, `observability` and `<gate>` is `t0`, `t1`, `t2`, `t3`, or `t4`.
- **`branch`**: Selected specialization path (`"A"`, `"B"`, `"C"`, or `null`).
- **`portfolio`**: Repository URLs for `p1_link` (`linux-incident-lab`), `p2_link` (`flaggo-terraform-foundation`), `p3_link` (`flaggo-service-delivery`), and `p4_link` (`flaggo-observability-lab`).
- **`applications`**: Application funnel counts (`{ "applied": 0, "screens": 0, "tech": 0 }`) for cohorts `c_A`, `c_B`, `c_C`, and `c_D`.

---

## 4. Updating Your Sidebar Picture (`public/sidebar_picture.png`)

Replace `public/sidebar_picture.png` with your own square portrait image (`.png`) and push to `main`.

---

## 5. Deploying via Git CLI

```bash
git add .
git commit -m "chore: update roadmap state and logs"
git push origin main
```
