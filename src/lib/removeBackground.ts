import { preload, removeBackground, type Config } from '@imgly/background-removal';

let lastFile: File | null = null;
let lastResult: Promise<ImageBitmap> | null = null;
let preloadPromise: Promise<void> | null = null;

/** Long-edge cap before inference — large phone photos are the main slowdown. */
const MAX_INFERENCE_EDGE = 1280;

const PUBLIC_PATH =
  'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/';

function baseConfig(overrides: Partial<Config> = {}): Config {
  return {
    publicPath: PUBLIC_PATH,
    // Quantized model (~40 MB): faster download + inference.
    model: 'isnet_quint8',
    // CPU is the reliable default online; GPU is attempted separately when available.
    device: 'cpu',
    // Workers + COEP/PWA often break model fetches on production hosts.
    proxyToWorker: false,
    fetchArgs: {
      mode: 'cors',
      credentials: 'omit',
    },
    output: { format: 'image/png' },
    ...overrides,
  };
}

function supportsWebGpu(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

/**
 * Warm the segmentation model as soon as the app loads so the first photo
 * does not pay the full download + init cost while the user waits.
 */
export function preloadCutoutModel(): Promise<void> {
  if (!preloadPromise) {
    preloadPromise = preload(baseConfig()).catch((err) => {
      console.warn('[cutout] model preload failed', err);
      preloadPromise = null;
    });
  }
  return preloadPromise ?? Promise.resolve();
}

/**
 * Shrinks very large camera photos before segmentation. Quality stays fine for
 * poster compositing; inference time drops roughly with pixel count.
 */
async function prepareForInference(file: File): Promise<Blob | File> {
  const bitmap = await createImageBitmap(file);
  const longEdge = Math.max(bitmap.width, bitmap.height);
  if (longEdge <= MAX_INFERENCE_EDGE) {
    bitmap.close();
    return file;
  }

  const scale = MAX_INFERENCE_EDGE / longEdge;
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.92),
  );
  return blob ?? file;
}

/**
 * Crops away fully transparent margins so the subject fills its bitmap,
 * which lets the compositor scale it consistently regardless of how much
 * empty space surrounded the person in the original photo.
 */
export async function trimTransparent(bitmap: ImageBitmap): Promise<ImageBitmap> {
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return bitmap;
  ctx.drawImage(bitmap, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, bitmap.width, bitmap.height);

  const stride = 4;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return bitmap;

  minX = Math.max(0, minX - stride);
  minY = Math.max(0, minY - stride);
  maxX = Math.min(width - 1, maxX + stride);
  maxY = Math.min(height - 1, maxY + stride);

  let rMinX = maxX;
  let rMinY = maxY;
  let rMaxX = minX;
  let rMaxY = minY;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < rMinX) rMinX = x;
        if (x > rMaxX) rMaxX = x;
        if (y < rMinY) rMinY = y;
        if (y > rMaxY) rMaxY = y;
      }
    }
  }
  if (rMaxX < rMinX) return bitmap;
  return createImageBitmap(canvas, rMinX, rMinY, rMaxX - rMinX + 1, rMaxY - rMinY + 1);
}

/**
 * Automatically adjusts the cutout so any submitted photo matches the poster's
 * visual style: auto-contrast via a percentile histogram stretch of the
 * subject's own luminance range, plus a subtle cool grade toward the navy palette.
 */
async function autoAdjust(bitmap: ImageBitmap): Promise<ImageBitmap> {
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return bitmap;
  ctx.drawImage(bitmap, 0, 0);
  const image = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  const d = image.data;

  const hist = new Uint32Array(256);
  let count = 0;
  for (let i = 0; i < d.length; i += 16) {
    if (d[i + 3] > 16) {
      hist[(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) | 0]++;
      count++;
    }
  }
  if (count === 0) return bitmap;

  const percentile = (fraction: number): number => {
    const target = count * fraction;
    let sum = 0;
    for (let v = 0; v < 256; v++) {
      sum += hist[v];
      if (sum >= target) return v;
    }
    return 255;
  };
  const lo = percentile(0.02);
  const hi = percentile(0.98);

  const stretch = Math.min((240 - 12) / Math.max(1, hi - lo), 1.5);
  const strength = 0.65;
  const grade = [0.985, 1.0, 1.035];

  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    for (let c = 0; c < 3; c++) {
      const original = d[i + c];
      const stretched = 12 + (original - lo) * stretch;
      const blended = (original + (stretched - original) * strength) * grade[c];
      d[i + c] = blended < 0 ? 0 : blended > 255 ? 255 : blended;
    }
  }

  ctx.putImageData(image, 0, 0);
  return createImageBitmap(canvas);
}

async function runRemoval(input: Blob | File): Promise<ImageBitmap> {
  const attempts: Config[] = [];
  if (supportsWebGpu()) {
    attempts.push(baseConfig({ device: 'gpu' }));
  }
  attempts.push(baseConfig({ device: 'cpu' }));

  let lastError: unknown;
  for (const config of attempts) {
    try {
      const blob = await removeBackground(input, config);
      const bitmap = await createImageBitmap(blob);
      return autoAdjust(await trimTransparent(bitmap));
    } catch (err) {
      lastError = err;
      console.warn('[cutout] removal attempt failed', config.device, err);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Background removal failed');
}

/**
 * Removes the background from a photo, returning a transparent cutout
 * trimmed to the subject's bounds and auto-adjusted to match the poster style.
 * The result is cached per file so re-renders don't re-run the model.
 */
export function getCutout(file: File): Promise<ImageBitmap> {
  if (file === lastFile && lastResult) return lastResult;
  lastFile = file;
  lastResult = (async () => {
    try {
      await preloadCutoutModel();
      const input = await prepareForInference(file);
      return await runRemoval(input);
    } catch (err) {
      // Allow a later retry with the same file after a failure.
      lastFile = null;
      lastResult = null;
      throw err;
    }
  })();
  return lastResult;
}
