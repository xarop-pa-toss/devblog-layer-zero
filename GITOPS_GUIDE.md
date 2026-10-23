# Layer Zero — GitOps Workflow Guide

Layer Zero uses a **zero-maintenance GitOps architecture**. Because the app is hosted directly in AI Studio / Cloud Run, you do not need server webhooks or build pipelines. The website running in the visitor's browser continuously synchronizes directly with your public GitHub repository (`xarop-pa-toss/layer-zero`).

Whenever you push commits to GitHub, the live site automatically updates on page load and refresh!

---

## 1. How the GitOps Pipeline Works

```
  Local Terminal (Git CLI)
        │
        ▼  git push origin main
  GitHub Repository (xarop-pa-toss/layer-zero)
        │
        ├─► /public/state.json  ──────► Fetched via GitHub Raw CDN by visitor browser
        ├─► /public/logs/*.md   ──────► Fetched & parsed via GitHub Contents API
        └─► /commits/main       ──────► Provides live Commit SHA & telemetry badge
```

- **Instant Propagation**: Direct GitHub Raw fetching uses cache-busting queries (`?t=timestamp`) so your latest pushed state is reflected immediately.
- **Offline / Rate-Limit Resilience**: If GitHub is unreachable or rate-limited, the browser seamlessly falls back to the bundled local state files.
- **Manual Sync**: Visitors and operators can click **[● GITOPS: LIVE ↻]** at any time to force-fetch the newest state without reloading the browser tab.

---

## 2. Publishing New Logs via Git CLI

Every Markdown file in `public/logs/` (or `logs/`) is automatically parsed and rendered as a technical dispatch under **The Logs**.

### Step 1: Create a new `.md` file
Create a file under `public/logs/` named `YYYY-MM-DD-your-topic-slug.md`:

```markdown
---
title: "Flaggo: Designing the 4-Tier Control Plane"
date: 2026-10-23
tags: [dotnet, devops, flaggo, architecture]
summary: "Decoupling software deployment from feature release using runtime configuration evaluators."
---

## Overview

Traditional continuous deployment models conflate deploying code with turning features on for users. 

In Operation Flaggo, we isolate release control into four discrete components:
1. **Control Plane Frontend**: Web dashboard for operators
2. **Control Plane Web API**: REST & SSE rule engine in .NET
3. **Data Plane SDK**: In-memory rule evaluator
4. **PostgreSQL Database**: Persistence & audit trail

```

### Step 2: Push to GitHub
```bash
git add public/logs/
git commit -m "log: published Flaggo control plane architecture"
git push origin main
```
*Done! Open or refresh Layer Zero to see the new entry at the top of The Logs.*

---

## 3. Updating Roadmap & Bio State via Git CLI

All bio information, DevOps roadmap milestones, and Operation Flaggo gate statuses are stored in `public/state.json`.

### Task Status Values
- `"pending"`: Not yet started (gray pill)
- `"ai_assisted"`: Implemented with AI assistance (purple pill)
- `"independent"`: Implemented independently (teal pill)

### Step 1: Edit `public/state.json`
```json
{
  "opTasks": {
    "fm1_1": "independent",
    "fm1_2": "independent",
    "fm1_3": "ai_assisted"
  },
  "opGates": {
    "fg_m1": "independent"
  }
}
```

### Step 2: Push to GitHub
```bash
git add public/state.json
git commit -m "roadmap: completed Milestone 1 gate"
git push origin main
```
*The progress meters, gate statuses, and completion percentages on Layer Zero will immediately reflect the new numbers.*

---

## 4. GitOps Repository Configuration

The default repository is configured in `public/state.json` under `bio`:
```json
"bio": {
  "logsRepo": "xarop-pa-toss/layer-zero",
  "logsPath": "logs",
  "githubUser": "xarop-pa-toss"
}
```
If you ever change your repo name or path, update this entry in `public/state.json` and push to GitHub.
