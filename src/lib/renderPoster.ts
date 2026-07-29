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
  | 'maroon'
  | 'indigo'
  | 'copper'
  | 'arctic'
  | 'plum'
  | 'olive'
  | 'coral'
  | 'steel'
  | 'wine'
  | 'jade'
  | 'amber'
  | 'graphite'
  | 'azure';

export type PatternId =
  | 'pixels'
  | 'dots'
  | 'lines'
  | 'grid'
  | 'diagonal'
  | 'crosshatch'
  | 'rings'
  | 'stars'
  | 'diamonds'
  | 'waves'
  | 'chevron'
  | 'confetti'
  | 'none';

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
  {
    id: 'indigo',
    label: 'Indigo',
    gradient: ['#1a1848', '#121034', '#08061c'],
    pattern: ['#2e2a7a', '#3c38a0', '#5048c8', '#222060'],
    glow: 'rgba(150, 160, 255, 0.3)',
    fadeRgb: '8, 6, 28',
    accent: '#e8c050',
    swatch: '#3c38a0',
  },
  {
    id: 'copper',
    label: 'Copper',
    gradient: ['#3a2418', '#281810', '#140c08'],
    pattern: ['#7a4a28', '#9a5e30', '#b87438', '#5a361c'],
    glow: 'rgba(240, 170, 110, 0.28)',
    fadeRgb: '20, 12, 8',
    accent: '#ffd070',
    swatch: '#9a5e30',
  },
  {
    id: 'arctic',
    label: 'Arctic',
    gradient: ['#1a2838', '#121c28', '#080e14'],
    pattern: ['#3a5870', '#4a7090', '#5a88a8', '#2a4058'],
    glow: 'rgba(180, 220, 255, 0.3)',
    fadeRgb: '8, 14, 20',
    accent: '#e8f0ff',
    swatch: '#4a7090',
  },
  {
    id: 'plum',
    label: 'Plum',
    gradient: ['#2e1428', '#200e1c', '#100810'],
    pattern: ['#5a2850', '#743468', '#904080', '#441c3c'],
    glow: 'rgba(220, 140, 210, 0.28)',
    fadeRgb: '16, 8, 16',
    accent: '#f0c070',
    swatch: '#743468',
  },
  {
    id: 'olive',
    label: 'Olive',
    gradient: ['#2a2e18', '#1c2010', '#0e1008'],
    pattern: ['#4a5428', '#5e6a34', '#748040', '#38401c'],
    glow: 'rgba(200, 210, 120, 0.26)',
    fadeRgb: '14, 16, 8',
    accent: '#e8d060',
    swatch: '#5e6a34',
  },
  {
    id: 'coral',
    label: 'Coral',
    gradient: ['#3a1c1c', '#281212', '#140808'],
    pattern: ['#8a3a3a', '#b04a4a', '#d06060', '#6a2c2c'],
    glow: 'rgba(255, 150, 140, 0.28)',
    fadeRgb: '20, 8, 8',
    accent: '#ffd080',
    swatch: '#b04a4a',
  },
  {
    id: 'steel',
    label: 'Steel',
    gradient: ['#222830', '#161a20', '#0a0c10'],
    pattern: ['#3a4654', '#4e5c6c', '#647484', '#2c3440'],
    glow: 'rgba(170, 190, 210, 0.24)',
    fadeRgb: '10, 12, 16',
    accent: '#d0d8e0',
    swatch: '#4e5c6c',
  },
  {
    id: 'wine',
    label: 'Wine',
    gradient: ['#2e1018', '#200a10', '#100508'],
    pattern: ['#5a1828', '#782030', '#962840', '#44121c'],
    glow: 'rgba(220, 110, 140, 0.26)',
    fadeRgb: '16, 5, 8',
    accent: '#e8b850',
    swatch: '#782030',
  },
  {
    id: 'jade',
    label: 'Jade',
    gradient: ['#0e3028', '#0a201a', '#04100c'],
    pattern: ['#1a5a4a', '#247860', '#2e9878', '#144438'],
    glow: 'rgba(100, 230, 190, 0.28)',
    fadeRgb: '4, 16, 12',
    accent: '#e8d060',
    swatch: '#247860',
  },
  {
    id: 'amber',
    label: 'Amber',
    gradient: ['#3a2810', '#281a0a', '#140c04'],
    pattern: ['#7a5420', '#9a6a28', '#b88030', '#5a3c18'],
    glow: 'rgba(255, 200, 80, 0.3)',
    fadeRgb: '20, 12, 4',
    accent: '#ffe090',
    swatch: '#9a6a28',
  },
  {
    id: 'graphite',
    label: 'Graphite',
    gradient: ['#1e2226', '#141618', '#080a0c'],
    pattern: ['#343a42', '#484e58', '#5c6470', '#262a30'],
    glow: 'rgba(160, 170, 180, 0.22)',
    fadeRgb: '8, 10, 12',
    accent: '#e0c060',
    swatch: '#484e58',
  },
  {
    id: 'azure',
    label: 'Azure',
    gradient: ['#0c2848', '#081c34', '#040e1c'],
    pattern: ['#1850a0', '#2068c8', '#2880e8', '#123c78'],
    glow: 'rgba(100, 180, 255, 0.3)',
    fadeRgb: '4, 14, 28',
    accent: '#e8c050',
    swatch: '#2068c8',
  },
];

