import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { InstallAppButton } from '../components/InstallAppButton';
import { MoreOptionsPanel } from '../components/MoreOptionsPanel';
import {
  MultiPosterForm,
  type PersonSlotReport,
  type PersonSlotSeed,
} from '../components/MultiPosterForm';
import {
  ensureFonts,
  getAspectRatio,
  DEFAULT_LAYOUT_OVERRIDES,
  type AspectRatioId,
  type ColorThemeId,
  type PatternId,
} from '../lib/renderPoster';
import {
  renderMultiPoster,
  type MultiPersonInputs,
  type MultiPlacement,
  type PersonCount,
} from '../lib/renderMultiPoster';
import { loadDefaultLogo } from '../lib/defaultLogo';
import {
  bitmapToPngBlob,
  blobToFile,
  canvasToThumbBlob,
  getPoster,
  newPosterId,
  savePoster,
  type SavedMultiplePoster,
  type SavedPerson,
} from '../lib/posterLibrary';
import { preloadCutoutModel, trimTransparent } from '../lib/removeBackground';
import { applyUiTheme, initialUiTheme, type UiTheme } from '../lib/uiTheme';

function emptyReport(placement: number): PersonSlotReport {
  return {
    subject: null,
    subjectIsCutout: false,
    name: '',
    placement: Math.min(8, Math.max(1, placement)) as MultiPlacement,
    hasPhoto: false,
    processing: false,
    error: null,
    photoLabel: null,
    photoFile: null,
    cutout: null,
  };
}

