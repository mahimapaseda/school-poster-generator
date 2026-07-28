import { useCallback, useState, type DragEvent, type ChangeEvent } from 'react';
import {
  ASPECT_RATIOS,
  COLOR_THEMES,
  PATTERNS,
  type AspectRatioId,
  type ColorThemeId,
  type PatternId,
  type Placement,
} from '../lib/renderPoster';

interface PosterFormProps {
  hasPhoto: boolean;
  processing: boolean;
  name: string;
  level: string;
  title: string;
  placement: Placement;
  aspectRatio: AspectRatioId;
  colorTheme: ColorThemeId;
  pattern: PatternId;
  error: string | null;
  onPhotoChange: (file: File | null) => void;
  onLogoChange: (file: File | null) => void;
  onNameChange: (name: string) => void;
  onLevelChange: (level: string) => void;
  onTitleChange: (title: string) => void;
  onPlacementChange: (placement: Placement) => void;
  onAspectRatioChange: (aspectRatio: AspectRatioId) => void;
  onColorThemeChange: (theme: ColorThemeId) => void;
  onPatternChange: (pattern: PatternId) => void;
  onDownload: () => void;
}

const PLACEMENTS: Array<{ value: Placement; label: string }> = [
  { value: 1, label: '1st Place' },
  { value: 2, label: '2nd Place' },
  { value: 3, label: '3rd Place' },
];

const LEVEL_PRESETS = [
  'All Island',
  'Central Province',
  'Western Province',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Uva Province',
  'Sabaragamuwa Province',
];

export function PosterForm({
  hasPhoto,
  processing,
  name,
  level,
  title,
  placement,
  aspectRatio,
  colorTheme,
  pattern,
  error,
  onPhotoChange,
  onLogoChange,
  onNameChange,
  onLevelChange,
  onTitleChange,
  onPlacementChange,
  onAspectRatioChange,
  onColorThemeChange,
  onPatternChange,
  onDownload,
}: PosterFormProps) {
  const [dragging, setDragging] = useState(false);
  const [photoLabel, setPhotoLabel] = useState<string | null>(null);
  const [logoLabel, setLogoLabel] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const acceptPhoto = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith('image/')) return;
      setPhotoLabel(file.name);
      onPhotoChange(file);
    },
    [onPhotoChange],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setDragging(false);
      acceptPhoto(event.dataTransfer.files[0]);
    },
    [acceptPhoto],
  );

  const handlePhotoInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      acceptPhoto(event.target.files?.[0]);
    },
    [acceptPhoto],
  );

  const handleLogoInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      setLogoLabel(file?.name ?? null);
      onLogoChange(file);
    },
    [onLogoChange],
  );

  return (
    <div className="form">
      <div className="field">
        <span className="field-label">Student photo</span>
        <label
          className={`dropzone${dragging ? ' dragging' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input type="file" accept="image/*" onChange={handlePhotoInput} hidden />
          {photoLabel ? (
            <span className="dropzone-file">{photoLabel}</span>
          ) : (
            <span>Drag a photo here or click to browse</span>
          )}
        </label>
        <span className="field-hint">Background removal and color adjustment are automatic.</span>
      </div>

      <div className="field">
        <span className="field-label">Placement</span>
        <div className="segmented">
          {PLACEMENTS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={placement === value ? 'active' : ''}
              onClick={() => onPlacementChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="competition-level">
          Level
        </label>
        <input
          id="competition-level"
          type="text"
          value={level}
          list="level-presets"
          placeholder="e.g. All Island, Central Province"
          onChange={(event) => onLevelChange(event.target.value)}
        />
        <datalist id="level-presets">
          {LEVEL_PRESETS.map((preset) => (
            <option key={preset} value={preset} />
          ))}
        </datalist>
        <div className="chip-row">
          {LEVEL_PRESETS.slice(0, 4).map((preset) => (
            <button
              key={preset}
              type="button"
              className={`chip${level === preset ? ' active' : ''}`}
              onClick={() => onLevelChange(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="competition-title">
          Title
        </label>
        <input
          id="competition-title"
          type="text"
          value={title}
          placeholder="e.g. Innovation & Robotic Competition"
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </div>

      <div className="field">
        <span className="field-label">School logo</span>
        <label className="file-button">
          <input type="file" accept="image/*" onChange={handleLogoInput} hidden />
          {logoLabel ?? 'Choose logo image'}
        </label>
        <span className="field-hint">Shown in the top-left corner. Transparent PNG works best.</span>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="student-name">
          Student name
        </label>
        <input
          id="student-name"
          type="text"
          value={name}
          placeholder="e.g. Max Verstappen"
          onChange={(event) => onNameChange(event.target.value)}
        />
      </div>

      <div className="more-options">
        <button
          type="button"
          className="more-options-toggle"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((open) => !open)}
        >
          <span>More options</span>
          <span className={`chevron${moreOpen ? ' open' : ''}`}>▾</span>
        </button>

        {moreOpen && (
          <div className="more-options-body">
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
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      <button
        type="button"
        className="download-button"
        disabled={!hasPhoto || processing}
        onClick={onDownload}
      >
        {processing ? 'Processing photo…' : 'Download poster (PNG)'}
      </button>
    </div>
  );
}
