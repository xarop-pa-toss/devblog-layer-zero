---
title: "On GitOps, or how I run this blog using Git!"
date: "2026-10-20"
tags: [git, layer-zero, gitops]
summary: "How Layer Zero loads Markdown log entries from logs/*.md and roadmap/Operation Flaggo state from state.json committed to a Git repo."
---

test!!

Layer Zero is strictly read-only on the web. 
Every visitor sees the exact canonical state committed to the [Git repository](https://github.com/xarop-pa-toss/devblog-layer-zero).
There's no admin panel or secret edit mode activation and this is by design!

This greatly simplifies the process of adding posts as .md files, that contain some additional data in YAML format for the backend to parse.
A small example below:

```markdown
---
title: "Flaggo Milestone 1 — Local 4-App Docker Compose Topology"
date: "2026-10-21"
tags: [flaggo, docker, linux, devops]
summary: "Isolating the Control Plane API, Data Plane evaluator, and PostgreSQL behind a single published gateway port."
---

Post body here...
```
---

Since Layer Zero is both a personal blog and a place for me to keep track of my roadmaps, I have added simple states to each task.
Editing those is just as simple! There is a state.json file where I change the flags per task ID, the objective being to have all of them as Independent.

Finally, all that's needed is to push the changes to the repo and Github handles the rest... for now :)
