import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { InstallAppButton } from '../components/InstallAppButton';
import { MoreOptionsPanel } from '../components/MoreOptionsPanel';
import { PosterForm } from '../components/PosterForm';
import {
  ensureFonts,
  getAspectRatio,
  renderPoster,
  DEFAULT_LAYOUT_OVERRIDES,
  type AspectRatioId,
  type ColorThemeId,
  type PatternId,
  type Placement,
} from '../lib/renderPoster';
import { loadDefaultLogo } from '../lib/defaultLogo';
import {
  bitmapToPngBlob,
  blobToFile,
  canvasToThumbBlob,
  getPoster,
  newPosterId,
  savePoster,
  type SavedSinglePoster,
} from '../lib/posterLibrary';
import { getCutout, preloadCutoutModel, trimTransparent } from '../lib/removeBackground';
import { applyUiTheme, initialUiTheme, type UiTheme } from '../lib/uiTheme';

export default function SingleModePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');

  const [libraryId, setLibraryId] = useState<string | null>(queryId);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoLabelHint, setPhotoLabelHint] = useState<string | null>(null);
  const [rawPhoto, setRawPhoto] = useState<ImageBitmap | null>(null);
  const [cutout, setCutout] = useState<ImageBitmap | null>(null);
  const [processing, setProcessing] = useState(false);
  const [logo, setLogo] = useState<ImageBitmap | null>(null);
  const [logoCustomFile, setLogoCustomFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [placement, setPlacement] = useState<Placement>(1);
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
  const [error, setError] = useState<string | null>(null);
  const [uiTheme, setUiTheme] = useState<UiTheme>(initialUiTheme);
  const [saving, setSaving] = useState(false);
  const [saveLabel, setSaveLabel] = useState<string | null>(null);
  const [hydrateReady, setHydrateReady] = useState(!queryId);
  const skipCutoutRef = useRef(false);
  const seedCutoutRef = useRef<Blob | null>(null);
  const createdAtRef = useRef<number>(Date.now());

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
        if (cancelled || !record || record.mode !== 'single') {
          if (!cancelled) {
            setError('Saved poster not found.');
            setHydrateReady(true);
            loadDefaultLogo().then(setLogo).catch(() => setLogo(null));
          }
          return;
        }
        createdAtRef.current = record.createdAt;
        setLibraryId(record.id);
        setName(record.name);
        setLevel(record.level);
        setTitle(record.title);
        setCategory(record.category);
        setPlacement(record.placement);
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

        if (record.photoBlob) {
          const file = blobToFile(record.photoBlob, record.photoName || 'photo.png');
          skipCutoutRef.current = Boolean(record.cutoutBlob);
          seedCutoutRef.current = record.cutoutBlob;
          setPhotoLabelHint(record.photoName || 'Saved photo');
          setPhotoFile(file);
        }
        if (!cancelled) setHydrateReady(true);
      })
      .catch((err) => {
        console.error('[library]', err);
        if (!cancelled) {
          setError('Could not load saved poster.');
          setHydrateReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [queryId]);

  useEffect(() => {
    if (!photoFile) {
      setRawPhoto(null);
      setCutout(null);
      return;
    }
    let cancelled = false;
    setError(null);
    setProcessing(true);

    createImageBitmap(photoFile).then((bitmap) => {
      if (!cancelled) setRawPhoto(bitmap);
    });

    if (skipCutoutRef.current && seedCutoutRef.current) {
      skipCutoutRef.current = false;
      const blob = seedCutoutRef.current;
      seedCutoutRef.current = null;
      createImageBitmap(blob)
        .then((bitmap) => {
          if (!cancelled) setCutout(bitmap);
        })
        .catch(() => {
          if (!cancelled) setError('Could not restore cutout — reprocessing.');
        })
        .finally(() => {
          if (!cancelled) setProcessing(false);
        });
      return () => {
        cancelled = true;
      };
    }

    setCutout(null);
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

  const handlePhotoChange = useCallback((file: File | null) => {
    skipCutoutRef.current = false;
    seedCutoutRef.current = null;
    setPhotoLabelHint(null);
    setPhotoFile(file);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hydrateReady) return;
    let cancelled = false;
    ensureFonts().then(() => {
      if (cancelled) return;
      renderPoster(canvas, {
        subject: cutout ?? rawPhoto,
        subjectIsCutout: cutout !== null,
        logo,
        name,
        level,
        title,
        category,
        placement,
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
    rawPhoto,
    cutout,
    logo,
    name,
    level,
    title,
    category,
    placement,
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
      const safeName = (name.trim() || 'student').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const ratioSlug = aspectRatio.replace(':', 'x');
      anchor.href = url;
      anchor.download = `poster-${safeName}-P${placement}-${ratioSlug}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, [name, placement, aspectRatio]);

  const handleSave = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !photoFile) return;
    setSaving(true);
    setSaveLabel(null);
    try {
      const id = libraryId ?? newPosterId();
      const now = Date.now();
      const cutoutBlob = cutout ? await bitmapToPngBlob(cutout) : null;
      const thumbBlob = await canvasToThumbBlob(canvas);
      const record: SavedSinglePoster = {
        id,
        mode: 'single',
        createdAt: libraryId ? createdAtRef.current : now,
        updatedAt: now,
        label: name.trim() || title.trim() || 'Untitled single',
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
        name,
        category,
        placement,
        photoBlob: photoFile,
        photoName: photoFile.name,
        cutoutBlob,
      };
      await savePoster(record);
      createdAtRef.current = record.createdAt;
      setLibraryId(id);
      if (queryId !== id) navigate(`/single?id=${id}`, { replace: true });
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
    photoFile,
    cutout,
    logoCustomFile,
    name,
    title,
    level,
    category,
    placement,
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
        <span className="mobile-toolbar-title">Single Mode</span>
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
            disabled={!photoFile || processing}
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
            <h1>Result Poster Generator</h1>
            <p>Upload a photo, set details, save or download a print-ready poster.</p>
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
        <PosterForm
          hasPhoto={photoFile !== null}
          processing={processing}
          name={name}
          level={level}
          title={title}
          category={category}
          placement={placement}
          moreOpen={moreOpen}
          error={error}
          saving={saving}
          saveLabel={saveLabel}
          photoLabelHint={photoLabelHint}
          onPhotoChange={handlePhotoChange}
          onLogoChange={handleLogoChange}
          onNameChange={setName}
          onLevelChange={setLevel}
          onTitleChange={setTitle}
          onCategoryChange={setCategory}
          onPlacementChange={setPlacement}
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
