---
title: "Managing Layer Zero Logs & Roadmap Progress via Git CLI"
date: "2026-10-20"
tags: [git, github, gitea, layer-zero, flaggo]
summary: "How Layer Zero loads Markdown log entries from logs/*.md and roadmap/Operation Flaggo state from state.json committed directly via Git CLI."
---

Layer Zero is strictly read-only on the web. Every visitor sees the exact canonical state committed to the Git repository—no browser localStorage overrides or exposed editing forms.

### 1. Publishing a New Log Entry (`logs/*.md`)

To publish a new post to **The Logs**:

1. Create a Markdown file inside the `logs/` folder of your repository (e.g., `logs/2026-10-21-flaggo-docker-compose.md`).
2. Add YAML frontmatter at the top of the `.md` file:

```markdown
---
title: "Flaggo Milestone 1 — Local 4-App Docker Compose Topology"
date: "2026-10-21"
tags: [flaggo, docker, linux, devops]
summary: "Isolating the Control Plane API, Data Plane evaluator, and PostgreSQL behind a single published gateway port."
---

Write your full post body here...
```

3. Commit and push via Git CLI:
   - If the site is hosted from the repository defined in `state.json` (`bio.logsRepo`, default `xarop-pa-toss/layer-zero`), Layer Zero automatically discovers all `.md` files inside `logs/` via the GitHub Contents API (`api.github.com/repos/{owner}/{repo}/contents/logs`)—or from `logs/index.json` when served locally.

### 2. Updating Operation Flaggo & Roadmap Progress (`state.json`)

To check off tasks, pass acceptance gates, mark deliverables complete, or update the Competency Matrix:

1. Open `state.json` in your editor.
2. Change any task ID (e.g., `"fm1_1"`, `"w0_1"`) or gate ID (`"fg_m1"`, `"g0"`) to:
   - `"pending"`
   - `"ai_assisted"`
   - `"independent"`
3. Commit and push:
   `git add state.json && git commit -m "chore(roadmap): complete Flaggo Milestone 1" && git push`
