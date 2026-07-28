export type Placement = 1 | 2 | 3;

export type AspectRatioId = '4:5' | '3:4' | '1:1' | '9:16';
export type ColorThemeId =
  | 'navy'
  | 'emerald'
  | 'crimson'
  | 'charcoal'
  | 'violet'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'gold'
  | 'slate'
  | 'rose'
  | 'teal'
  | 'midnight'
  | 'maroon';

export type PatternId = 'pixels' | 'dots' | 'lines' | 'grid' | 'none';

export interface AspectRatioOption {
  id: AspectRatioId;
  label: string;
  width: number;
  height: number;
}

export interface ColorTheme {
  id: ColorThemeId;
  label: string;
  /** Three-stop vertical gradient (top → mid → bottom). */
  gradient: [string, string, string];
  pattern: string[];
  glow: string;
  fadeRgb: string;
  accent: string;
  swatch: string;
}

export interface PatternOption {
  id: PatternId;
  label: string;
}

/** Long edge stays near 2560 px so export quality is consistent across ratios. */
export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: '4:5', label: '4:5', width: 2048, height: 2560 },
  { id: '3:4', label: '3:4', width: 1920, height: 2560 },
  { id: '1:1', label: '1:1', width: 2048, height: 2048 },
  { id: '9:16', label: '9:16', width: 1440, height: 2560 },
];

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'navy',
    label: 'Navy',
    gradient: ['#132250', '#0d1a40', '#070d24'],
    pattern: ['#1c3486', '#2645a8', '#3a5cd0', '#152a6e'],
    glow: 'rgba(140, 170, 235, 0.32)',
    fadeRgb: '7, 13, 36',
    accent: '#e8b93c',
    swatch: '#1c3486',
  },
  {
    id: 'emerald',
    label: 'Emerald',
    gradient: ['#0f3d32', '#0a2a22', '#041612'],
    pattern: ['#1a6b55', '#229978', '#2db894', '#145544'],
    glow: 'rgba(120, 220, 180, 0.28)',
    fadeRgb: '4, 22, 18',
    accent: '#f0d060',
    swatch: '#1a6b55',
  },
  {
    id: 'crimson',
    label: 'Crimson',
    gradient: ['#3a1218', '#2a0c12', '#140508'],
    pattern: ['#7a2230', '#a02e40', '#c43a50', '#5a1824'],
    glow: 'rgba(240, 140, 150, 0.28)',
    fadeRgb: '20, 5, 8',
    accent: '#f0c040',
    swatch: '#a02e40',
  },
  {
    id: 'charcoal',
    label: 'Charcoal',
    gradient: ['#2a2e36', '#1a1d24', '#0c0e12'],
    pattern: ['#3e4552', '#505a6a', '#6a7588', '#2e3440'],
    glow: 'rgba(180, 190, 210, 0.22)',
    fadeRgb: '12, 14, 18',
    accent: '#e8b93c',
    swatch: '#3e4552',
  },
  {
    id: 'violet',
    label: 'Violet',
    gradient: ['#2a1848', '#1c0f34', '#0c061c'],
    pattern: ['#4a2a8a', '#5e38a8', '#7a4fd0', '#3a1e6e'],
    glow: 'rgba(180, 150, 240, 0.3)',
    fadeRgb: '12, 6, 28',
    accent: '#e8b93c',
    swatch: '#5e38a8',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    gradient: ['#0c3a4a', '#082832', '#041418'],
    pattern: ['#146a82', '#1a88a8', '#28a8c8', '#0e5064'],
    glow: 'rgba(100, 210, 230, 0.28)',
    fadeRgb: '4, 20, 24',
    accent: '#f0d060',
    swatch: '#1a88a8',
  },
  {
    id: 'sunset',
    label: 'Sunset',
    gradient: ['#4a1e14', '#34140c', '#180806'],
    pattern: ['#8a3a20', '#b04a28', '#d06030', '#6a2a18'],
    glow: 'rgba(255, 170, 100, 0.28)',
    fadeRgb: '24, 8, 6',
    accent: '#ffd060',
    swatch: '#b04a28',
  },
  {
    id: 'forest',
    label: 'Forest',
    gradient: ['#1a2e18', '#122010', '#081008'],
    pattern: ['#2e5a28', '#3a7434', '#4a9444', '#224820'],
    glow: 'rgba(140, 210, 120, 0.26)',
    fadeRgb: '8, 16, 8',
    accent: '#e8c050',
    swatch: '#3a7434',
  },
  {
    id: 'gold',
    label: 'Gold',
    gradient: ['#3a2e14', '#281e0c', '#141008'],
    pattern: ['#6a5420', '#8a6e28', '#b08a30', '#4a3a18'],
    glow: 'rgba(240, 200, 100, 0.3)',
    fadeRgb: '20, 16, 8',
    accent: '#ffe080',
    swatch: '#8a6e28',
  },
  {
    id: 'slate',
    label: 'Slate',
    gradient: ['#243040', '#182028', '#0c1018'],
    pattern: ['#3a5068', '#4a6888', '#5a80a8', '#2a3c50'],
    glow: 'rgba(160, 190, 220, 0.26)',
    fadeRgb: '12, 16, 24',
    accent: '#e8b93c',
    swatch: '#4a6888',
  },
  {
    id: 'rose',
    label: 'Rose',
    gradient: ['#3a1828', '#28101c', '#140810'],
    pattern: ['#7a3050', '#9a4068', '#c05080', '#5a2440'],
    glow: 'rgba(240, 150, 180, 0.28)',
    fadeRgb: '20, 8, 16',
    accent: '#f0d070',
    swatch: '#9a4068',
  },
  {
    id: 'teal',
    label: 'Teal',
    gradient: ['#0e3440', '#0a242c', '#041418'],
    pattern: ['#1a6870', '#248890', '#30a8b0', '#144850'],
    glow: 'rgba(100, 220, 210, 0.28)',
    fadeRgb: '4, 20, 24',
    accent: '#e8c050',
    swatch: '#248890',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    gradient: ['#101828', '#0a101c', '#04080e'],
    pattern: ['#1c2e50', '#284070', '#345898', '#142038'],
    glow: 'rgba(120, 150, 220, 0.26)',
    fadeRgb: '4, 8, 14',
    accent: '#e8b93c',
    swatch: '#284070',
  },
  {
    id: 'maroon',
    label: 'Maroon',
    gradient: ['#3a1018', '#280a10', '#140508'],
    pattern: ['#6a2030', '#8a2840', '#aa3450', '#4a1824'],
    glow: 'rgba(220, 120, 140, 0.26)',
    fadeRgb: '20, 5, 8',
    accent: '#f0c850',
    swatch: '#8a2840',
  },
];

