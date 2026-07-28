export type Placement = 1 | 2 | 3;

export type AspectRatioId = '3:4' | '1:1' | '9:16';

export interface AspectRatioOption {
  id: AspectRatioId;
  label: string;
  width: number;
  height: number;
}

/** Long edge stays near 2560 px so export quality is consistent across ratios. */
export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: '3:4', label: '3:4', width: 1920, height: 2560 },
  { id: '1:1', label: '1:1', width: 2048, height: 2048 },
  { id: '9:16', label: '9:16', width: 1440, height: 2560 },
];

export function getAspectRatio(id: AspectRatioId): AspectRatioOption {
  return ASPECT_RATIOS.find((r) => r.id === id) ?? ASPECT_RATIOS[0];
}

export interface PosterInputs {
  /** Subject image; a background-removed cutout when available, otherwise the raw photo. */
  subject: ImageBitmap | null;
  /** True when `subject` is a cutout; raw photos are drawn dimmed as a processing preview. */
  subjectIsCutout: boolean;
  logo: ImageBitmap | null;
  name: string;
  placement: Placement;
  aspectRatio: AspectRatioId;
}

const PLACEMENT_LABELS: Record<Placement, string> = {
  1: '1st Place',
  2: '2nd Place',
  3: '3rd Place',
};

let fontsReady: Promise<void> | null = null;

export function ensureFonts(): Promise<void> {
  if (!fontsReady) {
    fontsReady = Promise.all([
      new FontFace('Anton', 'url(/fonts/anton-400.woff2)', { weight: '400' }).load(),
      new FontFace('Archivo', 'url(/fonts/archivo-600.woff2)', { weight: '600' }).load(),
    ]).then((faces) => {
      for (const face of faces) document.fonts.add(face);
    });
  }
  return fontsReady;
}

/** Deterministic RNG so the pixel texture is identical on every render. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, '#132250');
  base.addColorStop(0.55, '#0d1a40');
  base.addColorStop(1, '#070d24');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  const area = (w * h) / (2048 * 2560);
  const blockCount = Math.round(320 * area);
  const rand = mulberry32(20260728);
  const palette = ['#1c3486', '#2645a8', '#3a5cd0', '#152a6e'];
  for (let i = 0; i < blockCount; i++) {
    const x = rand() * w;
    const y = h * (0.05 + 0.95 * Math.pow(rand(), 0.65));
    const size = 8 + rand() * (rand() < 0.12 ? 70 : 34);
    const nearTopCenter = y < h * 0.45 && Math.abs(x - w / 2) < w * 0.3;
    ctx.globalAlpha = (nearTopCenter ? 0.1 : 0.2) + rand() * 0.3;
    ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
    ctx.fillRect(Math.round(x / 8) * 8, Math.round(y / 8) * 8, size, size);
  }
  ctx.globalAlpha = 1;

  const glow = ctx.createRadialGradient(w / 2, h * 0.3, 0, w / 2, h * 0.3, h * 0.62);
  glow.addColorStop(0, 'rgba(140, 170, 235, 0.32)');
  glow.addColorStop(1, 'rgba(140, 170, 235, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  const vignette = ctx.createRadialGradient(
    w / 2,
    h * 0.45,
    h * 0.35,
    w / 2,
    h * 0.45,
    h * 0.85,
  );
  vignette.addColorStop(0, 'rgba(3, 6, 18, 0)');
  vignette.addColorStop(1, 'rgba(3, 6, 18, 0.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

function drawPlacementText(
  ctx: CanvasRenderingContext2D,
  placement: Placement,
  w: number,
  h: number,
): void {
  const text = `P${placement}`;
  const maxWidth = w * 0.94;
  const maxHeight = h * (w / h > 1.2 ? 0.72 : 0.64);
  const scaleRef = Math.min(w, h);

  ctx.save();
  let size = Math.round(scaleRef * 0.78);
  ctx.font = `400 ${size}px Anton`;
  let metrics = ctx.measureText(text);
  let glyphHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  const scale = Math.min(1, maxWidth / metrics.width, maxHeight / glyphHeight);
  if (scale < 1) {
    size = Math.floor(size * scale);
    ctx.font = `400 ${size}px Anton`;
    metrics = ctx.measureText(text);
    glyphHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  }

  const centerY = h * (w / h > 1.2 ? 0.42 : 0.355);
  const baselineY =
    centerY + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = Math.round(scaleRef * 0.034);
  ctx.shadowOffsetY = Math.round(scaleRef * 0.012);

  const fill = ctx.createLinearGradient(
    0,
    centerY - glyphHeight / 2,
    0,
    centerY + glyphHeight / 2,
  );
  fill.addColorStop(0, '#ffffff');
  fill.addColorStop(1, '#c9d4ea');
  ctx.fillStyle = fill;
  ctx.fillText(text, w / 2, baselineY);
  ctx.restore();
}

function drawSubject(
  ctx: CanvasRenderingContext2D,
  inputs: PosterInputs,
  w: number,
  h: number,
): void {
  const { subject, subjectIsCutout } = inputs;
  if (!subject) return;

  const subjectFrac = w / h > 1.2 ? 0.88 : 0.75;
  const scale = Math.min((h * subjectFrac) / subject.height, (w * 0.9) / subject.width);
  const drawW = subject.width * scale;
  const drawH = subject.height * scale;

  ctx.save();
  if (subjectIsCutout) {
    ctx.shadowColor = 'rgba(2, 4, 14, 0.55)';
    ctx.shadowBlur = Math.round(Math.min(w, h) * 0.044);
    ctx.shadowOffsetY = Math.round(Math.min(w, h) * 0.013);
  } else {
    ctx.globalAlpha = 0.45;
  }
  ctx.drawImage(subject, w / 2 - drawW / 2, h - drawH, drawW, drawH);
  ctx.restore();
}

/** School logo in the top-left corner (fully opaque, contain-fit in a fixed slot). */
function drawLogoCorner(
  ctx: CanvasRenderingContext2D,
  logo: ImageBitmap | null,
  w: number,
  h: number,
): void {
  if (!logo) return;

  const scaleRef = Math.min(w, h);
  const box = Math.round(scaleRef * 0.11);
  const marginX = Math.round(scaleRef * 0.028);
  const marginY = Math.round(scaleRef * 0.035);
  const fit = Math.min(box / logo.width, box / logo.height);
  const lw = logo.width * fit;
  const lh = logo.height * fit;

  ctx.drawImage(logo, marginX + (box - lw) / 2, marginY + (box - lh) / 2, lw, lh);
}

