import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { InstallAppButton } from '../components/InstallAppButton';
import { MoreOptionsPanel } from '../components/MoreOptionsPanel';
import { MultiPosterForm, type PersonSlotReport } from '../components/MultiPosterForm';
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
  type PersonCount,
} from '../lib/renderMultiPoster';
import { loadDefaultLogo } from '../lib/defaultLogo';
import { preloadCutoutModel, trimTransparent } from '../lib/removeBackground';
import { applyUiTheme, initialUiTheme, type UiTheme } from '../lib/uiTheme';

function emptyReport(placement: number): PersonSlotReport {
  return {
    subject: null,
    subjectIsCutout: false,
    name: '',
    placement: Math.min(8, Math.max(1, placement)) as PersonSlotReport['placement'],
    hasPhoto: false,
    processing: false,
    error: null,
    photoLabel: null,
  };
}

export default function MultipleModePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [personCount, setPersonCount] = useState<PersonCount>(2);
  const [slotReports, setSlotReports] = useState<PersonSlotReport[]>(() => [
    emptyReport(1),
    emptyReport(2),
  ]);

  const [logo, setLogo] = useState<ImageBitmap | null>(null);
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

  const activeSlots = slotReports.slice(0, personCount);
  const processing = activeSlots.some((s) => s.processing);
  const hasPhotos = activeSlots.length === personCount && activeSlots.every((s) => s.hasPhoto);
  const error = activeSlots.find((s) => s.error)?.error ?? null;

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
      const next = prev.length > index ? [...prev] : [...prev, ...Array.from({ length: index - prev.length + 1 }, (_, i) => emptyReport(prev.length + i + 1))];
      next[index] = report;
      return next;
    });
  }, []);

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
            <Link to="/" className="home-nav-link">
              ← Home
            </Link>
            <h1>Multiple Mode</h1>
            <p>Race-style poster for 2–8 people on one image.</p>
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
          onLogoChange={handleLogoChange}
          onTitleChange={setTitle}
          onLevelChange={setLevel}
          onPersonReport={handlePersonReport}
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
