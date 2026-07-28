# School Result Poster Generator

A client-side web app that turns a student photo, a placement (1st / 2nd / 3rd), a school logo, and a name into a high-resolution result poster with a fixed F1-style design: a giant "P1" / "P2" / "P3" behind a cutout of the student on a dark navy textured background, with the logo and name in a footer strip.

Everything runs in the browser — the photo background is removed locally with [`@imgly/background-removal`](https://github.com/imgly/background-removal-js) (WASM), and the poster is composed on a 2048x2560 canvas and exported as PNG. No server, no uploads.

## Setup

```bash
npm install
npm run dev
```

Open the printed URL (default http://localhost:5173).

## Usage

1. Drag in (or browse for) the student photo. Background removal and color adjustment start automatically; the first run downloads the segmentation model (~40 MB), so it takes a little longer.
2. Pick the placement (1st, 2nd, or 3rd place).
3. Choose an image ratio (`3:4`, `1:1`, or `9:16`). The live preview and export update immediately.
4. Upload the school logo (transparent PNG recommended).
5. Type the student name.
6. Click **Download poster (PNG)** — the exported file is named `poster-<name>-P<n>-<ratio>.png`.

## Build

```bash
npm run build
npm run preview
```

## Tech

- Vite + React + TypeScript
- Canvas 2D compositing (`src/lib/renderPoster.ts`)
- Browser background removal (`src/lib/removeBackground.ts`)
- Self-hosted fonts: Anton (placement numeral) and Archivo (name strip) in `public/fonts/`
