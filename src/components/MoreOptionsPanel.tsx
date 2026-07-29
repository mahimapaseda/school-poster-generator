import {
  ASPECT_RATIOS,
  COLOR_THEMES,
  PATTERNS,
  SIZE_PRESETS,
  TEXT_POSITIONS,
  type AspectRatioId,
  type ColorThemeId,
  type PatternId,
  type SizePreset,
  type TextPosition,
} from '../lib/renderPoster';

interface MoreOptionsPanelProps {
  open: boolean;
  aspectRatio: AspectRatioId;
  colorTheme: ColorThemeId;
  pattern: PatternId;
  logoOpacity: number;
  logoSize: SizePreset;
  photoSize: SizePreset;
  ordinalSize: SizePreset;
  nameSize: SizePreset;
  levelSize: SizePreset;
  titleSize: SizePreset;
  textPosition: TextPosition;
  onClose: () => void;
  onAspectRatioChange: (aspectRatio: AspectRatioId) => void;
  onColorThemeChange: (theme: ColorThemeId) => void;
  onPatternChange: (pattern: PatternId) => void;
  onLogoOpacityChange: (opacity: number) => void;
  onLogoSizeChange: (size: SizePreset) => void;
  onPhotoSizeChange: (size: SizePreset) => void;
  onOrdinalSizeChange: (size: SizePreset) => void;
  onNameSizeChange: (size: SizePreset) => void;
  onLevelSizeChange: (size: SizePreset) => void;
  onTitleSizeChange: (size: SizePreset) => void;
  onTextPositionChange: (position: TextPosition) => void;
}

function SizeSegmented({
  value,
  onChange,
}: {
  value: SizePreset;
  onChange: (size: SizePreset) => void;
}) {
  return (
    <div className="segmented">
      {SIZE_PRESETS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={value === id ? 'active' : ''}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function MoreOptionsPanel({
  open,
  aspectRatio,
  colorTheme,
  pattern,
  logoOpacity,
  logoSize,
  photoSize,
  ordinalSize,
  nameSize,
  levelSize,
  titleSize,
  textPosition,
  onClose,
  onAspectRatioChange,
  onColorThemeChange,
  onPatternChange,
  onLogoOpacityChange,
  onLogoSizeChange,
  onPhotoSizeChange,
  onOrdinalSizeChange,
  onNameSizeChange,
  onLevelSizeChange,
  onTitleSizeChange,
  onTextPositionChange,
}: MoreOptionsPanelProps) {
  if (!open) return null;

  const opacityPct = Math.round(logoOpacity * 100);

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

        <div className="field">
          <div className="field-label-row">
            <span className="field-label">Logo opacity</span>
            <span className="field-value">{opacityPct}%</span>
          </div>
          <input
            className="range-input"
            type="range"
            min={20}
            max={100}
            step={1}
            value={opacityPct}
            aria-label="Logo opacity"
            onChange={(event) => onLogoOpacityChange(Number(event.target.value) / 100)}
          />
        </div>

        <div className="field-row compact">
          <div className="field">
            <span className="field-label">Logo size</span>
            <SizeSegmented value={logoSize} onChange={onLogoSizeChange} />
          </div>
          <div className="field">
            <span className="field-label">Photo size</span>
            <SizeSegmented value={photoSize} onChange={onPhotoSizeChange} />
          </div>
        </div>

        <div className="field-row compact">
          <div className="field">
            <span className="field-label">Ordinal size</span>
            <SizeSegmented value={ordinalSize} onChange={onOrdinalSizeChange} />
          </div>
          <div className="field">
            <span className="field-label">Name size</span>
            <SizeSegmented value={nameSize} onChange={onNameSizeChange} />
          </div>
        </div>

        <div className="field-row compact">
          <div className="field">
            <span className="field-label">Level size</span>
            <SizeSegmented value={levelSize} onChange={onLevelSizeChange} />
          </div>
          <div className="field">
            <span className="field-label">Title size</span>
            <SizeSegmented value={titleSize} onChange={onTitleSizeChange} />
          </div>
        </div>

        <div className="field">
          <span className="field-label">Text position</span>
          <div className="segmented">
            {TEXT_POSITIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={textPosition === id ? 'active' : ''}
                onClick={() => onTextPositionChange(id)}
              >
                {label === 'Default' ? 'Mid' : label === 'Higher' ? 'Up' : 'Down'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