export default function MultipleModePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');

  const [libraryId, setLibraryId] = useState<string | null>(queryId);
  const [personCount, setPersonCount] = useState<PersonCount>(2);
  const [slotReports, setSlotReports] = useState<PersonSlotReport[]>(() => [
    emptyReport(1),
    emptyReport(2),
  ]);
  const [slotSeeds, setSlotSeeds] = useState<PersonSlotSeed[] | null>(null);
  const [slotsKey, setSlotsKey] = useState(queryId ?? 'new');

  const [logo, setLogo] = useState<ImageBitmap | null>(null);
  const [logoCustomFile, setLogoCustomFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioId>('4:5');
  const [colorTheme, setColorTheme] = useState<ColorThemeId>('navy');
  const [pattern, setPattern] = useState<PatternId>('pixels');
  const [logoOpacity, setLogoOpacity] = useState(DEFAULT_LAYOUT_OVERRIDES.logoOpacity);
  const [logoSize, setLogoSize] = useState(DEFAULT_LAYOUT_OVERRIDES.logoSize);
  const [photoSize, setPhotoSize] = useState(DEFAULT_LAYOUT_OVERRIDES.photoSize);
  const [ordinalSize, setOrdinalSize] = useState(DEFAULT_LAYOUT_OVERRIDES.ordinalSize);
  const [nameSize, setNameSize] = useState(DEFAULT_LAYOUT_OVERRIDES.nameSize);
  const [levelSize, setLevelSize] = useState(DEFAULT_LAYOUT_OVERRIDES.levelSize);
  const [titleSize, setTitleSize] = useState(DEFAULT_LAYOUT_OVERRIDES.titleSize);
  const [textPosition, setTextPosition] = useState(DEFAULT_LAYOUT_OVERRIDES.textPosition);
  const [moreOpen, setMoreOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uiTheme, setUiTheme] = useState<UiTheme>(initialUiTheme);
  const [saving, setSaving] = useState(false);
  const [saveLabel, setSaveLabel] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hydrateReady, setHydrateReady] = useState(!queryId);
  const createdAtRef = useRef<number>(Date.now());

  const activeSlots = slotReports.slice(0, personCount);
  const processing = activeSlots.some((s) => s.processing);
  const hasPhotos = activeSlots.length === personCount && activeSlots.every((s) => s.hasPhoto);
  const error = loadError ?? activeSlots.find((s) => s.error)?.error ?? null;

  useEffect(() => {
    applyUiTheme(uiTheme);
  }, [uiTheme]);

  useEffect(() => {
    void preloadCutoutModel();
  }, []);

  useEffect(() => {
    if (!queryId) {
      setHydrateReady(true);
      let cancelled = false;
      loadDefaultLogo()
        .then((bitmap) => {
          if (!cancelled) setLogo(bitmap);
        })
        .catch((err) => console.warn('[logo] default load failed', err));
      return () => {
        cancelled = true;
      };
    }

    let cancelled = false;
    setHydrateReady(false);
    getPoster(queryId)
      .then(async (record) => {
        if (cancelled || !record || record.mode !== 'multiple') {
          if (!cancelled) {
            setLoadError('Saved poster not found.');
            setHydrateReady(true);
            loadDefaultLogo().then(setLogo).catch(() => setLogo(null));
          }
          return;
        }
        createdAtRef.current = record.createdAt;
        setLibraryId(record.id);
        setTitle(record.title);
        setLevel(record.level);
        setPersonCount(record.personCount);
        setAspectRatio(record.aspectRatio);
        setColorTheme(record.colorTheme);
        setPattern(record.pattern);
        setLogoOpacity(record.layoutOverrides.logoOpacity);
        setLogoSize(record.layoutOverrides.logoSize);
        setPhotoSize(record.layoutOverrides.photoSize);
        setOrdinalSize(record.layoutOverrides.ordinalSize);
        setNameSize(record.layoutOverrides.nameSize);
        setLevelSize(record.layoutOverrides.levelSize);
        setTitleSize(record.layoutOverrides.titleSize);
        setTextPosition(record.layoutOverrides.textPosition);

        if (record.logo.kind === 'custom') {
          const file = blobToFile(record.logo.blob, record.logo.name);
          setLogoCustomFile(file);
          const bitmap = await createImageBitmap(record.logo.blob).then(trimTransparent);
          if (!cancelled) setLogo(bitmap);
        } else {
          setLogoCustomFile(null);
          const bitmap = await loadDefaultLogo();
          if (!cancelled) setLogo(bitmap);
        }

        const seeds: PersonSlotSeed[] = record.people.map((person) => ({
          name: person.name,
          placement: person.placement,
          photoFile: person.photoBlob
            ? blobToFile(person.photoBlob, person.photoName || 'photo.png')
            : null,
          photoLabel: person.photoName,
          cutoutBlob: person.cutoutBlob,
        }));
        setSlotReports(
          Array.from({ length: record.personCount }, (_, i) => emptyReport(i + 1)),
        );
        setSlotSeeds(seeds);
        setSlotsKey(record.id);
        if (!cancelled) setHydrateReady(true);
      })
      .catch((err) => {
        console.error('[library]', err);
        if (!cancelled) {
          setLoadError('Could not load saved poster.');
          setHydrateReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [queryId]);

  useEffect(() => {
    setSlotReports((prev) => {
      if (prev.length === personCount) return prev;
      if (prev.length < personCount) {
        const next = [...prev];
        while (next.length < personCount) {
          next.push(emptyReport(next.length + 1));
        }
        return next;
      }
      return prev.slice(0, personCount);
    });
  }, [personCount]);

  const handlePersonReport = useCallback((index: number, report: PersonSlotReport) => {
    setSlotReports((prev) => {
      const next =
        prev.length > index
          ? [...prev]
          : [
              ...prev,
              ...Array.from({ length: index - prev.length + 1 }, (_, i) =>
                emptyReport(prev.length + i + 1),
              ),
            ];
      next[index] = report;
      return next;
    });
  }, []);

  const handleLogoChange = useCallback((file: File | null) => {
    if (!file) {
      setLogoCustomFile(null);
      loadDefaultLogo()
        .then(setLogo)
        .catch(() => setLogo(null));
      return;
    }
    setLogoCustomFile(file);
    createImageBitmap(file).then(trimTransparent).then(setLogo);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hydrateReady) return;
    let cancelled = false;
    const people: MultiPersonInputs[] = slotReports.slice(0, personCount).map((s) => ({
      subject: s.subject,
      subjectIsCutout: s.subjectIsCutout,
      name: s.name,
      placement: s.placement,
    }));

    ensureFonts().then(() => {
      if (cancelled) return;
      renderMultiPoster(canvas, {
        people,
        logo,
        title,
        level,
        aspectRatio,
        colorTheme,
        pattern,
        layoutOverrides: {
          logoOpacity,
          logoSize,
          photoSize,
          ordinalSize,
          nameSize,
          levelSize,
          titleSize,
          textPosition,
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [
    hydrateReady,
    slotReports,
    personCount,
    logo,
    title,
    level,
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
  ]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      const safeTitle = (title.trim() || 'multi').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const ratioSlug = aspectRatio.replace(':', 'x');
      anchor.href = url;
      anchor.download = `poster-multi-${safeTitle}-${personCount}p-${ratioSlug}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, [title, aspectRatio, personCount]);

  const handleSave = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasPhotos) return;
    setSaving(true);
    setSaveLabel(null);
    try {
      const id = libraryId ?? newPosterId();
      const now = Date.now();
      const people: SavedPerson[] = [];
      for (const slot of activeSlots) {
        const cutoutBlob = slot.cutout ? await bitmapToPngBlob(slot.cutout) : null;
        people.push({
          name: slot.name,
          placement: slot.placement,
          photoBlob: slot.photoFile,
          photoName: slot.photoFile?.name ?? slot.photoLabel,
          cutoutBlob,
        });
      }
      const thumbBlob = await canvasToThumbBlob(canvas);
      const record: SavedMultiplePoster = {
        id,
        mode: 'multiple',
        createdAt: libraryId ? createdAtRef.current : now,
        updatedAt: now,
        label: title.trim() || level.trim() || 'Untitled multiple',
        title,
        level,
        aspectRatio,
        colorTheme,
        pattern,
        layoutOverrides: {
          logoOpacity,
          logoSize,
          photoSize,
          ordinalSize,
          nameSize,
          levelSize,
          titleSize,
          textPosition,
        },
        logo: logoCustomFile
          ? { kind: 'custom', blob: logoCustomFile, name: logoCustomFile.name }
          : { kind: 'default' },
        thumbBlob,
        personCount,
        people,
      };
      await savePoster(record);
      createdAtRef.current = record.createdAt;
      setLibraryId(id);
      if (queryId !== id) navigate(`/multiple?id=${id}`, { replace: true });
      setSaveLabel('Saved to Library');
      window.setTimeout(() => setSaveLabel(null), 2500);
    } catch (err) {
      console.error('[library] save', err);
      setSaveLabel('Save failed');
    } finally {
      setSaving(false);
    }
  }, [
    libraryId,
    queryId,
    navigate,
    hasPhotos,
    activeSlots,
    logoCustomFile,
    title,
    level,
    personCount,
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
  ]);

  const ratio = getAspectRatio(aspectRatio);

  return (
    <div className={`app${moreOpen ? ' more-open' : ''}`}>
      <div className="mobile-toolbar">
        <button
          type="button"
          className="hamburger-btn"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
        <span className="mobile-toolbar-title">Multiple Mode</span>
        <div className="mobile-toolbar-actions">
          <Link to="/library" className="home-nav-link compact" aria-label="Library">
            Library
          </Link>
          <Link to="/" className="home-nav-link compact" aria-label="Back to Home">
            Home
          </Link>
          <div className="theme-toggle compact" role="group" aria-label="Color mode">
            <button
              type="button"
              className={`theme-toggle-option${uiTheme === 'light' ? ' active' : ''}`}
              aria-label="Light mode"
              aria-pressed={uiTheme === 'light'}
              onClick={() => setUiTheme('light')}
            >
              Light
            </button>
            <button
              type="button"
              className={`theme-toggle-option${uiTheme === 'dark' ? ' active' : ''}`}
              aria-label="Dark mode"
              aria-pressed={uiTheme === 'dark'}
              onClick={() => setUiTheme('dark')}
            >
              Dark
            </button>
          </div>
          <button
            type="button"
            className="mobile-download-btn"
            disabled={!hasPhotos || processing}
            aria-label="Download poster"
            onClick={handleDownload}
          >
            ↓
          </button>
        </div>
      </div>

      {menuOpen && <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />}

      <aside className={`panel${menuOpen ? ' menu-open' : ''}`}>
        <header className="panel-header">
          <div className="panel-header-text">
            <div className="panel-nav-row">
              <Link to="/" className="home-nav-link">
                ← Home
              </Link>
              <Link to="/library" className="home-nav-link">
                Library
              </Link>
            </div>
            <h1>Multiple Mode</h1>
            <p>Race-style poster for 2–8 people — save or download.</p>
          </div>
          <div className="panel-header-actions">
            <InstallAppButton />
            <button
              type="button"
              className="drawer-close-btn"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>
            <div className="theme-toggle" role="group" aria-label="Color mode">
              <button
                type="button"
                className={`theme-toggle-option${uiTheme === 'light' ? ' active' : ''}`}
                aria-label="Light mode"
                aria-pressed={uiTheme === 'light'}
                onClick={() => setUiTheme('light')}
              >
                Light
              </button>
              <button
                type="button"
                className={`theme-toggle-option${uiTheme === 'dark' ? ' active' : ''}`}
                aria-label="Dark mode"
                aria-pressed={uiTheme === 'dark'}
                onClick={() => setUiTheme('dark')}
              >
                Dark
              </button>
            </div>
          </div>
        </header>
        <MultiPosterForm
          personCount={personCount}
          onPersonCountChange={setPersonCount}
          title={title}
          level={level}
          moreOpen={moreOpen}
          hasPhotos={hasPhotos}
          processing={processing}
          error={error}
          saving={saving}
          saveLabel={saveLabel}
          slotsKey={slotsKey}
          slotSeeds={slotSeeds}
          onLogoChange={handleLogoChange}
          onTitleChange={setTitle}
          onLevelChange={setLevel}
          onPersonReport={handlePersonReport}
          onToggleMore={() => setMoreOpen((open) => !open)}
          onDownload={handleDownload}
          onSave={handleSave}
        />
      </aside>

      <MoreOptionsPanel
        open={moreOpen}
        aspectRatio={aspectRatio}
        colorTheme={colorTheme}
        pattern={pattern}
        logoOpacity={logoOpacity}
        logoSize={logoSize}
        photoSize={photoSize}
        ordinalSize={ordinalSize}
        nameSize={nameSize}
        levelSize={levelSize}
        titleSize={titleSize}
        textPosition={textPosition}
        onClose={() => setMoreOpen(false)}
        onAspectRatioChange={setAspectRatio}
        onColorThemeChange={setColorTheme}
        onPatternChange={setPattern}
        onLogoOpacityChange={setLogoOpacity}
        onLogoSizeChange={setLogoSize}
        onPhotoSizeChange={setPhotoSize}
        onOrdinalSizeChange={setOrdinalSize}
        onNameSizeChange={setNameSize}
        onLevelSizeChange={setLevelSize}
        onTitleSizeChange={setTitleSize}
        onTextPositionChange={setTextPosition}
      />

      <main className="preview">
        <div
          className="preview-frame"
          style={
            {
              '--poster-ar': String(ratio.width / ratio.height),
            } as CSSProperties
          }
        >
          <canvas ref={canvasRef} className="poster-canvas" />
          {(processing || !hydrateReady) && (
            <div className="preview-overlay">
              <div className="spinner" />
              <span>{hydrateReady ? 'Removing background…' : 'Loading saved poster…'}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
