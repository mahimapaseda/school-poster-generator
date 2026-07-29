import { useCallback, useEffect, useState, type ChangeEvent, type DragEvent } from 'react';
import { DEFAULT_LOGO_LABEL } from '../lib/defaultLogo';
import {
  MULTI_PLACEMENTS,
  PERSON_COUNTS,
  multiPlacementLabel,
  type MultiPersonInputs,
  type MultiPlacement,
  type PersonCount,
} from '../lib/renderMultiPoster';
import { getCutout } from '../lib/removeBackground';

export interface PersonSlotReport extends MultiPersonInputs {
  hasPhoto: boolean;
  processing: boolean;
  error: string | null;
  photoLabel: string | null;
}

interface MultiPosterFormProps {
  personCount: PersonCount;
  onPersonCountChange: (count: PersonCount) => void;
  title: string;
  level: string;
  moreOpen: boolean;
  hasPhotos: boolean;
  processing: boolean;
  error: string | null;
  onLogoChange: (file: File | null) => void;
  onTitleChange: (title: string) => void;
  onLevelChange: (level: string) => void;
  onPersonReport: (index: number, report: PersonSlotReport) => void;
  onToggleMore: () => void;
  onDownload: () => void;
}

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

function PersonPhotoDropzone({
  label,
  photoLabel,
  onPhotoChange,
}: {
  label: string;
  photoLabel: string | null;
  onPhotoChange: (file: File | null) => void;
}) {
  const [dragging, setDragging] = useState(false);

  const acceptPhoto = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith('image/')) return;
      onPhotoChange(file);
    },
    [onPhotoChange],
  );

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <label
        className={`dropzone${dragging ? ' dragging' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event: DragEvent<HTMLLabelElement>) => {
          event.preventDefault();
          setDragging(false);
          acceptPhoto(event.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            acceptPhoto(event.target.files?.[0])
          }
        />
        {photoLabel ? (
          <span className="dropzone-file">{photoLabel}</span>
        ) : (
          <span>Drop photo or click to browse</span>
        )}
      </label>
    </div>
  );
}

function PersonSlotEditor({
  index,
  defaultPlacement,
  onReport,
}: {
  index: number;
  defaultPlacement: MultiPlacement;
  onReport: (index: number, report: PersonSlotReport) => void;
}) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoLabel, setPhotoLabel] = useState<string | null>(null);
  const [rawPhoto, setRawPhoto] = useState<ImageBitmap | null>(null);
  const [cutout, setCutout] = useState<ImageBitmap | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [placement, setPlacement] = useState<MultiPlacement>(defaultPlacement);

  const handlePhotoChange = useCallback((file: File | null) => {
    setPhotoFile(file);
    setPhotoLabel(file?.name ?? null);
  }, []);

  useEffect(() => {
    if (!photoFile) {
      setRawPhoto(null);
      setCutout(null);
      setProcessing(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setError(null);
    setCutout(null);
    setProcessing(true);
    createImageBitmap(photoFile).then((bitmap) => {
      if (!cancelled) setRawPhoto(bitmap);
    });
    getCutout(photoFile)
      .then((bitmap) => {
        if (!cancelled) setCutout(bitmap);
      })
      .catch((err) => {
        console.error('[cutout]', err);
        if (!cancelled) setError('Background removal failed — using the original photo.');
      })
      .finally(() => {
        if (!cancelled) setProcessing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [photoFile]);

  useEffect(() => {
    onReport(index, {
      subject: cutout ?? rawPhoto,
      subjectIsCutout: cutout !== null,
      name,
      placement,
      hasPhoto: photoFile !== null,
      processing,
      error,
      photoLabel,
    });
  }, [
    index,
    cutout,
    rawPhoto,
    name,
    placement,
    photoFile,
    processing,
    error,
    photoLabel,
    onReport,
  ]);

  const sideHint = index % 2 === 0 ? 'left' : 'right';

  return (
    <section className="person-section">
      <h3 className="person-section-title">
        Person {index + 1} ({sideHint})
      </h3>
      <PersonPhotoDropzone
        label="Photo"
        photoLabel={photoLabel}
        onPhotoChange={handlePhotoChange}
      />
      <div className="field">
        <label className="field-label" htmlFor={`person-${index}-name`}>
          Name
        </label>
        <input
          id={`person-${index}-name`}
          type="text"
          value={name}
          placeholder="Full name"
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="field">
        <span className="field-label">Placement</span>
        <div className="segmented wrap">
          {MULTI_PLACEMENTS.map((value) => (
            <button
              key={value}
              type="button"
              className={placement === value ? 'active' : ''}
              onClick={() => setPlacement(value)}
            >
              {multiPlacementLabel(value)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MultiPosterForm({
  personCount,
  onPersonCountChange,
  title,
  level,
  moreOpen,
  hasPhotos,
  processing,
  error,
  onLogoChange,
  onTitleChange,
  onLevelChange,
  onPersonReport,
  onToggleMore,
  onDownload,
}: MultiPosterFormProps) {
  const [logoLabel, setLogoLabel] = useState<string | null>(DEFAULT_LOGO_LABEL);

  const handleLogoInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      setLogoLabel(file?.name ?? DEFAULT_LOGO_LABEL);
      onLogoChange(file);
    },
    [onLogoChange],
  );

  const handlePersonReport = useCallback(
    (index: number, report: PersonSlotReport) => {
      onPersonReport(index, report);
    },
    [onPersonReport],
  );

  return (
    <div className="form">
      <div className="form-fields">
        <div className="field">
          <span className="field-label">Event logo</span>
          <label className="file-button">
            <input type="file" accept="image/*" onChange={handleLogoInput} hidden />
            {logoLabel ?? 'Choose logo'}
          </label>
        </div>

        <div className="field">
          <span className="field-label">Person count</span>
          <div className="segmented wrap">
            {PERSON_COUNTS.map((count) => (
              <button
                key={count}
                type="button"
                className={personCount === count ? 'active' : ''}
                onClick={() => onPersonCountChange(count)}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="multi-level">
            Level / subtitle
          </label>
          <input
            id="multi-level"
            type="text"
            value={level}
            list="multi-level-presets"
            placeholder="e.g. Hungary / Central Province"
            onChange={(event) => onLevelChange(event.target.value)}
          />
          <datalist id="multi-level-presets">
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
          <label className="field-label" htmlFor="multi-title">
            Title
          </label>
          <input
            id="multi-title"
            type="text"
            value={title}
            placeholder="e.g. Race Result"
            onChange={(event) => onTitleChange(event.target.value)}
          />
        </div>

        {Array.from({ length: personCount }, (_, index) => {
          const defaultPlacement = (Math.min(8, index + 1) as MultiPlacement);
          return (
            <PersonSlotEditor
              key={`person-slot-${index}`}
              index={index}
              defaultPlacement={defaultPlacement}
              onReport={handlePersonReport}
            />
          );
        })}
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

        <button
          type="button"
          className="download-button"
          disabled={!hasPhotos || processing}
          onClick={onDownload}
        >
          {processing ? 'Processing photos…' : 'Download poster (PNG)'}
        </button>
      </div>
    </div>
  );
}
