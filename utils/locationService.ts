/**
 * Advanced Location Service
 * Provides high-accuracy location tracking with multiple fallback mechanisms
 * Includes caching, analytics, and offline support
 */

export interface LocationData {
  lat: number;
  lng: number;
  accuracy: number; // in meters
  timestamp: number;
  source: 'gps' | 'network' | 'cached' | 'ip';
  speed?: number; // meters per second
  heading?: number; // degrees
}

export interface LocationAnalytics {
  attempts: number;
  successes: number;
  failures: number;
  averageAccuracy: number;
  averageTime: number; // milliseconds
  lastUpdate: number;
  errors: Array<{
    code: number;
    message: string;
    timestamp: number;
  }>;
}

class LocationService {
  private static instance: LocationService;
  private watchId: number | null = null;
  private currentLocation: LocationData | null = null;
  private analytics: LocationAnalytics;
  private readonly CACHE_KEY = 'snip_location_cache';
  private readonly ANALYTICS_KEY = 'snip_location_analytics';
  private readonly MAX_CACHE_AGE = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.analytics = this.loadAnalytics();
    this.loadCachedLocation();
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Get current location with high accuracy
   * Uses multiple strategies for best results
   */
  public async getCurrentLocation(options?: {
    useCache?: boolean;
    maxAge?: number;
    timeout?: number;
  }): Promise<LocationData> {
    const startTime = Date.now();
    this.analytics.attempts++;

    // Check cache first if allowed
    if (options?.useCache && this.currentLocation) {
      const age = Date.now() - this.currentLocation.timestamp;
      const maxAge = options.maxAge || this.MAX_CACHE_AGE;

      if (age < maxAge) {
        console.log('📍 Using cached location (age: ' + Math.round(age / 1000) + 's)');
        return this.currentLocation;
      }
    }

    try {
      // Try high-accuracy GPS first
      const location = await this.getHighAccuracyLocation(options?.timeout);

      // Update analytics
      this.analytics.successes++;
      this.analytics.averageTime =
        (this.analytics.averageTime * (this.analytics.successes - 1) + (Date.now() - startTime)) /
        this.analytics.successes;
      this.analytics.averageAccuracy =
        (this.analytics.averageAccuracy * (this.analytics.successes - 1) + location.accuracy) /
        this.analytics.successes;
      this.analytics.lastUpdate = Date.now();

      this.saveAnalytics();
      this.cacheLocation(location);

      return location;
    } catch (error: any) {
      this.analytics.failures++;
      this.analytics.errors.push({
        code: error.code || 0,
        message: error.message || 'Unknown error',
        timestamp: Date.now(),
      });

      // Keep only last 10 errors
      if (this.analytics.errors.length > 10) {
        this.analytics.errors = this.analytics.errors.slice(-10);
      }

      this.saveAnalytics();

      // Try fallback methods
      console.warn('⚠️ High-accuracy GPS failed, trying fallbacks...', error);

      // Fallback 1: Try lower accuracy
      try {
        const location = await this.getLowAccuracyLocation(options?.timeout);
        this.cacheLocation(location);
        return location;
      } catch (fallbackError) {
        console.warn('⚠️ Low-accuracy GPS also failed', fallbackError);
      }

      // Fallback 2: Use cached location if available
      if (this.currentLocation) {
        console.log('📍 Using cached location as fallback');
        return this.currentLocation;
      }

      // Fallback 3: Try IP-based geolocation
      try {
        const ipLocation = await this.getIPBasedLocation();
        this.cacheLocation(ipLocation);
        return ipLocation;
      } catch (ipError) {
        console.warn('⚠️ IP-based location also failed', ipError);
      }

      // All methods failed
      throw new Error('Unable to determine location. Please enable GPS and try again.');
    }
  }

