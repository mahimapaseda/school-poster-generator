import { useCallback, useState, type DragEvent, type ChangeEvent } from 'react';
import { DEFAULT_LOGO_LABEL } from '../lib/defaultLogo';
import type { Placement } from '../lib/renderPoster';

interface PosterFormProps {
  hasPhoto: boolean;
  processing: boolean;
  name: string;
  level: string;
  title: string;
  category: string;
  placement: Placement;
  moreOpen: boolean;
  error: string | null;
  saving?: boolean;
  saveLabel?: string | null;
  onPhotoChange: (file: File | null) => void;
  onLogoChange: (file: File | null) => void;
  onNameChange: (name: string) => void;
  onLevelChange: (level: string) => void;
  onTitleChange: (title: string) => void;
  onCategoryChange: (category: string) => void;
  onPlacementChange: (placement: Placement) => void;
  onToggleMore: () => void;
  onDownload: () => void;
  onSave: () => void;
  /** Shown when parent restored a photo from the library. */
  photoLabelHint?: string | null;
}

const PLACEMENTS: Array<{ value: Placement; label: string }> = [
  { value: 1, label: '1st' },
  { value: 2, label: '2nd' },
  { value: 3, label: '3rd' },
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
  category,
  placement,
  moreOpen,
  error,
  saving = false,
  saveLabel = null,
  photoLabelHint = null,
  onPhotoChange,
  onLogoChange,
  onNameChange,
  onLevelChange,
  onTitleChange,
  onCategoryChange,
  onPlacementChange,
  onToggleMore,
  onDownload,
  onSave,
}: PosterFormProps) {
  const [dragging, setDragging] = useState(false);
  const [photoLabel, setPhotoLabel] = useState<string | null>(null);
  const [logoLabel, setLogoLabel] = useState<string | null>(DEFAULT_LOGO_LABEL);

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
      setLogoLabel(file?.name ?? DEFAULT_LOGO_LABEL);
      onLogoChange(file);
    },
    [onLogoChange],
  );

  return (
    <div className="form">
      <div className="form-fields">
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
            {photoLabel || photoLabelHint ? (
              <span className="dropzone-file">{photoLabel ?? photoLabelHint}</span>
            ) : (
              <span>Drop photo or click to browse</span>
            )}
          </label>
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
            placeholder="e.g. All Island"
            onChange={(event) => onLevelChange(event.target.value)}
          />
          <datalist id="level-presets">
            {LEVEL_PRESETS.map((preset) => (
              <option key={preset} value={preset} />
            ))}
          </datalist>
          <div className="chip-row">
            {LEVEL_PRESETS.slice(0, 3).map((preset) => (
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
          <label className="field-label" htmlFor="competition-category">
            Category
          </label>
          <input
            id="competition-category"
            type="text"
            value={category}
            placeholder="e.g. 48kg, Health, Environment"
            onChange={(event) => onCategoryChange(event.target.value)}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <span className="field-label">School logo</span>
            <label className="file-button">
              <input type="file" accept="image/*" onChange={handleLogoInput} hidden />
              {logoLabel ?? 'Choose logo'}
            </label>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="student-name">
              Student name
            </label>
            <input
              id="student-name"
              type="text"
              value={name}
              placeholder="Full name"
              onChange={(event) => onNameChange(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className={`more-options-toggle-btn${moreOpen ? ' active' : ''}`}
          aria-expanded={moreOpen}
          onClick={onToggleMore}
        >
          <span>More options</span>
          <span className="chevron-right">{moreOpen ? '◂' : '▸'}</span>
        </button>

        {error && <p className="form-error">{error}</p>}
        {saveLabel && <p className="form-save-status">{saveLabel}</p>}

        <div className="form-action-row">
          <button
            type="button"
            className="save-button"
            disabled={!hasPhoto || processing || saving}
            onClick={onSave}
          >
            {saving ? 'Saving…' : 'Save to Library'}
          </button>
          <button
            type="button"
            className="download-button"
            disabled={!hasPhoto || processing}
            onClick={onDownload}
          >
            {processing ? 'Processing photo…' : 'Download poster (PNG)'}
          </button>
        </div>
      </div>
    </div>
  );
}
