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
  logoOpacity: number;
  logoSize: number;
  photoSize: number;
  ordinalSize: number;
  nameSize: number;
  levelSize: number;
  titleSize: number;
  textPosition: number;
  onClose: () => void;
  onAspectRatioChange: (aspectRatio: AspectRatioId) => void;
  onColorThemeChange: (theme: ColorThemeId) => void;
  onPatternChange: (pattern: PatternId) => void;
  onLogoOpacityChange: (opacity: number) => void;
  onLogoSizeChange: (v: number) => void;
  onPhotoSizeChange: (v: number) => void;
  onOrdinalSizeChange: (v: number) => void;
  onNameSizeChange: (v: number) => void;
  onLevelSizeChange: (v: number) => void;
  onTitleSizeChange: (v: number) => void;
  onTextPositionChange: (v: number) => void;
}

function AdjustSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  leftHint,
  rightHint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  leftHint?: string;
  rightHint?: string;
}) {
  return (
    <div className="field">
      <div className="field-label-row">
        <span className="field-label">{label}</span>
        <span className="field-value">{value % 1 === 0 ? value : value.toFixed(1)}%</span>
      </div>
      <input
        className="range-input"
        type="range"
        min={min}
        max={max}
        step={0.1}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {(leftHint || rightHint) && (
        <div className="range-hints">
          <span>{leftHint}</span>
          <span>{rightHint}</span>
        </div>
      )}
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

        <AdjustSlider label="Logo size" value={logoSize} onChange={onLogoSizeChange} leftHint="Small" rightHint="Large" />
        <AdjustSlider label="Photo size" value={photoSize} onChange={onPhotoSizeChange} leftHint="Small" rightHint="Large" />
        <AdjustSlider label="Ordinal size" value={ordinalSize} onChange={onOrdinalSizeChange} leftHint="Small" rightHint="Large" />
        <AdjustSlider label="Name size" value={nameSize} onChange={onNameSizeChange} leftHint="Small" rightHint="Large" />
        <AdjustSlider label="Level size" value={levelSize} onChange={onLevelSizeChange} leftHint="Small" rightHint="Large" />
        <AdjustSlider label="Title size" value={titleSize} onChange={onTitleSizeChange} leftHint="Small" rightHint="Large" />
        <AdjustSlider label="Text position" value={textPosition} onChange={onTextPositionChange} leftHint="Up" rightHint="Down" />
      </div>
    </aside>
  );
}
