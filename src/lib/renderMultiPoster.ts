import {
  DEFAULT_LAYOUT_OVERRIDES,
  applyLayoutOverrides,
  drawBackground,
  drawLogoMark,
  getAspectRatio,
  getColorTheme,
  getRatioLayout,
  type AspectRatioId,
  type ColorTheme,
  type ColorThemeId,
  type LayoutOverrides,
  type PatternId,
} from './renderPoster';

/** Multi Mode placement 1–8 (independent of Single Mode Placement 1–3). */
export type MultiPlacement = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type PersonCount = 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const PERSON_COUNTS: PersonCount[] = [2, 3, 4, 5, 6, 7, 8];

export const MULTI_PLACEMENTS: MultiPlacement[] = [1, 2, 3, 4, 5, 6, 7, 8];

export function multiPlacementOrdinal(placement: MultiPlacement): { digit: string; suffix: string } {
  const digit = String(placement);
  if (placement === 1) return { digit, suffix: 'st' };
  if (placement === 2) return { digit, suffix: 'nd' };
  if (placement === 3) return { digit, suffix: 'rd' };
  return { digit, suffix: 'th' };
}

export function multiPlacementLabel(placement: MultiPlacement): string {
  const { digit, suffix } = multiPlacementOrdinal(placement);
  return `${digit}${suffix}`;
}

export interface MultiPersonInputs {
  subject: ImageBitmap | null;
  subjectIsCutout: boolean;
  name: string;
  placement: MultiPlacement;
}

export interface MultiPosterInputs {
  people: MultiPersonInputs[];
  logo: ImageBitmap | null;
  title: string;
  level: string;
  aspectRatio: AspectRatioId;
  colorTheme: ColorThemeId;
  pattern: PatternId;
  layoutOverrides?: LayoutOverrides;
}

function sliderToScale(v: number): number {
  if (v <= 50) return 0.3 + (v / 50) * 0.7;
  return 1.0 + ((v - 50) / 50);
}

function shortName(full: string): string {
  const trimmed = full.trim();
  if (!trimmed) return 'NAME';
  const parts = trimmed.split(/\s+/);
  return (parts[0] || trimmed).toUpperCase();
}

/** Shrink photos/boxes as headcount grows so 8 still fits. */
function countScale(n: number): number {
  if (n <= 2) return 1;
  if (n <= 4) return 0.85;
  if (n <= 6) return 0.7;
  return 0.58;
}

function drawHeaderText(
  ctx: CanvasRenderingContext2D,
  title: string,
  level: string,
  w: number,
  h: number,
  scale: number,
  theme: ColorTheme,
  titleMul: number,
  levelMul: number,
): void {
  const centerX = w / 2;
  const titleText = (title.trim() || 'RACE RESULT').toUpperCase();
  const levelText = level.trim().toUpperCase();
  const maxW = w * 0.86;

  let titleSize = Math.round(scale * 0.055 * titleMul);
  ctx.font = `400 ${titleSize}px Anton`;
  if (ctx.measureText(titleText).width > maxW) {
    titleSize = Math.floor((titleSize * maxW) / ctx.measureText(titleText).width);
  }
  ctx.font = `400 ${titleSize}px Anton`;
  const titleMetrics = ctx.measureText(titleText);
  const titleAscent = titleMetrics.actualBoundingBoxAscent || titleSize * 0.85;
  const titleDescent = titleMetrics.actualBoundingBoxDescent || titleSize * 0.15;

  const levelSize = levelText ? Math.round(scale * 0.028 * levelMul) : 0;
  let levelAscent = 0;
  let levelDescent = 0;
  if (levelText) {
    ctx.font = `400 ${levelSize}px Milker`;
    const levelMetrics = ctx.measureText(levelText);
    levelAscent = levelMetrics.actualBoundingBoxAscent || levelSize * 0.8;
    levelDescent = levelMetrics.actualBoundingBoxDescent || levelSize * 0.2;
  }

  const gap = Math.round(scale * 0.012);
  const headerTop = h * 0.055;
  const levelY = headerTop + levelAscent;
  // Place title fully below level (Anton has a large ascent — account for it).
  const titleY = levelText
    ? levelY + levelDescent + gap + titleAscent
    : headerTop + titleAscent;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Level / subtitle on top
  if (levelText) {
    ctx.font = `400 ${levelSize}px Milker`;
    ctx.letterSpacing = `${Math.round(scale * 0.008)}px`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = Math.round(scale * 0.01);
    ctx.shadowOffsetY = Math.round(scale * 0.002);
    ctx.fillStyle = theme.accent;
    ctx.fillText(levelText, centerX, levelY);
  }

  // Title below — no overlap with level
  ctx.font = `400 ${titleSize}px Anton`;
  ctx.letterSpacing = '0px';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = Math.round(scale * 0.01);
  ctx.fillText(titleText, centerX, titleY);
  ctx.restore();
}