export const PATTERNS: PatternOption[] = [
  { id: 'pixels', label: 'Pixels' },
  { id: 'dots', label: 'Dots' },
  { id: 'lines', label: 'Lines' },
  { id: 'grid', label: 'Grid' },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'crosshatch', label: 'Hatch' },
  { id: 'rings', label: 'Rings' },
  { id: 'stars', label: 'Stars' },
  { id: 'diamonds', label: 'Diamonds' },
  { id: 'waves', label: 'Waves' },
  { id: 'chevron', label: 'Chevron' },
  { id: 'confetti', label: 'Confetti' },
  { id: 'none', label: 'None' },
];

export function getAspectRatio(id: AspectRatioId): AspectRatioOption {
  return ASPECT_RATIOS.find((r) => r.id === id) ?? ASPECT_RATIOS[0];
}

export function getColorTheme(id: ColorThemeId): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0];
}

export type SizePreset = 'S' | 'M' | 'L';
export type TextPosition = 'higher' | 'default' | 'lower';

export const SIZE_PRESETS: Array<{ id: SizePreset; label: string }> = [
  { id: 'S', label: 'S' },
  { id: 'M', label: 'M' },
  { id: 'L', label: 'L' },
];

export const TEXT_POSITIONS: Array<{ id: TextPosition; label: string }> = [
  { id: 'higher', label: 'Higher' },
  { id: 'default', label: 'Default' },
  { id: 'lower', label: 'Lower' },
];

/** User adjustments from More options; applied on top of per-ratio defaults. */
export interface LayoutOverrides {
  logoOpacity: number;
  logoSize: SizePreset;
  photoSize: SizePreset;
  ordinalSize: SizePreset;
  nameSize: SizePreset;
  levelSize: SizePreset;
  titleSize: SizePreset;
  textPosition: TextPosition;
}

export const DEFAULT_LAYOUT_OVERRIDES: LayoutOverrides = {
  logoOpacity: 0.42,
  logoSize: 'M',
  photoSize: 'M',
  ordinalSize: 'M',
  nameSize: 'M',
  levelSize: 'M',
  titleSize: 'M',
  textPosition: 'default',
};

const SIZE_SCALE: Record<SizePreset, number> = {
  S: 0.78,
  M: 1,
  L: 1.22,
};

function applyLayoutOverrides(layout: RatioLayout, overrides: LayoutOverrides): RatioLayout {
  const logoMul = SIZE_SCALE[overrides.logoSize];
  const photoMul = SIZE_SCALE[overrides.photoSize];
  const ordinalMul = SIZE_SCALE[overrides.ordinalSize];
  const nameMul = SIZE_SCALE[overrides.nameSize];
  const levelMul = SIZE_SCALE[overrides.levelSize];
  const titleMul = SIZE_SCALE[overrides.titleSize];

  let bottomBaseline = layout.bottomBaseline;
  if (overrides.textPosition === 'higher') bottomBaseline = Math.max(0.86, bottomBaseline - 0.04);
  if (overrides.textPosition === 'lower') bottomBaseline = Math.min(0.975, bottomBaseline + 0.03);

  return {
    ...layout,
    logoMaxWidthFrac: Math.min(1.05, layout.logoMaxWidthFrac * logoMul),
    logoMaxHeightFrac: Math.min(0.95, layout.logoMaxHeightFrac * logoMul),
    logoOpacity: Math.min(1, Math.max(0.2, overrides.logoOpacity)),
    subjectFrac: Math.min(0.98, layout.subjectFrac * photoMul),
    subjectMaxWidthFrac: Math.min(1.5, layout.subjectMaxWidthFrac * photoMul),
    pBoxFrac: layout.pBoxFrac * ordinalMul,
    nameSizeFrac: layout.nameSizeFrac * nameMul,
    levelSizeFrac: layout.levelSizeFrac * levelMul,
    titleSizeFrac: layout.titleSizeFrac * titleMul,
    bottomBaseline,
  };
}

