import type {
  AspectRatioId,
  ColorThemeId,
  LayoutOverrides,
  PatternId,
  Placement,
} from './renderPoster';
import type { MultiPlacement, PersonCount } from './renderMultiPoster';

const DB_NAME = 'poster-library';
const DB_VERSION = 1;
const STORE = 'posters';

export type PosterMode = 'single' | 'multiple';

export type SavedLogo =
  | { kind: 'default' }
  | { kind: 'custom'; blob: Blob; name: string };

export interface SavedPerson {
  name: string;
  placement: MultiPlacement;
  photoBlob: Blob | null;
  photoName: string | null;
  cutoutBlob: Blob | null;
}

export interface SavedPosterBase {
  id: string;
  mode: PosterMode;
  createdAt: number;
  updatedAt: number;
  label: string;
  title: string;
  level: string;
  aspectRatio: AspectRatioId;
  colorTheme: ColorThemeId;
  pattern: PatternId;
  layoutOverrides: LayoutOverrides;
  logo: SavedLogo;
  thumbBlob: Blob | null;
}

export interface SavedSinglePoster extends SavedPosterBase {
  mode: 'single';
  name: string;
  category: string;
  placement: Placement;
  photoBlob: Blob | null;
  photoName: string | null;
  cutoutBlob: Blob | null;
}

export interface SavedMultiplePoster extends SavedPosterBase {
  mode: 'multiple';
  personCount: PersonCount;
  people: SavedPerson[];
}

export type SavedPoster = SavedSinglePoster | SavedMultiplePoster;

/** Lightweight row for Library list (includes thumb). */
export type PosterListItem = Pick<
  SavedPoster,
  'id' | 'mode' | 'label' | 'createdAt' | 'updatedAt' | 'thumbBlob'
>;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error('Failed to open library DB'));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt');
      }
    };
  });
}

function idbReq<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

export function newPosterId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `poster-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Convert an ImageBitmap to a PNG Blob. */
export async function bitmapToPngBlob(bitmap: ImageBitmap): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas for bitmap export');
  ctx.drawImage(bitmap, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to encode PNG'));
    }, 'image/png');
  });
}

/** Shrink canvas preview to a library thumbnail PNG. */
export async function canvasToThumbBlob(
  canvas: HTMLCanvasElement,
  maxEdge = 360,
): Promise<Blob> {
  const scale = Math.min(1, maxEdge / Math.max(canvas.width, canvas.height));
  const w = Math.max(1, Math.round(canvas.width * scale));
  const h = Math.max(1, Math.round(canvas.height * scale));
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const ctx = off.getContext('2d');
  if (!ctx) throw new Error('Could not create thumb canvas');
  ctx.drawImage(canvas, 0, 0, w, h);
  return new Promise((resolve, reject) => {
    off.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to encode thumbnail'));
    }, 'image/png');
  });
}

export function blobToFile(blob: Blob, name: string): File {
  return new File([blob], name, { type: blob.type || 'image/png' });
}

export async function listPosters(): Promise<PosterListItem[]> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const all = await idbReq(store.getAll() as IDBRequest<SavedPoster[]>);
    return all
      .map((p) => ({
        id: p.id,
        mode: p.mode,
        label: p.label,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        thumbBlob: p.thumbBlob,
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } finally {
    db.close();
  }
}

export async function getPoster(id: string): Promise<SavedPoster | null> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const row = await idbReq(store.get(id) as IDBRequest<SavedPoster | undefined>);
    return row ?? null;
  } finally {
    db.close();
  }
}

export async function savePoster(poster: SavedPoster): Promise<void> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    await idbReq(store.put(poster));
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('Save failed'));
      tx.onabort = () => reject(tx.error ?? new Error('Save aborted'));
    });
  } finally {
    db.close();
  }
}

export async function deletePoster(id: string): Promise<void> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    await idbReq(store.delete(id));
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('Delete failed'));
      tx.onabort = () => reject(tx.error ?? new Error('Delete aborted'));
    });
  } finally {
    db.close();
  }
}
