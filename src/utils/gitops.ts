export const DEFAULT_REPO_SLUG = 'xarop-pa-toss/devblog-layer-zero';
export const BASELINE_GITHUB_INDEX_SHA = '980863e5917f5c4f147b89fe47b86975e32c5eb6';

export interface HeroButtonConfig {
  id: string;
  label: string;
  actionType: 'section' | 'external' | 'scroll';
  target: string;
  variant?: 'primary' | 'teal' | 'default';
  enabled?: boolean;
}

export interface NavItemConfig {
  id: string;
  label: string;
  enabled?: boolean;
}

export interface UiConfig {
  brandTitle: string;
  hero: {
    windowTitle: string;
    headline: string;
    activeProjectLabel: string;
    activeProjectName: string;
    activeProjectText: string;
    buttons: HeroButtonConfig[];
  };
  navItems: NavItemConfig[];
}

export const DEFAULT_UI_CONFIG: UiConfig = {
  brandTitle: 'xarop.link',
  hero: {
    windowTitle: 'xarop.link — Ricardo Giro',
    headline: 'Ricardo Giro — Infrastructure, DevOps & .NET',
    activeProjectLabel: 'Active Project:',
    activeProjectName: 'Flaggo',
    activeProjectText:
      '— self-hosted 4-app feature flag & runtime config platform.',
    buttons: [
      {
        id: 'btn-flaggo',
        label: 'Operation Flaggo ({opPassedGates}/{opTotalGates} Gates)',
        actionType: 'section',
        target: 'operation',
        variant: 'primary',
        enabled: true,
      },
      {
        id: 'btn-roadmap',
        label: 'DevOps Roadmap ({completionPercent}%)',
        actionType: 'section',
        target: 'roadmap',
        variant: 'teal',
        enabled: true,
      },
      {
        id: 'btn-projects',
        label: 'Other Stuff',
        actionType: 'section',
        target: 'projects',
        variant: 'default',
        enabled: true,
      },
      {
        id: 'btn-github',
        label: 'GitHub ->',
        actionType: 'external',
        target: 'https://github.com/xarop-pa-toss',
        variant: 'default',
        enabled: true,
      },
    ],
  },
  navItems: [
    { id: 'logs', label: 'The Logs', enabled: true },
    { id: 'roadmap', label: 'DevOps Roadmap', enabled: true },
    { id: 'operation', label: 'Operation Flaggo', enabled: true },
    { id: 'projects', label: 'Other Stuff', enabled: true },
  ],
};

export function normalizeRepoSlug(slug?: string | null): string {
  const trimmed = String(slug || '').trim();
  if (!trimmed || trimmed === 'xarop-pa-toss/layer-zero') {
    return DEFAULT_REPO_SLUG;
  }
  return trimmed;
}

export function isGitHubPagesHost(hostname?: string | null): boolean {
  const host = String(hostname || '').trim().toLowerCase();
  if (!host) return false;
  return (
    host === 'xarop.link' ||
    host.endsWith('.xarop.link') ||
    host.endsWith('.github.io')
  );
}

export function detectHostEnvironment(hostname?: string | null): {
  id: 'github-pages' | 'ai-studio' | 'local';
  label: string;
} {
  const host = String(hostname || '').trim().toLowerCase();
  if (isGitHubPagesHost(host)) {
    return { id: 'github-pages', label: 'GitHub Pages (xarop.link)' };
  }
  if (host.endsWith('.ai.studio') || host.endsWith('.run.app')) {
    return { id: 'ai-studio', label: 'AI Studio' };
  }
  return { id: 'local', label: 'Local Workstation' };
}

export function decodeGitHubBase64(b64?: string | null): string {
  try {
    const clean = String(b64 || '').replace(/\s+/g, '');
    if (!clean) return '';
    const binStr = atob(clean);
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return '';
  }
}

export function extractHtmlBootPayload(rawHtml: string): {
  styles: string[];
  appScript: string;
} {
  const html = String(rawHtml || '');
  const styles: string[] = [];
  const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let styleMatch: RegExpExecArray | null;
  while ((styleMatch = styleRegex.exec(html)) !== null) {
    if (styleMatch[1] && styleMatch[1].trim()) {
      styles.push(styleMatch[1]);
    }
  }

  let appScript = '';
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let scriptMatch: RegExpExecArray | null;
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    const attrs = scriptMatch[1] || '';
    const body = scriptMatch[2] || '';
    if (/\bsrc\s*=/i.test(attrs)) continue;
    if (body.trim().length > appScript.length) {
      appScript = body.replace(/xarop-pa-toss\/layer-zero/g, DEFAULT_REPO_SLUG);
    }
  }

  return { styles, appScript };
}