/**
 * Layout knobs per aspect ratio. Logo uses a large contain-fit box so the
 * crest fills the upper poster like the old giant P-mark, scaled per ratio.
 */
interface RatioLayout {
  /** Geometric-mean scale for text/logo sizes. */
  scale: number;
  /** Max visual width of the large centered logo as a fraction of poster width. */
  logoMaxWidthFrac: number;
  /** Max visual height of the large centered logo as a fraction of poster height. */
  logoMaxHeightFrac: number;
  /** Vertical center of the large logo (0–1). */
  logoCenterY: number;
  /** Opacity of the large logo watermark (0–1). */
  logoOpacity: number;
  /** Subject height as a fraction of poster height. */
  subjectFrac: number;
  /** Subject max width as a fraction of poster width. */
  subjectMaxWidthFrac: number;
  /** Where the bottom dark fade starts (0–1). */
  fadeTop: number;
  /** Corner P-numeral box as a fraction of layout scale. */
  pBoxFrac: number;
  /** Corner P margin from edges as a fraction of layout scale. */
  pMarginFrac: number;
  /** Student name size as a fraction of layout scale. */
  nameSizeFrac: number;
  /** Competition level size as a fraction of layout scale. */
  levelSizeFrac: number;
  /** Competition title size as a fraction of layout scale. */
  titleSizeFrac: number;
  /** Max text block width as a fraction of poster width. */
  textMaxWidthFrac: number;
  /** Bottom baseline for the title stack (0–1). */
  bottomBaseline: number;
}

