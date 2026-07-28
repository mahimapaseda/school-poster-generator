import { useCallback, useState, type DragEvent, type ChangeEvent } from 'react';
import {
  ASPECT_RATIOS,
  type AspectRatioId,
  type Placement,
} from '../lib/renderPoster';

interface PosterFormProps {
  hasPhoto: boolean;
  processing: boolean;
  name: string;
  placement: Placement;
  aspectRatio: AspectRatioId;
  error: string | null;
  onPhotoChange: (file: File | null) => void;
  onLogoChange: (file: File | null) => void;
  onNameChange: (name: string) => void;
  onPlacementChange: (placement: Placement) => void;
  onAspectRatioChange: (aspectRatio: AspectRatioId) => void;
  onDownload: () => void;
}

const PLACEMENTS: Array<{ value: Placement; label: string }> = [
  { value: 1, label: '1st Place' },
  { value: 2, label: '2nd Place' },
  { value: 3, label: '3rd Place' },
];

export function PosterForm({
  hasPhoto,
  processing,
  name,
  placement,
  aspectRatio,
  error,
  onPhotoChange,
  onLogoChange,
  onNameChange,
  onPlacementChange,
  onAspectRatioChange,
  onDownload,
}: PosterFormProps) {
  const [dragging, setDragging] = useState(false);
  const [photoLabel, setPhotoLabel] = useState<string | null>(null);
  const [logoLabel, setLogoLabel] = useState<string | null>(null);

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
