import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_REPO_SLUG,
  BASELINE_GITHUB_INDEX_SHA,
  DEFAULT_UI_CONFIG,
  normalizeRepoSlug,
  isGitHubPagesHost,
  detectHostEnvironment,
  decodeGitHubBase64,
  extractHtmlBootPayload,
  shouldExecuteRemoteIndex,
  resolveUiConfig,
  interpolateButtonLabel,
} from './gitops';

test('normalizeRepoSlug defaults legacy and empty slugs to xarop-pa-toss/devblog-layer-zero', () => {
  assert.equal(normalizeRepoSlug(''), DEFAULT_REPO_SLUG);
  assert.equal(normalizeRepoSlug('xarop-pa-toss/layer-zero'), DEFAULT_REPO_SLUG);
  assert.equal(normalizeRepoSlug('xarop-pa-toss/devblog-layer-zero'), DEFAULT_REPO_SLUG);
});

test('isGitHubPagesHost and detectHostEnvironment classify xarop.link, AI Studio, and local hosts accurately', () => {
  assert.equal(isGitHubPagesHost('xarop.link'), true);
  assert.equal(isGitHubPagesHost('www.xarop.link'), true);
  assert.equal(isGitHubPagesHost('xarop-pa-toss.github.io'), true);
  assert.equal(isGitHubPagesHost('layer-zero.ai.studio'), false);
  assert.equal(isGitHubPagesHost('localhost'), false);

  assert.equal(detectHostEnvironment('xarop.link').id, 'github-pages');
  assert.equal(detectHostEnvironment('layer-zero.ai.studio').id, 'ai-studio');
  assert.equal(detectHostEnvironment('ais-dev-abc.run.app').id, 'ai-studio');
  assert.equal(detectHostEnvironment('localhost').id, 'local');
});

test('decodeGitHubBase64 decodes multi-line base64 UTF-8 strings accurately', () => {
  const original = 'Layer Zero — Ricardo Giro · Operation Flaggo';
  const encoded = Buffer.from(original, 'utf-8').toString('base64');
  const withNewlines = encoded.slice(0, 12) + '\n' + encoded.slice(12);
  assert.equal(decodeGitHubBase64(withNewlines), original);
});

test('extractHtmlBootPayload extracts style blocks and inline app script while skipping external scripts', () => {
  const sampleHtml = `<!DOCTYPE html>
<html>
<head>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <style>:root { --bg-canvas: #F1F3F4; }</style>
</head>
<body>
  <div id="root"></div>
  <script>const repo = 'xarop-pa-toss/layer-zero'; const App = () => null; ReactDOM.createRoot(document.getElementById('root'));</script>
</body>
</html>`;

  const payload = extractHtmlBootPayload(sampleHtml);
  assert.equal(payload.styles.length, 1);
  assert.equal(payload.styles[0], ':root { --bg-canvas: #F1F3F4; }');
  assert.ok(payload.appScript.includes('ReactDOM.createRoot'));
  assert.ok(payload.appScript.includes('xarop-pa-toss/devblog-layer-zero'));
  assert.equal(payload.appScript.includes('xarop-pa-toss/layer-zero'), false);
});

test('shouldExecuteRemoteIndex triggers when GitHub blob SHA changes or forceRemote is true', () => {
  assert.equal(shouldExecuteRemoteIndex(BASELINE_GITHUB_INDEX_SHA, BASELINE_GITHUB_INDEX_SHA, false), false);
  assert.equal(shouldExecuteRemoteIndex('new_commit_blob_sha_12345', BASELINE_GITHUB_INDEX_SHA, false), true);
  assert.equal(shouldExecuteRemoteIndex(BASELINE_GITHUB_INDEX_SHA, BASELINE_GITHUB_INDEX_SHA, true), true);
  assert.equal(shouldExecuteRemoteIndex('', BASELINE_GITHUB_INDEX_SHA, false), false);
});

test('resolveUiConfig omits the Keebs hero button by default and respects enabled flags in state.json', () => {
  const defaultResolved = resolveUiConfig(null);
  assert.equal(
    defaultResolved.hero.buttons.some((b) => b.label.toLowerCase().includes('keebs')),
    false
  );
  assert.equal(defaultResolved.hero.buttons.length, 4);
  assert.equal(defaultResolved.navItems.length, 5);

  const customResolved = resolveUiConfig({
    hero: {
      ...DEFAULT_UI_CONFIG.hero,
      headline: 'Custom Headline From Repo',
      buttons: [
        { id: 'b1', label: 'Visible CTA', actionType: 'section', target: 'operation', enabled: true },
        { id: 'b2', label: 'Hidden CTA', actionType: 'section', target: 'keebs', enabled: false },
      ],
    },
  });
  assert.equal(customResolved.hero.headline, 'Custom Headline From Repo');
  assert.equal(customResolved.hero.buttons.length, 1);
  assert.equal(customResolved.hero.buttons[0].label, 'Visible CTA');
});

test('interpolateButtonLabel replaces roadmap and Flaggo progress placeholders', () => {
  const label = interpolateButtonLabel(
    'Operation Flaggo ({opPassedGates}/{opTotalGates} Gates) - {completionPercent}%',
    { opPassedGates: 3, opTotalGates: 5, completionPercent: 60 }
  );
  assert.equal(label, 'Operation Flaggo (3/5 Gates) - 60%');
});
