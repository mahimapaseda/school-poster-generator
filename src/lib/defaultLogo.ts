import { trimTransparent } from './removeBackground';

/** Bundled school logo served from `/school-logo.png`. */
export const DEFAULT_LOGO_URL = '/school-logo.png';
export const DEFAULT_LOGO_LABEL = 'School logo (default)';

/** Loads and trims the built-in school logo watermark. */
export async function loadDefaultLogo(): Promise<ImageBitmap> {
  const response = await fetch(DEFAULT_LOGO_URL);
  if (!response.ok) {
    throw new Error(`Failed to load default logo (${response.status})`);
  }
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  return trimTransparent(bitmap);
}
