# Layer Zero — GitHub Pages (`xarop.link`) & GitOps Workflow Guide

**Yes — you can (and should!) host Layer Zero directly on GitHub Pages with your custom domain `xarop.link`.**

Because Layer Zero is a 100% static client-side application backed by `public/state.json`, `public/logs/*.md`, and `public/keebs/*.md`, hosting on **GitHub Pages** gives you:
- **Native Custom Domain (`https://xarop.link`)**: Visitors stay on `https://xarop.link` with free automated Let's Encrypt HTTPS certificates managed by GitHub (no URL forwarding or iframe wrappers needed).
- **True Git-Push-to-Deploy**: Every `git push origin main` triggers `.github/workflows/deploy-pages.yml`, which auto-indexes your Markdown files (`scripts/generate-content-index.mjs`), builds the static bundle (`dist/`), and deploys it to `https://xarop.link` in ~20 seconds.
- **Same-Origin Fast Loading**: When accessed on `xarop.link` or `*.github.io`, the site loads `./state.json`, `./logs/*.md`, and `./keebs/*.md` directly from the same origin (zero GitHub API rate limits), while still working seamlessly if previewed in AI Studio (`layer-zero.ai.studio`).

---

## 1. 3-Step Setup for GitHub Pages + `xarop.link`

### Step 1: Sync / Push these files to `xarop-pa-toss/devblog-layer-zero` (`main`)
This repository now includes:
- `public/CNAME` -> Contains `xarop.link` so GitHub Pages binds your custom domain on every build.
- `public/.nojekyll` -> Ensures GitHub Pages serves all static assets without Jekyll interference.
- `scripts/generate-content-index.mjs` -> Automatically scans `public/logs/*.md` and `public/keebs/*.md` during `npm run build` so you never have to hand-edit `index.json`.
- `.github/workflows/deploy-pages.yml` -> GitHub Actions workflow that builds and deploys to GitHub Pages on every push to `main`.

### Step 2: Enable GitHub Actions Pages in your GitHub Repository
1. Open **`https://github.com/xarop-pa-toss/devblog-layer-zero/settings/pages`**.
2. Under **Build and deployment -> Source**, select **GitHub Actions** (instead of "Deploy from a branch").

### Step 3: Point `xarop.link` DNS to GitHub Pages
In your domain registrar's DNS settings for **`xarop.link`** (remove any HTTP URL redirect/forwarding rules first), add these standard GitHub Pages records:

| Type | Host / Name | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `185.199.108.153` | 3600 (or Auto) |
| **A** | `@` | `185.199.109.153` | 3600 (or Auto) |
| **A** | `@` | `185.199.110.153` | 3600 (or Auto) |
| **A** | `@` | `185.199.111.153` | 3600 (or Auto) |
| **CNAME** | `www` | `xarop-pa-toss.github.io` | 3600 (or Auto) |

Once DNS propagates (usually 5–15 minutes), go back to **Settings -> Pages** on GitHub, verify **`xarop.link`** is listed under **Custom domain**, and check **Enforce HTTPS**.

---

## 2. Daily Git CLI Workflow (Zero AI Studio Needed)

Once GitHub Pages is active, your entire workflow lives in your terminal and code editor:

### Publishing a New Log (`public/logs/*.md`)
Simply create a new `.md` file in `public/logs/YYYY-MM-DD-your-slug.md` (you do **not** even need to edit `public/logs/index.json`—the build script generates it automatically):

```markdown
---
title: "Flaggo: Designing the 4-Tier Control Plane"
date: "2026-10-23"
tags: [dotnet, devops, flaggo, architecture]
summary: "Decoupling software deployment from feature release using runtime configuration evaluators."
---

## Overview

Traditional continuous deployment models conflate deploying code with turning features on for users.
```

Then commit and push:
```bash
git add public/logs/
git commit -m "log: published Flaggo control plane architecture"
git push origin main
```

### Updating UI Buttons, Navigation, or Roadmap Progress (`public/state.json` or `index.html`)
Edit `public/state.json` (or `index.html` directly) and push:
```bash
git add .
git commit -m "roadmap: update milestone & hero buttons"
git push origin main
```
GitHub Actions will automatically build and publish your update to **`https://xarop.link`**.
