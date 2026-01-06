/**
 * Offline Map Cache Service
 * Caches map tiles and location data for offline use
 * Uses IndexedDB for persistent storage
 */

interface MapTile {
  id: string;
  x: number;
  y: number;
  zoom: number;
  data: Blob;
  timestamp: number;
}

interface CachedRoute {
  id: string;
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  distance: number;
  duration: number;
  polyline: Array<{ lat: number; lng: number }>;
  timestamp: number;
}

interface OfflineArea {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number; // in kilometers
  zoomLevels: number[];
  tiles: string[]; // tile IDs
  downloadedAt: number;
  size: number; // in bytes
}

class OfflineMapService {
  private static instance: OfflineMapService;
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'SnipTasteOfflineMaps';
  private readonly DB_VERSION = 1;
  private readonly TILE_STORE = 'tiles';
  private readonly ROUTE_STORE = 'routes';
  private readonly AREA_STORE = 'areas';
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly TILE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

  private constructor() {
    this.initDB();
  }

  public static getInstance(): OfflineMapService {
    if (!OfflineMapService.instance) {
      OfflineMapService.instance = new OfflineMapService();
    }
    return OfflineMapService.instance;
  }

  /**
   * Initialize IndexedDB
   */
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB initialized for offline maps');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create tiles store
        if (!db.objectStoreNames.contains(this.TILE_STORE)) {
          const tileStore = db.createObjectStore(this.TILE_STORE, { keyPath: 'id' });
          tileStore.createIndex('timestamp', 'timestamp', { unique: false });
          tileStore.createIndex('zoom', 'zoom', { unique: false });
        }

