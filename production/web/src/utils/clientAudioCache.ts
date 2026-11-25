/**
 * Client-Side Browser Audio Cache (IndexedDB + In-Memory Blob URL Pool)
 * - Caches Master & 6 Separated Stem audio blobs locally on the user's device (IndexedDB)
 *   for instant studio playback and zero redundant network transfers across sessions.
 */

const DB_NAME = 'kythra_client_audio_cache_v1';
const STORE_NAME = 'audio_blobs';
const DB_VERSION = 1;

function openAudioCacheDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveAudioBlobToClientDb(
  trackKey: string,
  channelId: string,
  blob: Blob
): Promise<void> {
  try {
    const db = await openAudioCacheDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({
        cacheKey: `${trackKey}::${channelId}`,
        trackKey,
        channelId,
        blob,
        updatedAt: Date.now()
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Ignore quota or private-browsing IndexedDB restrictions
  }
}

export async function loadAudioBlobFromClientDb(
  trackKey: string,
  channelId: string
): Promise<Blob | null> {
  try {
    const db = await openAudioCacheDb();
    const record = await new Promise<any>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(`${trackKey}::${channelId}`);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (record && record.blob instanceof Blob && record.blob.size > 0) {
      return record.blob;
    }
    return null;
  } catch {
    return null;
  }
}

export async function hasCachedTrackInClientDb(trackKey: string): Promise<boolean> {
  const master = await loadAudioBlobFromClientDb(trackKey, 'master');
  if (master) return true;
  const guitar = await loadAudioBlobFromClientDb(trackKey, 'guitar');
  return Boolean(guitar);
}

export async function listCachedChannelIdsForTrack(trackKey: string): Promise<string[]> {
  if (!trackKey) return [];
  try {
    const db = await openAudioCacheDb();
    const channelIds = new Set<string>();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) return;
        const val = cursor.value as
          | { cacheKey?: string; trackKey?: string; channelId?: string; blob?: unknown }
          | undefined;
        const matchesTrack =
          val?.trackKey === trackKey ||
          (typeof val?.cacheKey === 'string' && val.cacheKey.startsWith(`${trackKey}::`));
        if (matchesTrack && val?.blob instanceof Blob && val.blob.size > 0) {
          const chId =
            val.channelId ||
            (typeof val.cacheKey === 'string' ? val.cacheKey.slice(trackKey.length + 2) : '');
          if (chId) {
            channelIds.add(chId);
          }
        }
        cursor.continue();
      };
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return Array.from(channelIds);
  } catch {
    return [];
  }
}

export async function deleteCachedTrackFromClientDb(trackKey: string): Promise<void> {
  if (!trackKey) return;
  try {
    const db = await openAudioCacheDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) return;
        const val = cursor.value as { cacheKey?: string; trackKey?: string } | undefined;
        if (
          val?.trackKey === trackKey ||
          (typeof val?.cacheKey === 'string' && val.cacheKey.startsWith(`${trackKey}::`))
        ) {
          cursor.delete();
        }
        cursor.continue();
      };
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Ignore IndexedDB unavailability
  }
}
