# Implementation Plan - Real-Time GitOps Auto-Update for Layer Zero

## Overview
Because Layer Zero is hosted in AI Studio / Cloud Run, traditional server redeployment on git push would require complex CI/CD webhook infrastructure. Instead, we implement a **Client-Side GitOps Sync Engine**: the website runs in the visitor's browser and fetches your canonical data directly from your public GitHub repository (`xarop-pa-toss/layer-zero`) on every page load and refresh with cache-busting headers. 

The moment you run `git push origin main`, anyone visiting or refreshing the website receives the latest `state.json`, new log posts (`logs/*.md`), and live commit status instantly—true GitOps with zero server maintenance.

---

## Proposed Changes

### 1. Dynamic GitHub GitOps Loader for `state.json`
- **Location**: `/index.html` (`loadCanonicalStateJson`)
- **Behavior**:
  - Primary source: fetch `https://raw.githubusercontent.com/xarop-pa-toss/layer-zero/main/public/state.json?t=<timestamp>` (or `main/state.json`) with `cache: 'no-store'`.
  - Seamless Fallback: if GitHub is down, rate-limited, or offline, smoothly fallback to the bundled local `./state.json`.
  - Result: Any roadmap progress, bio edits, or project status committed to GitHub is reflected immediately on the live site.

### 2. Enhanced Markdown Logs Git Synchronization
- **Location**: `/index.html` (`loadLogsFromGit`)
- **Behavior**:
  - Fetch log directory listing from the GitHub Contents API (`/repos/xarop-pa-toss/layer-zero/contents/public/logs` and `/repos/xarop-pa-toss/layer-zero/contents/logs`).
  - Download and parse all `.md` files dynamically.
  - Automatically sort dispatches by date/id and tag badges.
  - Fallback to bundled local logs (`./logs/index.json`) if GitHub API is unreachable.

### 3. GitOps Telemetry & Commit Head Indicator
- **Location**: `/index.html` (Top Navbar and System Status Footer)
- **Behavior**:
  - Query `https://api.github.com/repos/xarop-pa-toss/layer-zero/commits/main` on load to fetch the latest commit SHA (e.g. `c4b18f0`) and commit timestamp.
  - Display a subtle GitOps indicator in the bottom status bar: `GITOPS: xarop-pa-toss/layer-zero@<sha7> [SYNCED]`.
  - Include an instant **Sync** button in the OS top bar / Logs window to refetch raw GitHub state on demand without reloading the tab.

### 4. GitOps Setup & Workflow Reference
- **Location**: `/GITOPS_GUIDE.md` (and a quick in-app modal in "Other Stuff" or Help)
- **Content**:
  - Clear, step-by-step instructions on directory structure:
    - `public/state.json` (canonical profile, roadmap, and project metadata)
    - `public/logs/YYYY-MM-DD-title.md` (new log articles)
  - The standard 3-step terminal flow:
    ```bash
    git add .
    git commit -m "log: updated flaggo rollout status"
    git push origin main
    ```
  - Verification tips for GitHub raw caching and public repo visibility.

---

## Verification Plan

### Automated Build & Syntax Verification
- Run `compile_applet` to ensure `/index.html` compiles cleanly.
- Verify that both local static files and remote GitHub fetch pipelines have error-boundary handling so the site never breaks if GitHub rate-limits or the user is offline.

### Manual Functional Verification
1. **Default Local Loading**: Verify Layer Zero loads perfectly from bundled files immediately.
2. **Live Fetching Simulation**: Test fetching `state.json` and logs from GitHub with fallback resilience.
3. **Sync Action**: Click the "Sync" button in the UI and confirm the commit SHA updates and data refreshes without page reload.
4. **Visual Style**: Ensure the retro 90s workstation palette (`#F1F3F4`, `#79BAC1`, `#2A7886`, `#512B58`) remains cohesive and clean.
