import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { PosterForm } from './components/PosterForm';
import {
  ensureFonts,
  getAspectRatio,
  renderPoster,
  type AspectRatioId,
  type Placement,
} from './lib/renderPoster';
import { getCutout, trimTransparent } from './lib/removeBackground';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [rawPhoto, setRawPhoto] = useState<ImageBitmap | null>(null);
  const [cutout, setCutout] = useState<ImageBitmap | null>(null);
  const [processing, setProcessing] = useState(false);
  const [logo, setLogo] = useState<ImageBitmap | null>(null);
  const [name, setName] = useState('');
  const [placement, setPlacement] = useState<Placement>(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioId>('3:4');
  const [error, setError] = useState<string | null>(null);

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
      .catch(() => {
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
    // Trim transparent padding (common after removebg) so the crest scales full-size.
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
        placement,
        aspectRatio,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [rawPhoto, cutout, logo, name, placement, aspectRatio]);

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
    <div className="app">
      <aside className="panel">
        <header className="panel-header">
          <h1>Result Poster Generator</h1>
          <p>Upload a photo, pick the placement, and download a print-ready poster.</p>
        </header>
        <PosterForm
          hasPhoto={photoFile !== null}
          processing={processing}
          name={name}
          placement={placement}
          aspectRatio={aspectRatio}
          error={error}
          onPhotoChange={setPhotoFile}
          onLogoChange={handleLogoChange}
          onNameChange={setName}
          onPlacementChange={setPlacement}
          onAspectRatioChange={setAspectRatio}
          onDownload={handleDownload}
        />
      </aside>
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
