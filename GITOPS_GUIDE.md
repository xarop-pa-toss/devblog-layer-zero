# xarop.link — GitHub Pages & GitOps Workflow Guide

Because **xarop.link** is a static client-side application backed by `public/state.json` and `public/logs/*.md`, every push to `main` triggers `.github/workflows/deploy-pages.yml` to index your Markdown logs and deploy the site to GitHub Pages.

## Daily Git CLI Workflow

### 1. Publishing a New Log (`public/logs/*.md`)
Create a `.md` file in `public/logs/YYYY-MM-DD-your-slug.md` (`public/logs/index.json` is generated automatically during the build):

```markdown
---
title: "Flaggo: Designing the 4-Tier Control Plane"
date: "2026-10-23"
tags: [dotnet, devops, flaggo, architecture]
summary: "Decoupling software deployment from feature release using runtime configuration evaluators."
---

## Overview

Post content here...
```

Commit and push:
```bash
git add public/logs/
git commit -m "log: add new post"
git push origin main
```

### 2. Updating Bio, Navigation, or Roadmap Progress (`public/state.json`)
Edit `public/state.json` (or `index.html`) and push:
```bash
git add .
git commit -m "chore: update roadmap state"
git push origin main
```
