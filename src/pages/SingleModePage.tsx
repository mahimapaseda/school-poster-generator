import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
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
import { getCutout, preloadCutoutModel, trimTransparent } from '../lib/removeBackground';
import { applyUiTheme, initialUiTheme, type UiTheme } from '../lib/uiTheme';

export default function SingleModePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [rawPhoto, setRawPhoto] = useState<ImageBitmap | null>(null);
  const [cutout, setCutout] = useState<ImageBitmap | null>(null);
  const [processing, setProcessing] = useState(false);
  const [logo, setLogo] = useState<ImageBitmap | null>(null);
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

  useEffect(() => {
    applyUiTheme(uiTheme);
  }, [uiTheme]);

  useEffect(() => {
    void preloadCutoutModel();
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadDefaultLogo()
      .then((bitmap) => {
        if (!cancelled) setLogo(bitmap);
      })
      .catch((err) => {
        console.warn('[logo] default load failed', err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!photoFile) {
      setRawPhoto(null);
      setCutout(null);
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

  const handleLogoChange = useCallback((file: File | null) => {
    if (!file) {
      loadDefaultLogo()
        .then(setLogo)
        .catch(() => setLogo(null));
      return;
    }
    createImageBitmap(file).then(trimTransparent).then(setLogo);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
            <Link to="/" className="home-nav-link">
              ← Home
            </Link>
            <h1>Result Poster Generator</h1>
            <p>Upload a photo, set details, download a print-ready poster.</p>
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
          onPhotoChange={setPhotoFile}
          onLogoChange={handleLogoChange}
          onNameChange={setName}
          onLevelChange={setLevel}
          onTitleChange={setTitle}
          onCategoryChange={setCategory}
          onPlacementChange={setPlacement}
          onToggleMore={() => setMoreOpen((open) => !open)}
          onDownload={handleDownload}
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
          {processing && (
            <div className="preview-overlay">
              <div className="spinner" />
              <span>Removing background…</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