/** Soft-fade the bottom of a cutout into the theme (same approach as Single Mode). */
function drawFadedSubject(
  ctx: CanvasRenderingContext2D,
  subject: ImageBitmap,
  x: number,
  y: number,
  drawW: number,
  drawH: number,
  fadeRgb: string,
): void {
  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.ceil(drawW));
  off.height = Math.max(1, Math.ceil(drawH));
  const octx = off.getContext('2d');
  if (!octx) {
    ctx.drawImage(subject, x, y, drawW, drawH);
    return;
  }

  octx.drawImage(subject, 0, 0, drawW, drawH);

  // Match Single Mode: darken cutout pixels only so the watermark never punches through.
  octx.globalCompositeOperation = 'source-atop';
  const fadeTop = drawH * 0.7;
  const dark = octx.createLinearGradient(0, fadeTop, 0, drawH);
  dark.addColorStop(0, `rgba(${fadeRgb}, 0)`);
  dark.addColorStop(0.55, `rgba(${fadeRgb}, 0.6)`);
  dark.addColorStop(1, `rgba(${fadeRgb}, 0.97)`);
  octx.fillStyle = dark;
  octx.fillRect(0, fadeTop, off.width, drawH - fadeTop);

  // Feather just the hard bitmap edge (thin strip) after it's already dark.
  octx.globalCompositeOperation = 'destination-in';
  const edge = octx.createLinearGradient(0, 0, 0, drawH);
  edge.addColorStop(0, 'rgba(0, 0, 0, 1)');
  edge.addColorStop(0.9, 'rgba(0, 0, 0, 1)');
  edge.addColorStop(1, 'rgba(0, 0, 0, 0)');
  octx.fillStyle = edge;
  octx.fillRect(0, 0, off.width, off.height);

  ctx.drawImage(off, x, y, drawW, drawH);
}

function drawSideSubject(
  ctx: CanvasRenderingContext2D,
  person: MultiPersonInputs,
  side: 'left' | 'right',
  index: number,
  w: number,
  h: number,
  photoMul: number,
  nScale: number,
  fadeRgb: string,
  /** Vertical center to align with this person's result box. */
  anchorY: number,
  /** Vertical band reserved for this photo (avoids overlap with same-side peers). */
  slotTop: number,
  slotBottom: number,
): void {
  const { subject, subjectIsCutout } = person;
  if (!subject) return;

  const slotH = Math.max(1, slotBottom - slotTop);
  // Larger base size; slider still scales (0.3→~55% slot, 1.0→~88%, 2.0→~98%).
  const slotFill = Math.min(0.98, 0.45 + photoMul * 0.275);
  const maxH = Math.min(h * 0.7 * nScale, slotH * slotFill);
  const maxW = Math.min(w * 0.46, w * (0.3 + photoMul * 0.1));
  const fit = Math.min(maxH / subject.height, maxW / subject.width);
  const drawW = subject.width * fit;
  const drawH = subject.height * fit;

  // Align mid-upper body with the result box, then clamp into this person's slot.
  const downNudge = side === 'left' ? h * 0.05 : 0;
  let y = anchorY - drawH * 0.38 + downNudge;
  y = Math.max(slotTop, Math.min(y, slotBottom - drawH + downNudge));
  const edgePad = w * 0.02;
  // Nudge lower-left (3rd) inward; pull both right-side photos slightly toward center.
  const inward =
    index === 2 ? w * 0.04 : side === 'right' ? w * 0.035 : 0;
  const x = side === 'left' ? edgePad + inward : w - drawW - edgePad - inward;

  ctx.save();
  if (subjectIsCutout) {
    ctx.shadowColor = 'rgba(2, 4, 14, 0.55)';
    ctx.shadowBlur = Math.round(Math.sqrt(w * h) * 0.025);
    ctx.shadowOffsetY = Math.round(Math.sqrt(w * h) * 0.006);
    drawFadedSubject(ctx, subject, x, y, drawW, drawH, fadeRgb);
  } else {
    ctx.globalAlpha = 0.45;
    ctx.drawImage(subject, x, y, drawW, drawH);
  }
  ctx.restore();
}