export function shouldExecuteRemoteIndex(
  remoteSha: string,
  baselineSha: string = BASELINE_GITHUB_INDEX_SHA,
  forceRemote: boolean = false
): boolean {
  const cleanRemote = String(remoteSha || '').trim();
  if (!cleanRemote) return false;
  if (forceRemote) return true;
  return cleanRemote !== baselineSha;
}

export function resolveUiConfig(
  partialUi?: Partial<UiConfig> | null,
  defaults: UiConfig = DEFAULT_UI_CONFIG
): UiConfig {
  if (!partialUi || typeof partialUi !== 'object') {
    return {
      ...defaults,
      hero: {
        ...defaults.hero,
        buttons: defaults.hero.buttons.filter((b) => b.enabled !== false),
      },
      navItems: defaults.navItems.filter(
        (n) => n.enabled !== false && n.id !== 'keebs'
      ),
    };
  }

  const rawHero: Partial<UiConfig['hero']> =
    partialUi.hero && typeof partialUi.hero === 'object' ? partialUi.hero : {};
  const rawButtons = Array.isArray(rawHero.buttons)
    ? rawHero.buttons
    : defaults.hero.buttons;
  const rawNavItems = Array.isArray(partialUi.navItems)
    ? partialUi.navItems
    : defaults.navItems;

  const rawBrand =
    typeof partialUi.brandTitle === 'string' && partialUi.brandTitle.trim()
      ? partialUi.brandTitle.trim()
      : defaults.brandTitle;

  return {
    brandTitle: rawBrand === 'Layer Zero' ? 'xarop.link' : rawBrand,
    hero: {
      windowTitle:
        typeof rawHero.windowTitle === 'string' && rawHero.windowTitle.trim()
          ? rawHero.windowTitle.replace(/Layer Zero/g, 'xarop.link')
          : defaults.hero.windowTitle,
      headline:
        typeof rawHero.headline === 'string' && rawHero.headline.trim()
          ? rawHero.headline
          : defaults.hero.headline,
      activeProjectLabel:
        typeof rawHero.activeProjectLabel === 'string'
          ? rawHero.activeProjectLabel
          : defaults.hero.activeProjectLabel,
      activeProjectName:
        typeof rawHero.activeProjectName === 'string'
          ? rawHero.activeProjectName
          : defaults.hero.activeProjectName,
      activeProjectText:
        typeof rawHero.activeProjectText === 'string'
          ? rawHero.activeProjectText
          : defaults.hero.activeProjectText,
      buttons: rawButtons.filter(
        (b) => b && b.enabled !== false && b.target !== 'keebs'
      ),
    },
    navItems: rawNavItems.filter(
      (n) => n && n.enabled !== false && n.id !== 'keebs'
    ),
  };
}

export function interpolateButtonLabel(
  template: string,
  stats: {
    opPassedGates?: number;
    opTotalGates?: number;
    completionPercent?: number;
  }
): string {
  return String(template || '')
    .replace(/\{opPassedGates\}/g, String(stats.opPassedGates ?? 0))
    .replace(/\{opTotalGates\}/g, String(stats.opTotalGates ?? 0))
    .replace(/\{completionPercent\}/g, String(stats.completionPercent ?? 0));
}

export function matchesLogSearchQuery(
  post: {
    title?: string | null;
    summary?: string | null;
    description?: string | null;
    content?: string | null;
    tags?: string[] | null;
  },
  query?: string | null
): boolean {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  const title = String(post?.title || '').toLowerCase();
  const description = String(
    post?.summary ?? post?.description ?? ''
  ).toLowerCase();
  return title.includes(q) || description.includes(q);
}

export function resolveSidebarPictureUrl(avatarUrl?: string | null): string {
  const trimmed = String(avatarUrl || '').trim();
  return trimmed || './sidebar_picture.png';
}

export function normalizeBioConfig(
  rawBio?: Record<string, unknown> | null,
  defaultRole: string = 'Infrastructure & DevOps · .NET'
): {
  role: string;
  avatarUrl: string;
  logsRepo: string;
} {
  if (!rawBio || typeof rawBio !== 'object') {
    return {
      role: defaultRole,
      avatarUrl: './sidebar_picture.png',
      logsRepo: DEFAULT_REPO_SLUG,
    };
  }
  const rawRole = String(rawBio.role || '').trim();
  const cleanRole =
    !rawRole ||
    rawRole === 'Infrastructure & DevOps Engineer · .NET Developer'
      ? defaultRole
      : rawRole;
  return {
    role: cleanRole,
    avatarUrl: resolveSidebarPictureUrl(
      typeof rawBio.avatarUrl === 'string' ? rawBio.avatarUrl : ''
    ),
    logsRepo: normalizeRepoSlug(
      typeof rawBio.logsRepo === 'string' ? rawBio.logsRepo : ''
    ),
  };
}