export const PATTERNS: PatternOption[] = [
  { id: 'pixels', label: 'Pixels' },
  { id: 'dots', label: 'Dots' },
  { id: 'lines', label: 'Lines' },
  { id: 'grid', label: 'Grid' },
  { id: 'none', label: 'None' },
];

export function getAspectRatio(id: AspectRatioId): AspectRatioOption {
  return ASPECT_RATIOS.find((r) => r.id === id) ?? ASPECT_RATIOS[0];
}

export function getColorTheme(id: ColorThemeId): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0];
}

/**
 * Layout knobs that change with aspect ratio so photo, numeral, logo, and
 * text stay balanced when the user switches 4:5 / 3:4 / 1:1 / 9:16.
 */
interface RatioLayout {
  /** Geometric-mean scale for text/logo sizes. */
  scale: number;
  /** Max visual width of the P-numeral as a fraction of poster width. */
  pMaxWidthFrac: number;
  /** Max visual height of the P-numeral as a fraction of poster height. */
  pMaxHeightFrac: number;
  /** Vertical center of the P-numeral (0–1). */
  pCenterY: number;
  /** Subject height as a fraction of poster height. */
  subjectFrac: number;
  /** Subject max width as a fraction of poster width. */
  subjectMaxWidthFrac: number;
  /** Where the bottom dark fade starts (0–1). */
  fadeTop: number;
  /** Corner logo box as a fraction of layout scale. */
  logoBoxFrac: number;
  /** Corner logo margin from edges as a fraction of layout scale. */
  logoMarginFrac: number;
  /** Student name size as a fraction of layout scale. */
  nameSizeFrac: number;
  /** Competition title size as a fraction of layout scale. */
  titleSizeFrac: number;
  /** Max text block width as a fraction of poster width. */
  textMaxWidthFrac: number;
  /** Bottom baseline for the title stack (0–1). */
  bottomBaseline: number;
}