function drawResultBox(
  ctx: CanvasRenderingContext2D,
  person: MultiPersonInputs,
  boxCenterY: number,
  boxW: number,
  boxH: number,
  w: number,
  scale: number,
  theme: ColorTheme,
  ordinalMul: number,
  nameMul: number,
  nScale: number,
): void {
  const x = (w - boxW) / 2;
  const y = boxCenterY - boxH / 2;
  const radius = Math.round(scale * 0.004);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, boxW, boxH, radius);
  ctx.fillStyle = `rgba(${theme.fadeRgb}, 0.72)`;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = Math.max(1.5, Math.round(scale * 0.0012));
  ctx.stroke();

  const label = shortName(person.name);
  const labelSize = Math.max(10, Math.round(scale * 0.014 * nameMul * nScale));
  const { digit, suffix } = multiPlacementOrdinal(person.placement);
  let digitSize = Math.round(scale * 0.068 * ordinalMul * nScale);
  const suffixRatio = 0.42;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${labelSize}px Archivo`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(label, w / 2, y + boxH * 0.2);

  const measure = (size: number) => {
    ctx.font = `400 ${size}px Anton`;
    const dm = ctx.measureText(digit);
    const digitW = Math.max(
      dm.width,
      (dm.actualBoundingBoxLeft || 0) + (dm.actualBoundingBoxRight || 0),
    );
    const digitH = dm.actualBoundingBoxAscent + dm.actualBoundingBoxDescent;
    const suffixSize = Math.round(size * suffixRatio);
    ctx.font = `400 ${suffixSize}px Anton`;
    const sm = ctx.measureText(suffix);
    const gap = size * 0.04;
    return {
      digitW,
      digitH,
      suffixSize,
      suffixW: sm.width,
      gap,
      totalW: digitW + gap + sm.width,
      dm,
    };
  };

  let m = measure(digitSize);
  const maxOrdinalW = boxW * 0.82;
  const maxOrdinalH = boxH * 0.58;
  const fit = Math.min(1, maxOrdinalW / Math.max(1, m.totalW), maxOrdinalH / Math.max(1, m.digitH));
  if (fit < 1) {
    digitSize = Math.floor(digitSize * fit);
    m = measure(digitSize);
  }

  const ordinalBaselineY = y + boxH * 0.7 + m.dm.actualBoundingBoxAscent * 0.15;
  const digitX = w / 2 - m.totalW / 2;
  const suffixX = digitX + m.digitW + m.gap;
  const suffixBaseline = ordinalBaselineY - m.digitH * 0.42;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = `400 ${digitSize}px Anton`;
  ctx.fillText(digit, digitX, ordinalBaselineY);
  ctx.font = `400 ${m.suffixSize}px Anton`;
  ctx.fillText(suffix, suffixX, suffixBaseline);
  ctx.restore();
}

/**
 * Race-style multi-person poster (2–8): shared header, alternating L/R cutouts,
 * stacked center placement boxes.
 */
export function renderMultiPoster(canvas: HTMLCanvasElement, inputs: MultiPosterInputs): void {
  const { width, height } = getAspectRatio(inputs.aspectRatio);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const people = inputs.people.slice(0, 8);
  const n = Math.max(2, people.length);
  const nScale = countScale(n);

  const overrides = inputs.layoutOverrides ?? DEFAULT_LAYOUT_OVERRIDES;
  const theme = getColorTheme(inputs.colorTheme);
  const layout = applyLayoutOverrides(
    getRatioLayout(width, height, inputs.aspectRatio),
    overrides,
  );
  const scale = layout.scale;
  const photoMul = sliderToScale(overrides.photoSize);
  const ordinalMul = sliderToScale(overrides.ordinalSize);
  const nameMul = sliderToScale(overrides.nameSize);
  const titleMul = sliderToScale(overrides.titleSize);
  const levelMul = sliderToScale(overrides.levelSize);

  const posT = (overrides.textPosition - 50) / 50;
  let stackMidY = height * 0.52;
  if (posT < 0) stackMidY = Math.max(height * 0.4, stackMidY + posT * height * 0.06);
  if (posT > 0) stackMidY = Math.min(height * 0.62, stackMidY + posT * height * 0.05);

  drawBackground(ctx, width, height, theme, inputs.pattern);
  drawLogoMark(ctx, inputs.logo, width, height, layout);
  drawHeaderText(ctx, inputs.title, inputs.level, width, height, scale, theme, titleMul, levelMul);

  const stackTop = height * 0.22;
  const stackBottom = height * 0.88;
  const available = stackBottom - stackTop;
  const boxH = Math.min(height * 0.16 * nScale, (available / n) * 0.82);
  const boxW = width * (n <= 2 ? 0.28 : n <= 4 ? 0.26 : 0.24);
  const gap = Math.max(4, (available - boxH * n) / Math.max(1, n + 1));
  const totalStackH = boxH * n + gap * (n - 1);
  let y0 = stackMidY - totalStackH / 2;
  y0 = Math.max(stackTop, Math.min(y0, stackBottom - totalStackH));

  people.forEach((person, i) => {
    const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right';
    const boxCenterY = y0 + boxH / 2 + i * (boxH + gap);

    // Vertical slot between previous/next person on the same side.
    const prevCenter = i >= 2 ? y0 + boxH / 2 + (i - 2) * (boxH + gap) : -1;
    const nextCenter = i + 2 < n ? y0 + boxH / 2 + (i + 2) * (boxH + gap) : -1;
    const halfSpan = (boxH + gap) * 1.15;
    const slotTop =
      prevCenter >= 0 ? (prevCenter + boxCenterY) / 2 : Math.max(height * 0.12, boxCenterY - halfSpan * 1.15);
    const slotBottom =
      nextCenter >= 0
        ? (boxCenterY + nextCenter) / 2
        : Math.min(height * 0.96, boxCenterY + halfSpan * 1.15);

    drawSideSubject(
      ctx,
      person,
      side,
      i,
      width,
      height,
      photoMul,
      nScale,
      theme.fadeRgb,
      boxCenterY,
      slotTop,
      slotBottom,
    );
  });

  people.forEach((person, i) => {
    const cy = y0 + boxH / 2 + i * (boxH + gap);
    drawResultBox(ctx, person, cy, boxW, boxH, width, scale, theme, ordinalMul, nameMul, nScale);
  });
}
