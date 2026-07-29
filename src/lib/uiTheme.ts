export type UiTheme = 'light' | 'dark';

export function readStoredTheme(): UiTheme {
  try {
    const stored = localStorage.getItem('poster-ui-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export function applyUiTheme(theme: UiTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem('poster-ui-theme', theme);
  } catch {
    /* ignore */
  }
}

export function initialUiTheme(): UiTheme {
  if (typeof document !== 'undefined') {
    const current = document.documentElement.dataset.theme;
    if (current === 'light' || current === 'dark') return current;
  }
  return readStoredTheme();
}