function getRatioLayout(w: number, h: number, aspectRatio: AspectRatioId): RatioLayout {
  const scale = Math.sqrt(w * h);

  switch (aspectRatio) {
    case '1:1':
      // Square — fill the frame like 4:5; allow slight side overflow so portraits don't leave gaps.
      return {
        scale,
        logoMaxWidthFrac: 0.88,
        logoMaxHeightFrac: 0.72,
        logoCenterY: 0.36,
        logoOpacity: 0.42,
        subjectFrac: 0.94,
        subjectMaxWidthFrac: 1.12,
        fadeTop: 0.72,
        pBoxFrac: 0.13,
        pMarginFrac: 0.026,
        nameSizeFrac: 0.068,
        levelSizeFrac: 0.022,
        titleSizeFrac: 0.02,
        textMaxWidthFrac: 0.9,
        bottomBaseline: 0.94,
      };
    case '9:16':
      // Tall story — prioritize height fill; allow width overflow so the cutout reaches the top band.
      return {
        scale,
        logoMaxWidthFrac: 0.98,
        logoMaxHeightFrac: 0.48,
        logoCenterY: 0.28,
        logoOpacity: 0.4,
        subjectFrac: 0.92,
        subjectMaxWidthFrac: 1.35,
        fadeTop: 0.78,
        pBoxFrac: 0.14,
        pMarginFrac: 0.034,
        nameSizeFrac: 0.068,
        levelSizeFrac: 0.022,
        titleSizeFrac: 0.022,
        textMaxWidthFrac: 0.9,
        bottomBaseline: 0.945,
      };
    case '3:4':
      return {
        scale,
        logoMaxWidthFrac: 0.94,
        logoMaxHeightFrac: 0.7,
        logoCenterY: 0.36,
        logoOpacity: 0.42,
        subjectFrac: 0.86,
        subjectMaxWidthFrac: 0.98,
        fadeTop: 0.74,
        pBoxFrac: 0.15,
        pMarginFrac: 0.028,
        nameSizeFrac: 0.07,
        levelSizeFrac: 0.022,
        titleSizeFrac: 0.021,
        textMaxWidthFrac: 0.88,
        bottomBaseline: 0.935,
      };
    case '4:5':
    default:
      return {
        scale,
        logoMaxWidthFrac: 0.94,
        logoMaxHeightFrac: 0.72,
        logoCenterY: 0.38,
        logoOpacity: 0.42,
        subjectFrac: 0.86,
        subjectMaxWidthFrac: 0.98,
        fadeTop: 0.74,
        pBoxFrac: 0.15,
        pMarginFrac: 0.028,
        nameSizeFrac: 0.07,
        levelSizeFrac: 0.022,
        titleSizeFrac: 0.021,
        textMaxWidthFrac: 0.88,
        bottomBaseline: 0.935,
      };
  }
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
  /** Optional More options layout tweaks; defaults preserve per-ratio look. */
  layoutOverrides?: LayoutOverrides;
}

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
  const pick = () => palette[Math.floor(rand() * palette.length)];

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
      ctx.fillStyle = pick();
      ctx.fillRect(0, y, w, thickness);
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (pattern === 'diagonal') {
    ctx.lineWidth = 2;
    const step = Math.round(Math.min(w, h) * 0.035);
    for (let i = -h; i < w + h; i += step) {
      ctx.globalAlpha = 0.1 + (i % (step * 3) === 0 ? 0.1 : 0);
      ctx.strokeStyle = pick();
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (pattern === 'crosshatch') {
    ctx.lineWidth = 1.5;
    const step = Math.round(Math.min(w, h) * 0.038);
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = palette[1] ?? palette[0];
    for (let i = -h; i < w + h; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i, h);
      ctx.lineTo(i + h, 0);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (pattern === 'rings') {
    const count = Math.round(18 * area);
    for (let i = 0; i < count; i++) {
      const x = rand() * w;
      const y = h * (0.08 + 0.85 * rand());
      const r = 20 + rand() * Math.min(w, h) * 0.12;
      ctx.globalAlpha = 0.1 + rand() * 0.18;
      ctx.strokeStyle = pick();
      ctx.lineWidth = 2 + rand() * 4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (pattern === 'stars') {
    const count = Math.round(120 * area);
    for (let i = 0; i < count; i++) {
      const x = rand() * w;
      const y = h * (0.05 + 0.9 * Math.pow(rand(), 0.7));
      const size = 4 + rand() * (rand() < 0.15 ? 18 : 10);
      ctx.globalAlpha = 0.15 + rand() * 0.35;
      ctx.fillStyle = pick();
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rand() * Math.PI);
      ctx.beginPath();
      for (let p = 0; p < 4; p++) {
        const a = (p * Math.PI) / 2;
        ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size * 0.25);
        ctx.lineTo(Math.cos(a + Math.PI / 4) * size * 0.28, Math.sin(a + Math.PI / 4) * size * 0.28);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (pattern === 'diamonds') {
    const count = Math.round(140 * area);
    for (let i = 0; i < count; i++) {
      const x = rand() * w;
      const y = h * (0.05 + 0.9 * Math.pow(rand(), 0.65));
      const size = 6 + rand() * (rand() < 0.12 ? 36 : 16);
      ctx.globalAlpha = 0.12 + rand() * 0.28;
      ctx.fillStyle = pick();
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size * 0.7, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size * 0.7, y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (pattern === 'waves') {
    const rows = Math.round(28 * Math.sqrt(area));
    ctx.lineWidth = 2;
    for (let r = 0; r < rows; r++) {
      const yBase = ((r + 0.5) / rows) * h;
      const amp = 8 + rand() * 22;
      const freq = 0.008 + rand() * 0.01;
      const phase = rand() * Math.PI * 2;
      ctx.globalAlpha = 0.1 + rand() * 0.16;
      ctx.strokeStyle = pick();
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = yBase + Math.sin(x * freq + phase) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (pattern === 'chevron') {
    const step = Math.round(Math.min(w, h) * 0.045);
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = palette[1] ?? palette[0];
    for (let y = -step; y < h + step; y += step) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += step) {
        const yy = y + ((Math.floor(x / step) % 2) * step) / 2;
        if (x === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (pattern === 'confetti') {
    const count = Math.round(220 * area);
    for (let i = 0; i < count; i++) {
      const x = rand() * w;
      const y = h * (0.04 + 0.92 * rand());
      const rw = 4 + rand() * 14;
      const rh = 3 + rand() * 8;
      ctx.globalAlpha = 0.18 + rand() * 0.32;
      ctx.fillStyle = pick();
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rand() * Math.PI);
      ctx.fillRect(-rw / 2, -rh / 2, rw, rh);
      ctx.restore();
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
    ctx.fillStyle = pick();
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

const PLACEMENT_ORDINALS: Record<Placement, { digit: string; suffix: string }> = {
  1: { digit: '1', suffix: 'st' },
  2: { digit: '2', suffix: 'nd' },
  3: { digit: '3', suffix: 'rd' },
};

/** Placement ordinal (1ˢᵗ / 2ⁿᵈ / 3ʳᵈ) in the top-left corner. */
function drawPlacementCorner(
  ctx: CanvasRenderingContext2D,
  placement: Placement,
  w: number,
  _h: number,
  layout: RatioLayout,
): void {
  const { digit, suffix } = PLACEMENT_ORDINALS[placement];
  // Wider/taller slot than the old "P#" mark so "1st" can render large.
  const box = Math.min(Math.round(layout.scale * layout.pBoxFrac * 1.25), Math.round(w * 0.26));
  const marginX = Math.round(layout.scale * layout.pMarginFrac * 1.85);
  const marginY = Math.round(layout.scale * layout.pMarginFrac * 1.05);

  ctx.save();
  let digitSize = Math.round(box * 1.05);
  const suffixRatio = 0.42;

  const measure = (size: number) => {
    ctx.font = `400 ${size}px Anton`;
    const dm = ctx.measureText(digit);
    const digitH = dm.actualBoundingBoxAscent + dm.actualBoundingBoxDescent;
    const digitW = Math.max(
      dm.width,
      (dm.actualBoundingBoxLeft || 0) + (dm.actualBoundingBoxRight || 0),
    );
    const suffixSize = Math.round(size * suffixRatio);
    ctx.font = `400 ${suffixSize}px Anton`;
    const sm = ctx.measureText(suffix);
    const suffixW = sm.width;
    const gap = size * 0.04;
    return { digitH, digitW, suffixSize, suffixW, gap, totalW: digitW + gap + suffixW, dm };
  };

  let m = measure(digitSize);
  const fit = Math.min(1, box / Math.max(1, m.totalW), box / Math.max(1, m.digitH));
  if (fit < 1) {
    digitSize = Math.floor(digitSize * fit);
    m = measure(digitSize);
  }

  const top = marginY + (box - m.digitH) / 2;
  const digitBaseline = top + m.dm.actualBoundingBoxAscent;
  // Raise the suffix so it sits near the top of the digit (true superscript).
  const suffixBaseline = top + m.digitH * 0.38;
  const digitX = marginX;
  const suffixX = digitX + m.digitW + m.gap;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = Math.round(layout.scale * 0.012);
  ctx.shadowOffsetY = Math.round(layout.scale * 0.004);

  const fill = ctx.createLinearGradient(0, top, 0, top + m.digitH);
  fill.addColorStop(0, '#ffffff');
  fill.addColorStop(1, '#c9d4ea');
  ctx.fillStyle = fill;

  ctx.font = `400 ${digitSize}px Anton`;
  ctx.fillText(digit, digitX, digitBaseline);

  ctx.font = `400 ${m.suffixSize}px Anton`;
  ctx.fillText(suffix, suffixX, suffixBaseline);
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

/** Large school logo — contain-fit inside a per-ratio box, centered on the poster. */
function drawLogoMark(
  ctx: CanvasRenderingContext2D,
  logo: ImageBitmap | null,
  w: number,
  h: number,
  layout: RatioLayout,
): void {
  if (!logo) return;

  const maxWidth = w * layout.logoMaxWidthFrac;
  const maxHeight = h * layout.logoMaxHeightFrac;
  // Contain-fit: use the full allotted box for this ratio (not a forced square).
  const fit = Math.min(maxWidth / logo.width, maxHeight / logo.height);
  const lw = logo.width * fit;
  const lh = logo.height * fit;

  // Keep the mark inside the upper poster — clamp so it never sits under the fade.
  const idealCenterY = h * layout.logoCenterY;
  const minCenterY = lh / 2 + h * 0.02;
  const maxCenterY = h * layout.fadeTop - lh / 2;
  const centerY = Math.min(Math.max(idealCenterY, minCenterY), Math.max(minCenterY, maxCenterY));
  const x = (w - lw) / 2;
  const y = centerY - lh / 2;

  ctx.save();
  ctx.globalAlpha = layout.logoOpacity;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
  ctx.shadowBlur = Math.round(layout.scale * 0.022);
  ctx.shadowOffsetY = Math.round(layout.scale * 0.006);
  ctx.drawImage(logo, x, y, lw, lh);
  ctx.restore();
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

/**
 * Centered bottom stack:
 *   STUDENT NAME       (white, large)
 *   ALL ISLAND         (gold)          — tight gap under name
 *   COMPETITION TITLE  (silver)
 */
function drawBottomStack(
  ctx: CanvasRenderingContext2D,
  inputs: PosterInputs,
  w: number,
  h: number,
  layout: RatioLayout,
  theme: ColorTheme,
): void {
  const { name, level, title } = inputs;
  const centerX = w / 2;
  const maxTextWidth = w * layout.textMaxWidthFrac;
  const s = layout.scale;
  const boldStrokeW = Math.max(1, Math.round(s * 0.0007));

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  const displayName = (name.trim() || 'STUDENT NAME').toUpperCase();
  let nameSize = Math.round(s * layout.nameSizeFrac);
  ctx.font = `400 ${nameSize}px Anton`;
  if (ctx.measureText(displayName).width > maxTextWidth) {
    nameSize = Math.floor((nameSize * maxTextWidth) / ctx.measureText(displayName).width);
  }

  const levelText = level.trim().toUpperCase();
  const levelSize = Math.round(s * layout.levelSizeFrac);

  const titleSize = Math.round(s * layout.titleSizeFrac);
  const titleLineHeight = Math.round(titleSize * 1.35);
  ctx.font = `600 ${titleSize}px Archivo`;
  const titleText = title.trim().toUpperCase();
  const titleLines = titleText ? wrapText(ctx, titleText, maxTextWidth, 2) : [];
  const titleBlockH = titleLines.length > 0 ? (titleLines.length - 1) * titleLineHeight : 0;

  const gapNameToLevel = Math.round(nameSize * 0.22);
  const gapLevelToTitle = Math.round(nameSize * 0.12);

  const hasLevel = levelText.length > 0;
  const hasTitle = titleLines.length > 0;
  let stackH = nameSize;
  if (hasLevel) stackH += gapNameToLevel + levelSize;
  if (hasTitle) {
    stackH += (hasLevel ? gapLevelToTitle : gapNameToLevel) + titleBlockH + titleSize;
  }

  const stackBottom = h * layout.bottomBaseline;
  const stackTop = stackBottom - stackH;
  let y = stackTop + nameSize;

  // 1) Student name
  ctx.font = `400 ${nameSize}px Anton`;
  ctx.letterSpacing = `${Math.round(s * 0.002)}px`;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = Math.round(s * 0.015);
  ctx.shadowOffsetY = Math.round(s * 0.004);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(displayName, centerX, y);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // 2) Level
  if (hasLevel) {
    y += gapNameToLevel + levelSize;
    ctx.font = `600 ${levelSize}px Archivo`;
    ctx.letterSpacing = `${Math.round(s * 0.008)}px`;
    ctx.fillStyle = theme.accent;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = boldStrokeW;
    ctx.lineJoin = 'round';
    ctx.strokeText(levelText, centerX, y);
    ctx.fillText(levelText, centerX, y);
  }

  // 3) Competition title
  if (hasTitle) {
    y += (hasLevel ? gapLevelToTitle : gapNameToLevel) + titleSize;
    ctx.font = `600 ${titleSize}px Archivo`;
    ctx.letterSpacing = `${Math.round(s * 0.004)}px`;
    ctx.fillStyle = 'rgba(210, 218, 230, 0.9)';
    ctx.strokeStyle = 'rgba(210, 218, 230, 0.9)';
    ctx.lineWidth = boldStrokeW;
    ctx.lineJoin = 'round';
    titleLines.forEach((line, i) => {
      const ty = y + i * titleLineHeight;
      ctx.strokeText(line, centerX, ty);
      ctx.fillText(line, centerX, ty);
    });
  }

  ctx.restore();
}

export function renderPoster(canvas: HTMLCanvasElement, inputs: PosterInputs): void {
  const { width, height } = getAspectRatio(inputs.aspectRatio);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const baseLayout = getRatioLayout(width, height, inputs.aspectRatio);
  const layout = applyLayoutOverrides(
    baseLayout,
    inputs.layoutOverrides ?? DEFAULT_LAYOUT_OVERRIDES,
  );
  const theme = getColorTheme(inputs.colorTheme);

  drawBackground(ctx, width, height, theme, inputs.pattern);
  drawLogoMark(ctx, inputs.logo, width, height, layout);
  drawSubject(ctx, inputs, width, height, layout);
  drawBottomFade(ctx, width, height, layout, theme);
  drawBottomStack(ctx, inputs, width, height, layout, theme);
  drawPlacementCorner(ctx, inputs.placement, width, height, layout);
}