function getRatioLayout(w: number, h: number): RatioLayout {
  const aspect = w / h;
  const scale = Math.sqrt(w * h);

  // Square (1:1)
  if (aspect > 0.92 && aspect < 1.08) {
    return {
      scale,
      pMaxWidthFrac: 0.72,
      pMaxHeightFrac: 0.48,
      pCenterY: 0.33,
      subjectFrac: 0.68,
      subjectMaxWidthFrac: 0.88,
      fadeTop: 0.68,
      logoBoxFrac: 0.09,
      logoMarginFrac: 0.028,
      nameSizeFrac: 0.062,
      titleSizeFrac: 0.019,
      textMaxWidthFrac: 0.9,
      bottomBaseline: 0.965,
    };
  }

  // Tall story (9:16)
  if (aspect < 0.65) {
    return {
      scale,
      pMaxWidthFrac: 0.82,
      pMaxHeightFrac: 0.55,
      pCenterY: 0.31,
      subjectFrac: 0.72,
      subjectMaxWidthFrac: 0.92,
      fadeTop: 0.74,
      logoBoxFrac: 0.11,
      logoMarginFrac: 0.038,
      nameSizeFrac: 0.072,
      titleSizeFrac: 0.023,
      textMaxWidthFrac: 0.9,
      bottomBaseline: 0.968,
    };
  }

  // Portrait (4:5 ≈ 0.8, 3:4 = 0.75)
  return {
    scale,
    pMaxWidthFrac: 0.86,
    pMaxHeightFrac: 0.58,
    pCenterY: 0.345,
    subjectFrac: 0.74,
    subjectMaxWidthFrac: 0.9,
    fadeTop: 0.72,
    logoBoxFrac: 0.1,
    logoMarginFrac: 0.032,
    nameSizeFrac: 0.07,
    titleSizeFrac: 0.021,
    textMaxWidthFrac: 0.88,
    bottomBaseline: 0.968,
  };
}

export interface PosterInputs {
  /** Subject image; a background-removed cutout when available, otherwise the raw photo. */
  subject: ImageBitmap | null;
  /** True when `subject` is a cutout; raw photos are drawn dimmed as a processing preview. */
  subjectIsCutout: boolean;
  logo: ImageBitmap | null;
  name: string;
  /** Competition level, e.g. "All Island" or "Central Province". */
  level: string;
  /** Competition title, e.g. "Innovation & Robotic Competition". */
  title: string;
  placement: Placement;
  aspectRatio: AspectRatioId;
  colorTheme: ColorThemeId;
  pattern: PatternId;
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

function drawPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pattern: PatternId,
  palette: string[],
): void {
  if (pattern === 'none') return;

  const area = (w * h) / (2048 * 2560);
  const rand = mulberry32(20260728);

  if (pattern === 'grid') {
    ctx.strokeStyle = palette[1] ?? palette[0];
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.18;
    const step = Math.round(Math.min(w, h) * 0.04);
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (pattern === 'lines') {
    const count = Math.round(80 * area);
    for (let i = 0; i < count; i++) {
      const y = rand() * h;
      const thickness = 2 + rand() * 10;
      ctx.globalAlpha = 0.12 + rand() * 0.22;
      ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
      ctx.fillRect(0, y, w, thickness);
    }
    ctx.globalAlpha = 1;
    return;
  }

  const count = Math.round((pattern === 'dots' ? 280 : 320) * area);
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = h * (0.05 + 0.95 * Math.pow(rand(), 0.65));
    const size = 8 + rand() * (rand() < 0.12 ? 70 : 34);
    const nearTopCenter = y < h * 0.45 && Math.abs(x - w / 2) < w * 0.3;
    ctx.globalAlpha = (nearTopCenter ? 0.1 : 0.2) + rand() * 0.3;
    ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
    if (pattern === 'dots') {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(Math.round(x / 8) * 8, Math.round(y / 8) * 8, size, size);
    }
  }
  ctx.globalAlpha = 1;
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  theme: ColorTheme,
  pattern: PatternId,
): void {
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, theme.gradient[0]);
  base.addColorStop(0.55, theme.gradient[1]);
  base.addColorStop(1, theme.gradient[2]);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  drawPattern(ctx, w, h, pattern, theme.pattern);

  const glow = ctx.createRadialGradient(w / 2, h * 0.3, 0, w / 2, h * 0.3, h * 0.62);
  glow.addColorStop(0, theme.glow);
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
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
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, `rgba(${theme.fadeRgb}, 0.55)`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

