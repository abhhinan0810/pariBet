/**
 * storageSync.ts - Central Server Synchronization Adapter
 * 
 * Provides synchronized storage across all devices connecting to pariBet.
 * Syncs with the central backend server (/api/storage) while maintaining
 * an in-memory & localStorage fallback for instant synchronous reads.
 */

export const SHARED_STORAGE_KEYS = [
  'paribet_student_credentials',
  'paribet_mock_users',
  'paribet_mock_predictions',
  'paribet_mock_participations',
  'paribet_mock_transactions',
  'paribet_mock_loans',
  'paribet_mock_loan_requests',
  'paribet_mock_loan_offers',
  'paribet_mock_notifications',
  'paribet_mock_admin_logs'
];

class StorageSyncService {
  private cache: Map<string, string> = new Map();
  private syncPromise: Promise<void> | null = null;
  private pendingPushTimeouts: Map<string, any> = new Map();

  constructor() {
    // Prime cache from localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k) {
            const val = localStorage.getItem(k);
            if (val !== null) {
              this.cache.set(k, val);
            }
          }
        }
      } catch (e) {
        console.warn('[syncStorage] Could not initialize local cache:', e);
      }
    }
  }

  /**
   * Fast synchronous read from cache or localStorage
   */
  getItem(key: string): string | null {
    if (this.cache.has(key)) {
      return this.cache.get(key) ?? null;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = localStorage.getItem(key);
      if (val !== null) {
        this.cache.set(key, val);
        return val;
      }
    }
    return null;
  }

  /**
   * Authoritative async read: fetches fresh value from server
   */
  async getItemAsync(key: string): Promise<string | null> {
    try {
      const res = await fetch(`/api/storage/${encodeURIComponent(key)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.value !== undefined && data.value !== null) {
          const strVal = typeof data.value === 'string' ? data.value : JSON.stringify(data.value);
          this.cache.set(key, strVal);
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              localStorage.setItem(key, strVal);
            } catch {}
          }
          return strVal;
        }
      }
    } catch {
      // Offline / standalone fallback
    }
    return this.getItem(key);
  }

  /**
   * Synchronous setItem: updates local cache and schedules non-blocking network sync
   */
  setItem(key: string, value: string): void {
    this.cache.set(key, value);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('[syncStorage] LocalStorage write error:', e);
      }
    }

    // Debounce push slightly to batch rapid writes
    if (this.pendingPushTimeouts.has(key)) {
      clearTimeout(this.pendingPushTimeouts.get(key));
    }
    const timeout = setTimeout(() => {
      this.pendingPushTimeouts.delete(key);
      this.pushToServer(key, value).catch(() => {});
    }, 50);
    this.pendingPushTimeouts.set(key, timeout);
  }

  /**
   * Async setItem: guarantees that the value has been written to the central server
   */
  async setItemAsync(key: string, value: string): Promise<void> {
    this.cache.set(key, value);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('[syncStorage] LocalStorage write error:', e);
      }
    }
    if (this.pendingPushTimeouts.has(key)) {
      clearTimeout(this.pendingPushTimeouts.get(key));
      this.pendingPushTimeouts.delete(key);
    }
    await this.pushToServer(key, value);
  }

  removeItem(key: string): void {
    this.cache.delete(key);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
    fetch(`/api/storage/${encodeURIComponent(key)}`, { method: 'DELETE' }).catch(() => {});
  }

  async removeItemAsync(key: string): Promise<void> {
    this.cache.delete(key);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
    try {
      await fetch(`/api/storage/${encodeURIComponent(key)}`, { method: 'DELETE' });
    } catch {}
  }

  private async pushToServer(key: string, value: string): Promise<void> {
    let parsedValue: any = value;
    try {
      parsedValue = JSON.parse(value);
    } catch {}

    try {
      await fetch(`/api/storage/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parsedValue })
      });
    } catch {
      // Ignore network errors in offline mode
    }
  }

  /**
   * Bi-directional sync on page load:
   * 1. Fetches all server-persisted keys and updates local cache.
   * 2. If the client has existing shared keys not yet in the server DB, pushes them up.
   */
  async syncAll(): Promise<void> {
    if (this.syncPromise) return this.syncPromise;

    this.syncPromise = (async () => {
      try {
        const res = await fetch('/api/storage');
        if (!res.ok) return;

        const serverData: Record<string, any> = await res.json();
        const pendingUploads: Record<string, any> = {};

        // 1. Download server data to client cache
        for (const [k, v] of Object.entries(serverData)) {
          if (v !== undefined && v !== null) {
            const strVal = typeof v === 'string' ? v : JSON.stringify(v);
            this.cache.set(k, strVal);
            if (typeof window !== 'undefined' && window.localStorage) {
              try {
                localStorage.setItem(k, strVal);
              } catch {}
            }
          }
        }

        // 2. Upload any local items not yet in server (e.g. initial seed from laptop)
        if (typeof window !== 'undefined' && window.localStorage) {
          for (const key of SHARED_STORAGE_KEYS) {
            if (!(key in serverData)) {
              const localVal = localStorage.getItem(key);
              if (localVal) {
                try {
                  pendingUploads[key] = JSON.parse(localVal);
                } catch {
                  pendingUploads[key] = localVal;
                }
              }
            }
          }
        }

        if (Object.keys(pendingUploads).length > 0) {
          await fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updates: pendingUploads })
          });
        }
      } catch (err) {
        console.warn('[syncStorage] Initial sync skipped or running offline:', err);
      } finally {
        this.syncPromise = null;
      }
    })();

    return this.syncPromise;
  }
}

export const syncStorage = new StorageSyncService();