  /**
   * Get high-accuracy GPS location
   */
  private getHighAccuracyLocation(timeout: number = 15000): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: timeout,
        maximumAge: 0, // Don't use cached positions
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            source: 'gps',
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
          };
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        options
      );
    });
  }

  /**
   * Get lower-accuracy location (faster, uses network)
   */
  private getLowAccuracyLocation(timeout: number = 10000): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: false, // Use network-based location
        timeout: timeout,
        maximumAge: 30000, // Accept 30-second old positions
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            source: 'network',
          };
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        options
      );
    });
  }

  /**
   * Get IP-based location as last resort
   */
  private async getIPBasedLocation(): Promise<LocationData> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      return {
        lat: data.latitude,
        lng: data.longitude,
        accuracy: 5000, // IP-based is very inaccurate (5km)
        timestamp: Date.now(),
        source: 'ip',
      };
    } catch (error) {
      throw new Error('IP-based location failed');
    }
  }

  /**
   * Start watching location changes
   */
  public startWatching(callback: (location: LocationData) => void): void {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    if (this.watchId !== null) {
      this.stopWatching();
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: LocationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          source: 'gps',
          speed: position.coords.speed || undefined,
          heading: position.coords.heading || undefined,
        };

        this.currentLocation = location;
        this.cacheLocation(location);
        callback(location);
      },
      (error) => {
        console.error('Watch position error:', error);
      },
      options
    );
  }

  /**
   * Stop watching location changes
   */
  public stopWatching(): void {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Cache location to localStorage
   */
  private cacheLocation(location: LocationData): void {
    this.currentLocation = location;
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(location));
    } catch (error) {
      console.warn('Failed to cache location:', error);
    }
  }

  /**
   * Load cached location from localStorage
   */
  private loadCachedLocation(): void {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const location = JSON.parse(cached) as LocationData;
        const age = Date.now() - location.timestamp;

        if (age < this.MAX_CACHE_AGE) {
          this.currentLocation = location;
          console.log('📍 Loaded cached location');
        } else {
          console.log('📍 Cached location too old, discarding');
          localStorage.removeItem(this.CACHE_KEY);
        }
      }
    } catch (error) {
      console.warn('Failed to load cached location:', error);
    }
  }

  /**
   * Get analytics data
   */
  public getAnalytics(): LocationAnalytics {
    return { ...this.analytics };
  }

  /**
   * Load analytics from localStorage
   */
  private loadAnalytics(): LocationAnalytics {
    try {
      const cached = localStorage.getItem(this.ANALYTICS_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Failed to load analytics:', error);
    }

    return {
      attempts: 0,
      successes: 0,
      failures: 0,
      averageAccuracy: 0,
      averageTime: 0,
      lastUpdate: 0,
      errors: [],
    };
  }

  /**
   * Save analytics to localStorage
   */
  private saveAnalytics(): void {
    try {
      localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(this.analytics));
    } catch (error) {
      console.warn('Failed to save analytics:', error);
    }
  }

  /**
   * Reset analytics
   */
  public resetAnalytics(): void {
    this.analytics = {
      attempts: 0,
      successes: 0,
      failures: 0,
      averageAccuracy: 0,
      averageTime: 0,
      lastUpdate: 0,
      errors: [],
    };
    this.saveAnalytics();
  }

  /**
   * Check if geolocation is supported and permitted
   */
  public async checkPermission(): Promise<{
    supported: boolean;
    permission: 'granted' | 'denied' | 'prompt' | 'unknown';
  }> {
    if (!navigator.geolocation) {
      return { supported: false, permission: 'unknown' };
    }

    try {
      const result = await navigator.permissions.query({
        name: 'geolocation' as PermissionName,
      });
      return { supported: true, permission: result.state as any };
    } catch (error) {
      // Permission API not supported
      return { supported: true, permission: 'unknown' };
    }
  }

  /**
   * Get location quality assessment
   */
  public getLocationQuality(location: LocationData): {
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    description: string;
    color: string;
  } {
    const { accuracy, source } = location;

    if (source === 'ip') {
      return {
        quality: 'poor',
        description: 'IP-based location (very approximate)',
        color: 'red',
      };
    }

    if (accuracy <= 10) {
      return {
        quality: 'excellent',
        description: `GPS accuracy: ${accuracy.toFixed(1)}m`,
        color: 'green',
      };
    } else if (accuracy <= 50) {
      return {
        quality: 'good',
        description: `GPS accuracy: ${accuracy.toFixed(1)}m`,
        color: 'blue',
      };
    } else if (accuracy <= 200) {
      return {
        quality: 'fair',
        description: `Network accuracy: ${accuracy.toFixed(1)}m`,
        color: 'orange',
      };
    } else {
      return {
        quality: 'poor',
        description: `Low accuracy: ${accuracy.toFixed(1)}m`,
        color: 'red',
      };
    }
  }
}

export const locationService = LocationService.getInstance();
