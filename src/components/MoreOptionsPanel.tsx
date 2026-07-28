import {
  ASPECT_RATIOS,
  COLOR_THEMES,
  PATTERNS,
  type AspectRatioId,
  type ColorThemeId,
  type PatternId,
} from '../lib/renderPoster';

interface MoreOptionsPanelProps {
  open: boolean;
  aspectRatio: AspectRatioId;
  colorTheme: ColorThemeId;
  pattern: PatternId;
  onClose: () => void;
  onAspectRatioChange: (aspectRatio: AspectRatioId) => void;
  onColorThemeChange: (theme: ColorThemeId) => void;
  onPatternChange: (pattern: PatternId) => void;
}

export function MoreOptionsPanel({
  open,
  aspectRatio,
  colorTheme,
  pattern,
  onClose,
  onAspectRatioChange,
  onColorThemeChange,
  onPatternChange,
}: MoreOptionsPanelProps) {
  if (!open) return null;

  return (
    <aside className="more-panel" aria-label="More options">
      <header className="more-panel-header">
        <h2>More options</h2>
        <button type="button" className="more-panel-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </header>

      <div className="more-panel-body">
        <div className="field">
          <span className="field-label">Image ratio</span>
          <div className="segmented wrap">
            {ASPECT_RATIOS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={aspectRatio === id ? 'active' : ''}
                onClick={() => onAspectRatioChange(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="field-label">Color theme</span>
          <div className="theme-swatches">
            {COLOR_THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`theme-swatch${colorTheme === theme.id ? ' active' : ''}`}
                title={theme.label}
                aria-label={theme.label}
                style={{ background: theme.swatch }}
                onClick={() => onColorThemeChange(theme.id)}
              >
                <span className="theme-swatch-label">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="field-label">Pattern</span>
          <div className="segmented wrap">
            {PATTERNS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={pattern === id ? 'active' : ''}
                onClick={() => onPatternChange(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