        // Create routes store
        if (!db.objectStoreNames.contains(this.ROUTE_STORE)) {
          const routeStore = db.createObjectStore(this.ROUTE_STORE, { keyPath: 'id' });
          routeStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Create areas store
        if (!db.objectStoreNames.contains(this.AREA_STORE)) {
          const areaStore = db.createObjectStore(this.AREA_STORE, { keyPath: 'id' });
          areaStore.createIndex('name', 'name', { unique: false });
        }

        console.log('📦 IndexedDB stores created');
      };
    });
  }

  /**
   * Ensure DB is ready
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  /**
   * Cache a map tile
   */
  public async cacheTile(x: number, y: number, zoom: number, data: Blob): Promise<void> {
    const db = await this.ensureDB();
    const id = `${zoom}-${x}-${y}`;

    const tile: MapTile = {
      id,
      x,
      y,
      zoom,
      data,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.TILE_STORE], 'readwrite');
      const store = transaction.objectStore(this.TILE_STORE);
      const request = store.put(tile);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get cached tile
   */
  public async getTile(x: number, y: number, zoom: number): Promise<Blob | null> {
    const db = await this.ensureDB();
    const id = `${zoom}-${x}-${y}`;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.TILE_STORE], 'readonly');
      const store = transaction.objectStore(this.TILE_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        const tile = request.result as MapTile | undefined;
        if (tile) {
          // Check if tile is expired
          const age = Date.now() - tile.timestamp;
          if (age < this.TILE_EXPIRY) {
            resolve(tile.data);
          } else {
            // Tile expired, delete it
            this.deleteTile(x, y, zoom);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a tile
   */
  private async deleteTile(x: number, y: number, zoom: number): Promise<void> {
    const db = await this.ensureDB();
    const id = `${zoom}-${x}-${y}`;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.TILE_STORE], 'readwrite');
      const store = transaction.objectStore(this.TILE_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Cache a route
   */
  public async cacheRoute(
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
    distance: number,
    duration: number,
    polyline: Array<{ lat: number; lng: number }>
  ): Promise<void> {
    const db = await this.ensureDB();
    const id = `${from.lat.toFixed(4)},${from.lng.toFixed(4)}-${to.lat.toFixed(4)},${to.lng.toFixed(4)}`;

    const route: CachedRoute = {
      id,
      from,
      to,
      distance,
      duration,
      polyline,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.ROUTE_STORE], 'readwrite');
      const store = transaction.objectStore(this.ROUTE_STORE);
      const request = store.put(route);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get cached route
   */
  public async getRoute(
    from: { lat: number; lng: number },
    to: { lat: number; lng: number }
  ): Promise<CachedRoute | null> {
    const db = await this.ensureDB();
    const id = `${from.lat.toFixed(4)},${from.lng.toFixed(4)}-${to.lat.toFixed(4)},${to.lng.toFixed(4)}`;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.ROUTE_STORE], 'readonly');
      const store = transaction.objectStore(this.ROUTE_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        const route = request.result as CachedRoute | undefined;
        if (route) {
          // Check if route is still valid (1 hour)
          const age = Date.now() - route.timestamp;
          if (age < 60 * 60 * 1000) {
            resolve(route);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Download area for offline use
   */
  public async downloadArea(
    name: string,
    center: { lat: number; lng: number },
    radius: number,
    zoomLevels: number[],
    onProgress?: (progress: number, total: number) => void
  ): Promise<OfflineArea> {
    const tiles: string[] = [];
    let totalSize = 0;
    let downloaded = 0;

    // Calculate tiles needed for each zoom level
    for (const zoom of zoomLevels) {
      const tilesForZoom = this.getTilesInRadius(center, radius, zoom);
      const total = tilesForZoom.length;

      for (const { x, y } of tilesForZoom) {
        try {
          // Download tile from OpenStreetMap
          const tileUrl = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
          const response = await fetch(tileUrl);

          if (response.ok) {
            const blob = await response.blob();
            await this.cacheTile(x, y, zoom, blob);

            tiles.push(`${zoom}-${x}-${y}`);
            totalSize += blob.size;
            downloaded++;

            if (onProgress) {
              onProgress(downloaded, total * zoomLevels.length);
            }
          }

          // Rate limiting: wait 100ms between requests
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.warn(`Failed to download tile ${zoom}/${x}/${y}:`, error);
        }
      }
    }

    // Save area metadata
    const area: OfflineArea = {
      id: `area-${Date.now()}`,
      name,
      center,
      radius,
      zoomLevels,
      tiles,
      downloadedAt: Date.now(),
      size: totalSize,
    };

    await this.saveArea(area);
    return area;
  }

  /**
   * Calculate tiles in radius
   */
  private getTilesInRadius(
    center: { lat: number; lng: number },
    radius: number,
    zoom: number
  ): Array<{ x: number; y: number }> {
    const tiles: Array<{ x: number; y: number }> = [];
    const centerTile = this.latLngToTile(center.lat, center.lng, zoom);

    // Calculate how many tiles we need based on radius
    const metersPerTile =
      (40075016.686 * Math.cos((center.lat * Math.PI) / 180)) / Math.pow(2, zoom + 8);
    const tilesRadius = Math.ceil((radius * 1000) / metersPerTile);

    for (let dx = -tilesRadius; dx <= tilesRadius; dx++) {
      for (let dy = -tilesRadius; dy <= tilesRadius; dy++) {
        const x = centerTile.x + dx;
        const y = centerTile.y + dy;

        // Check if tile is within radius
        const tileLat = this.tileToLat(y, zoom);
        const tileLng = this.tileToLng(x, zoom);
        const distance = this.calculateDistance(center.lat, center.lng, tileLat, tileLng);

        if (distance <= radius) {
          tiles.push({ x, y });
        }
      }
    }

    return tiles;
  }

  /**
   * Convert lat/lng to tile coordinates
   */
  private latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
    const n = Math.pow(2, zoom);
    const x = Math.floor(((lng + 180) / 360) * n);
    const y = Math.floor(
      ((1 -
        Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
        2) *
        n
    );
    return { x, y };
  }

  /**
   * Convert tile Y to latitude
   */
  private tileToLat(y: number, zoom: number): number {
    const n = Math.pow(2, zoom);
    const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
    return (latRad * 180) / Math.PI;
  }

  /**
   * Convert tile X to longitude
   */
  private tileToLng(x: number, zoom: number): number {
    const n = Math.pow(2, zoom);
    return (x / n) * 360 - 180;
  }

  /**
   * Calculate distance between two points (Haversine)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Save area metadata
   */
  private async saveArea(area: OfflineArea): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.AREA_STORE], 'readwrite');
      const store = transaction.objectStore(this.AREA_STORE);
      const request = store.put(area);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all downloaded areas
   */
  public async getAreas(): Promise<OfflineArea[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.AREA_STORE], 'readonly');
      const store = transaction.objectStore(this.AREA_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete an area and its tiles
   */
  public async deleteArea(areaId: string): Promise<void> {
    const db = await this.ensureDB();
    const areas = await this.getAreas();
    const area = areas.find((a) => a.id === areaId);

    if (!area) {
      throw new Error('Area not found');
    }

    // Delete all tiles
    for (const tileId of area.tiles) {
      const [zoom, x, y] = tileId.split('-').map(Number);
      await this.deleteTile(x, y, zoom);
    }

    // Delete area metadata
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.AREA_STORE], 'readwrite');
      const store = transaction.objectStore(this.AREA_STORE);
      const request = store.delete(areaId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get total cache size
   */
  public async getCacheSize(): Promise<number> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.TILE_STORE], 'readonly');
      const store = transaction.objectStore(this.TILE_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const tiles = request.result as MapTile[];
        const totalSize = tiles.reduce((sum, tile) => sum + tile.data.size, 0);
        resolve(totalSize);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all cached data
   */
  public async clearCache(): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [this.TILE_STORE, this.ROUTE_STORE, this.AREA_STORE],
        'readwrite'
      );

      const tileStore = transaction.objectStore(this.TILE_STORE);
      const routeStore = transaction.objectStore(this.ROUTE_STORE);
      const areaStore = transaction.objectStore(this.AREA_STORE);

      tileStore.clear();
      routeStore.clear();
      areaStore.clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const offlineMapService = OfflineMapService.getInstance();
