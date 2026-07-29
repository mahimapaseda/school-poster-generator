import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { InstallAppButton } from './components/InstallAppButton';
import { MoreOptionsPanel } from './components/MoreOptionsPanel';
import { PosterForm } from './components/PosterForm';
import {
  ensureFonts,
  getAspectRatio,
  renderPoster,
  DEFAULT_LAYOUT_OVERRIDES,
  type AspectRatioId,
  type ColorThemeId,
  type PatternId,
  type Placement,
  type SizePreset,
  type TextPosition,
} from './lib/renderPoster';
import { getCutout, preloadCutoutModel, trimTransparent } from './lib/removeBackground';

type UiTheme = 'light' | 'dark';

function readStoredTheme(): UiTheme {
  try {
    const stored = localStorage.getItem('poster-ui-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

function applyUiTheme(theme: UiTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem('poster-ui-theme', theme);
  } catch {
    /* ignore */
  }
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [rawPhoto, setRawPhoto] = useState<ImageBitmap | null>(null);
  const [cutout, setCutout] = useState<ImageBitmap | null>(null);
  const [processing, setProcessing] = useState(false);
  const [logo, setLogo] = useState<ImageBitmap | null>(null);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [title, setTitle] = useState('');
  const [placement, setPlacement] = useState<Placement>(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioId>('4:5');
  const [colorTheme, setColorTheme] = useState<ColorThemeId>('navy');
  const [pattern, setPattern] = useState<PatternId>('pixels');
  const [logoOpacity, setLogoOpacity] = useState(DEFAULT_LAYOUT_OVERRIDES.logoOpacity);
  const [logoSize, setLogoSize] = useState<SizePreset>(DEFAULT_LAYOUT_OVERRIDES.logoSize);
  const [photoSize, setPhotoSize] = useState<SizePreset>(DEFAULT_LAYOUT_OVERRIDES.photoSize);
  const [ordinalSize, setOrdinalSize] = useState<SizePreset>(DEFAULT_LAYOUT_OVERRIDES.ordinalSize);
  const [nameSize, setNameSize] = useState<SizePreset>(DEFAULT_LAYOUT_OVERRIDES.nameSize);
  const [levelSize, setLevelSize] = useState<SizePreset>(DEFAULT_LAYOUT_OVERRIDES.levelSize);
  const [titleSize, setTitleSize] = useState<SizePreset>(DEFAULT_LAYOUT_OVERRIDES.titleSize);
  const [textPosition, setTextPosition] = useState<TextPosition>(
    DEFAULT_LAYOUT_OVERRIDES.textPosition,
  );
  const [moreOpen, setMoreOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uiTheme, setUiTheme] = useState<UiTheme>(() => {
    if (typeof document !== 'undefined') {
      const current = document.documentElement.dataset.theme;
      if (current === 'light' || current === 'dark') return current;
    }
    return readStoredTheme();
  });

  useEffect(() => {
    applyUiTheme(uiTheme);
  }, [uiTheme]);

  useEffect(() => {
    void preloadCutoutModel();
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
      setLogo(null);
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
      <aside className="panel">
        <header className="panel-header">
          <div className="panel-header-text">
            <h1>Result Poster Generator</h1>
            <p>Upload a photo, set details, download a print-ready poster.</p>
          </div>
          <div className="panel-header-actions">
            <InstallAppButton />
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
          placement={placement}
          moreOpen={moreOpen}
          error={error}
          onPhotoChange={setPhotoFile}
          onLogoChange={handleLogoChange}
          onNameChange={setName}
          onLevelChange={setLevel}
          onTitleChange={setTitle}
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
