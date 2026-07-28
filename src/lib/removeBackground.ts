import { removeBackground } from '@imgly/background-removal';

let lastFile: File | null = null;
let lastResult: Promise<ImageBitmap> | null = null;

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

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return bitmap; // fully transparent; keep as-is
  return createImageBitmap(canvas, minX, minY, maxX - minX + 1, maxY - minY + 1);
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

  // Luminance histogram over visible pixels only.
  const hist = new Uint32Array(256);
  let count = 0;
  for (let i = 0; i < d.length; i += 4) {
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

  // Stretch [lo, hi] to [12, 240], capped so already-contrasty photos barely change.
  const stretch = Math.min((240 - 12) / Math.max(1, hi - lo), 1.5);
  const strength = 0.65; // blend toward the stretched result to keep it natural
  // Cool grade: nudge reds down and blues up toward the poster's navy palette.
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

/**
 * Removes the background from a photo, returning a transparent cutout
 * trimmed to the subject's bounds and auto-adjusted to match the poster style.
 * The result is cached per file so re-renders don't re-run the model.
 * The first call downloads the segmentation model (~40 MB), so it can take a while.
 */
export function getCutout(file: File): Promise<ImageBitmap> {
  if (file === lastFile && lastResult) return lastResult;
  lastFile = file;
  lastResult = removeBackground(file, { output: { format: 'image/png' } })
    .then((blob) => createImageBitmap(blob))
    .then(trimTransparent)
    .then(autoAdjust);
  return lastResult;
}