function drawPlacementText(
  ctx: CanvasRenderingContext2D,
  placement: Placement,
  w: number,
  h: number,
  layout: RatioLayout,
): void {
  const text = `P${placement}`;
  const maxWidth = w * layout.pMaxWidthFrac;
  const maxHeight = h * layout.pMaxHeightFrac;

  ctx.save();
  let size = Math.round(layout.scale * 0.72);
  ctx.font = `400 ${size}px Anton`;

  // Fit using the true glyph bounds (Anton overhangs its advance width).
  const fitSize = (candidate: number) => {
    ctx.font = `400 ${candidate}px Anton`;
    const m = ctx.measureText(text);
    const glyphH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    // Anton’s ink is wider than its advance width; pad so we never clip.
    const glyphW = Math.max(
      m.width * 1.18,
      (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || 0),
    );
    return { metrics: m, glyphH, glyphW };
  };

  let { metrics, glyphH: glyphHeight, glyphW } = fitSize(size);
  const scale = Math.min(1, maxWidth / Math.max(1, glyphW), maxHeight / Math.max(1, glyphHeight));
  if (scale < 1) {
    size = Math.floor(size * scale);
    ({ metrics, glyphH: glyphHeight, glyphW } = fitSize(size));
  }

  // Hard cap: keep ink inside a side inset so the P never clips the canvas edge.
  const inset = w * 0.06;
  const halfSpan = Math.max(metrics.width * 0.59, glyphW / 2);
  const maxHalf = w / 2 - inset;
  if (halfSpan > maxHalf) {
    size = Math.floor(size * (maxHalf / halfSpan));
    ({ metrics, glyphH: glyphHeight } = fitSize(size));
  }

  // Soft shadow shouldn't spill past the canvas edge.
  const pad = Math.round(layout.scale * 0.02);
  const centerY = h * layout.pCenterY;
  const baselineY =
    centerY + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = Math.min(Math.round(layout.scale * 0.03), pad);
  ctx.shadowOffsetY = Math.round(layout.scale * 0.01);

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
  layout: RatioLayout,
): void {
  const { subject, subjectIsCutout } = inputs;
  if (!subject) return;

  const scale = Math.min(
    (h * layout.subjectFrac) / subject.height,
    (w * layout.subjectMaxWidthFrac) / subject.width,
  );
  const drawW = subject.width * scale;
  const drawH = subject.height * scale;

  ctx.save();
  if (subjectIsCutout) {
    ctx.shadowColor = 'rgba(2, 4, 14, 0.55)';
    ctx.shadowBlur = Math.round(layout.scale * 0.044);
    ctx.shadowOffsetY = Math.round(layout.scale * 0.013);
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
  _h: number,
  layout: RatioLayout,
): void {
  if (!logo) return;

  // Cap logo by both layout scale and a fraction of width so it never covers the P.
  const box = Math.min(Math.round(layout.scale * layout.logoBoxFrac), Math.round(w * 0.14));
  const marginX = Math.round(layout.scale * layout.logoMarginFrac);
  const marginY = Math.round(layout.scale * layout.logoMarginFrac * 1.1);
  const fit = Math.min(box / logo.width, box / logo.height);
  const lw = logo.width * fit;
  const lh = logo.height * fit;

  ctx.drawImage(logo, marginX + (box - lw) / 2, marginY + (box - lh) / 2, lw, lh);
}

function drawBottomFade(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  layout: RatioLayout,
  theme: ColorTheme,
): void {
  const fadeTop = h * layout.fadeTop;
  const fade = ctx.createLinearGradient(0, fadeTop, 0, h);
  fade.addColorStop(0, `rgba(${theme.fadeRgb}, 0)`);
  fade.addColorStop(0.55, `rgba(${theme.fadeRgb}, 0.6)`);
  fade.addColorStop(1, `rgba(${theme.fadeRgb}, 0.97)`);
  ctx.fillStyle = fade;
  ctx.fillRect(0, fadeTop, w, h - fadeTop);
}

/** Wraps text into at most `maxLines` lines that fit `maxWidth` (font must be set). */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (let i = 0; i < words.length; i++) {
    const candidate = current ? `${current} ${words[i]}` : words[i];
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else if (lines.length < maxLines - 1) {
      lines.push(current);
      current = words[i];
    } else {
      current = `${current} ${words.slice(i).join(' ')}`;
      break;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Centered bottom stack: gold placement, name, level, then competition title. */
function drawBottomStack(
  ctx: CanvasRenderingContext2D,
  inputs: PosterInputs,
  w: number,
  h: number,
  layout: RatioLayout,
  theme: ColorTheme,
): void {
  const { name, level, title, placement } = inputs;
  const centerX = w / 2;
  const maxTextWidth = w * layout.textMaxWidthFrac;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  const titleSize = Math.round(layout.scale * layout.titleSizeFrac);
  const levelSize = Math.round(layout.scale * layout.titleSizeFrac * 1.05);
  const titleLineHeight = Math.round(titleSize * 1.4);
  const levelLineHeight = Math.round(levelSize * 1.35);

  // Competition title (bottom).
  ctx.font = `600 ${titleSize}px Archivo`;
  ctx.letterSpacing = `${Math.round(layout.scale * 0.003)}px`;
  const titleText = title.trim().toUpperCase();
  const titleLines = titleText ? wrapText(ctx, titleText, maxTextWidth, 2) : [];

  const bottomBaseline = h * layout.bottomBaseline;
  const titleTopBaseline = bottomBaseline - (titleLines.length - 1) * titleLineHeight;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
  titleLines.forEach((line, i) => {
    ctx.fillText(line, centerX, titleTopBaseline + i * titleLineHeight);
  });

  // Level above the title.
  const levelText = level.trim().toUpperCase();
  let levelBaseline = titleLines.length > 0 ? titleTopBaseline - titleLineHeight * 1.15 : bottomBaseline;
  if (levelText) {
    ctx.font = `600 ${levelSize}px Archivo`;
    ctx.letterSpacing = `${Math.round(layout.scale * 0.006)}px`;
    ctx.fillStyle = theme.accent;
    ctx.fillText(levelText, centerX, levelBaseline);
    levelBaseline -= levelLineHeight * 0.15;
  }

  const stackTop =
    levelText
      ? levelBaseline - levelLineHeight * 0.95
      : titleLines.length > 0
        ? titleTopBaseline - titleLineHeight * 1.35
        : bottomBaseline;

  // Student name above level/title.
  const displayName = (name.trim() || 'STUDENT NAME').toUpperCase();
  let nameSize = Math.round(layout.scale * layout.nameSizeFrac);
  ctx.font = `400 ${nameSize}px Anton`;
  ctx.letterSpacing = `${Math.round(layout.scale * 0.002)}px`;
  const nameWidth = ctx.measureText(displayName).width;
  if (nameWidth > maxTextWidth) {
    nameSize = Math.floor((nameSize * maxTextWidth) / nameWidth);
    ctx.font = `400 ${nameSize}px Anton`;
  }
  const nameBaseline = stackTop - Math.round(layout.scale * 0.008);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = Math.round(layout.scale * 0.015);
  ctx.shadowOffsetY = Math.round(layout.scale * 0.004);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(displayName, centerX, nameBaseline);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  const labelSize = Math.round(layout.scale * 0.02);
  ctx.font = `600 ${labelSize}px Archivo`;
  ctx.letterSpacing = `${Math.round(layout.scale * 0.008)}px`;
  ctx.fillStyle = theme.accent;
  ctx.fillText(
    PLACEMENT_LABELS[placement].toUpperCase(),
    centerX,
    nameBaseline - nameSize - Math.round(layout.scale * 0.016),
  );

  ctx.restore();
}

export function renderPoster(canvas: HTMLCanvasElement, inputs: PosterInputs): void {
  const { width, height } = getAspectRatio(inputs.aspectRatio);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const layout = getRatioLayout(width, height);
  const theme = getColorTheme(inputs.colorTheme);

  drawBackground(ctx, width, height, theme, inputs.pattern);
  drawPlacementText(ctx, inputs.placement, width, height, layout);
  drawSubject(ctx, inputs, width, height, layout);
  drawBottomFade(ctx, width, height, layout, theme);
  drawBottomStack(ctx, inputs, width, height, layout, theme);
  drawLogoCorner(ctx, inputs.logo, width, height, layout);
}
