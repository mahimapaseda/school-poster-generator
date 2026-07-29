# School Result Poster Generator

A client-side web app that turns a student photo, a placement (1st / 2nd / 3rd), a school logo, and a name into a high-resolution result poster with a fixed F1-style design: a giant school logo behind a cutout of the student on a dark navy textured background, with the placement (1ˢᵗ / 2ⁿᵈ / 3ʳᵈ) in the top-left corner and the name in a footer strip.

Everything runs in the browser — the photo background is removed locally with [`@imgly/background-removal`](https://github.com/imgly/background-removal-js) (WASM), and the poster is composed on a 2048x2560 canvas and exported as PNG. No server, no uploads.

## Setup

```bash
npm install
npm run dev
```

Open the printed URL (default http://localhost:5173). The app opens on the **Home** page.

## Modes

- **Single Mode** (`/single`) — create one poster for one student (current full editor).
- **Multiple Mode** (`/multiple`) — placeholder for upcoming batch generation.

## Usage (Single Mode)

1. From Home, choose **Single Mode**.
2. Drag in (or browse for) the student photo. Background removal and color adjustment start automatically; the first run downloads the segmentation model (~40 MB), so it takes a little longer.
3. Pick the placement (1st, 2nd, or 3rd place).
4. Open **More options** to choose image ratio (`4:5`, `3:4`, `1:1`, or `9:16`), color theme, and background pattern.
5. Enter the **Level** (e.g. "All Island", "Central Province"), **Title**, and optional **Category**.
6. Upload the school logo (transparent PNG recommended) — shown large behind the student.
7. Type the student name.
8. Click **Download poster (PNG)** — the exported file is named `poster-<name>-P<n>-<ratio>.png`.

Use **Home** in the sidebar (or mobile toolbar) to return to mode selection.

## Build

```bash
npm run build
npm run preview
```

## Install as an app (PWA)

After `npm run build && npm run preview` (or deploying over HTTPS):

1. Open the app in Chrome / Edge.
2. Click **Install app** in the sidebar (or use the browser install icon in the address bar).
3. Launch **Poster Gen** from your desktop / Start menu / home screen — it opens fullscreen like a native app.

On iPhone/iPad: Safari → Share → **Add to Home Screen**.

The service worker caches the app shell and fonts for faster launches. The background-removal model still downloads on first photo processing (~40 MB).

## Screenshots

Desktop UI (More options):

![Desktop UI](public/screenshots/desktop-ui.png)

Mobile / tablet UI (responsive overlay; no page scrolling):

![Mobile / Tablet UI](public/screenshots/mobile-ui.png)

Bold demo for Level + Competition title:

![Text styling](public/screenshots/text-bold.png)

## Tech

- Vite + React + TypeScript
- React Router (Home / Single / Multiple)
- Progressive Web App (`vite-plugin-pwa`) — installable, standalone display
- Canvas 2D compositing (`src/lib/renderPoster.ts`)
- Browser background removal (`src/lib/removeBackground.ts`)
- Self-hosted fonts: Anton (placement numeral) and Archivo (name strip) in `public/fonts/`
