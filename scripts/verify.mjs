import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const PHOTO_PATH = process.argv[2];
if (!PHOTO_PATH) {
  console.error('Usage: node scripts/verify.mjs <photo-path>');
  process.exit(1);
}

mkdirSync('verify', { recursive: true });

// Persistent profile keeps the segmentation model cached across runs.
const browser = await chromium.launchPersistentContext('verify/.browser-profile', {
  channel: 'msedge',
  headless: true,
  viewport: { width: 1600, height: 1000 },
});
const page = await browser.newPage();
page.on('console', (msg) => {
  if (msg.type() === 'error') console.log('[page error]', msg.text());
});

await page.goto('http://localhost:5173');
await page.waitForTimeout(1500);

const canvas = page.locator('canvas.poster-canvas');
await canvas.screenshot({ path: 'verify/poster-initial.png' });
console.log('initial poster rendered');

// Synthesize a simple school logo (gold shield) as a PNG buffer in-page.
const logoDataUrl = await page.evaluate(() => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#e8b93c';
  ctx.beginPath();
  ctx.moveTo(128, 10);
  ctx.lineTo(240, 55);
  ctx.lineTo(220, 180);
  ctx.lineTo(128, 250);
  ctx.lineTo(36, 180);
  ctx.lineTo(16, 55);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#0d1a40';
  ctx.font = 'bold 110px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', 128, 135);
  return c.toDataURL('image/png');
});
const logoBuffer = Buffer.from(logoDataUrl.split(',')[1], 'base64');

const inputs = page.locator('input[type="file"]');
await inputs.nth(0).setInputFiles(PHOTO_PATH);
await inputs.nth(1).setInputFiles({ name: 'logo.png', mimeType: 'image/png', buffer: logoBuffer });
await page.getByRole('button', { name: '2nd Place' }).click();
await page.locator('#student-name').fill('Alex Fernando');
await page.locator('#competition-level').fill('Central Province');
await page.locator('#competition-title').fill('Innovation & Robotic Competition');

console.log('inputs set, waiting for background removal (model download on first run)...');
await page.locator('.preview-overlay').waitFor({ state: 'hidden', timeout: 600_000 });
await page.waitForTimeout(1000);

const dims = await page.evaluate(() => {
  const c = document.querySelector('canvas.poster-canvas');
  return { width: c.width, height: c.height };
});
console.log('canvas resolution:', JSON.stringify(dims));

const errorText = await page
  .locator('.form-error')
  .textContent()
  .catch(() => null);
if (errorText) console.log('form error shown:', errorText);

await canvas.screenshot({ path: 'verify/poster-final.png' });
console.log('final poster saved to verify/poster-final.png');

for (const ratio of ['4:5', '3:4', '1:1', '9:16']) {
  await page.getByRole('button', { name: ratio, exact: true }).click();
  await page.waitForTimeout(400);
  const size = await page.evaluate(() => {
    const c = document.querySelector('canvas.poster-canvas');
    return { width: c.width, height: c.height };
  });
  const slug = ratio.replace(':', 'x');
  await canvas.screenshot({ path: `verify/poster-${slug}.png` });
  console.log(`ratio ${ratio}:`, JSON.stringify(size), `-> verify/poster-${slug}.png`);
}

await browser.close();