function drawBottomFade(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const fadeTop = h * 0.8;
  const fade = ctx.createLinearGradient(0, fadeTop, 0, h);
  fade.addColorStop(0, 'rgba(7, 13, 36, 0)');
  fade.addColorStop(0.6, 'rgba(7, 13, 36, 0.55)');
  fade.addColorStop(1, 'rgba(7, 13, 36, 0.95)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, fadeTop, w, h - fadeTop);
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  inputs: PosterInputs,
  w: number,
  h: number,
): void {
  const { name, placement } = inputs;
  const scaleRef = Math.min(w, h);
  const baselineY = h * 0.958;
  const labelSize = Math.round(scaleRef * 0.017);
  const nameSize = Math.round(scaleRef * 0.0215);

  ctx.save();
  ctx.textBaseline = 'alphabetic';

  ctx.font = `600 ${labelSize}px Archivo`;
  ctx.letterSpacing = `${Math.round(scaleRef * 0.007)}px`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.textAlign = 'left';
  ctx.fillText(PLACEMENT_LABELS[placement], w * 0.06, baselineY);

  const displayName = (name.trim() || 'STUDENT NAME').toUpperCase();
  ctx.font = `600 ${nameSize}px Archivo`;
  ctx.letterSpacing = `${Math.round(scaleRef * 0.005)}px`;
  const nameWidth = ctx.measureText(displayName).width;

  const rightEdge = w * 0.94;
  const nameX = rightEdge - nameWidth;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(displayName, nameX, baselineY);

  const underline = Math.round(scaleRef * 0.031);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(
    nameX,
    baselineY + Math.round(scaleRef * 0.011),
    underline,
    Math.max(2, Math.round(scaleRef * 0.002)),
  );

  const dividerX = nameX - Math.round(scaleRef * 0.021);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = Math.max(2, Math.round(scaleRef * 0.0015));
  ctx.beginPath();
  ctx.moveTo(dividerX, baselineY - Math.round(scaleRef * 0.038));
  ctx.lineTo(dividerX, baselineY + Math.round(scaleRef * 0.007));
  ctx.stroke();

  ctx.restore();
}

export function renderPoster(canvas: HTMLCanvasElement, inputs: PosterInputs): void {
  const { width, height } = getAspectRatio(inputs.aspectRatio);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  drawBackground(ctx, width, height);
  drawPlacementText(ctx, inputs.placement, width, height);
  drawSubject(ctx, inputs, width, height);
  drawBottomFade(ctx, width, height);
  drawFooter(ctx, inputs, width, height);
  drawLogoCorner(ctx, inputs.logo, width, height);
}
