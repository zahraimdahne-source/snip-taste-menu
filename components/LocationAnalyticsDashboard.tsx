import React, { useState, useEffect } from 'react';
import { locationService, LocationData } from '../utils/locationService';
import { offlineMapService } from '../utils/offlineMapService';
import { RESTAURANT_COORDS } from '../utils/distance';

interface LocationAnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationAnalyticsDashboard: React.FC<LocationAnalyticsDashboardProps> = ({
  isOpen,
  onClose,
}) => {
  const [analytics, setAnalytics] = useState(locationService.getAnalytics());
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>(
    'unknown'
  );
  const [cacheSize, setCacheSize] = useState(0);
  const [offlineAreas, setOfflineAreas] = useState<any[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    // Load analytics
    setAnalytics(locationService.getAnalytics());

    // Check permission
    const permStatus = await locationService.checkPermission();
    setPermission(permStatus.permission);

    // Get current location
    try {
      const loc = await locationService.getCurrentLocation({ useCache: true });
      setCurrentLocation(loc);
    } catch (error) {
      console.error('Failed to get location:', error);
    }

    // Get cache size
    try {
      const size = await offlineMapService.getCacheSize();
      setCacheSize(size);
    } catch (error) {
      console.error('Failed to get cache size:', error);
    }

    // Get offline areas
    try {
      const areas = await offlineMapService.getAreas();
      setOfflineAreas(areas);
    } catch (error) {
      console.error('Failed to get offline areas:', error);
    }
  };

  const handleDownloadArea = async () => {
    if (!currentLocation) {
      alert('Please enable location first');
      return;
    }

    setIsDownloading(true);
    try {
      await offlineMapService.downloadArea(
        'Restaurant Area',
        RESTAURANT_COORDS,
        5, // 5km radius
        [13, 14, 15], // Zoom levels
        (current, total) => {
          setDownloadProgress({ current, total });
        }
      );
      alert('✅ Offline map downloaded successfully!');
      loadData();
    } catch (error) {
      console.error('Failed to download area:', error);
      alert('❌ Failed to download offline map');
    } finally {
      setIsDownloading(false);
      setDownloadProgress({ current: 0, total: 0 });
    }
  };

  const handleDeleteArea = async (areaId: string) => {
    if (confirm('Delete this offline area?')) {
      try {
        await offlineMapService.deleteArea(areaId);
        alert('✅ Offline area deleted');
        loadData();
      } catch (error) {
        console.error('Failed to delete area:', error);
        alert('❌ Failed to delete area');
      }
    }
  };

  const handleClearCache = async () => {
    if (confirm('Clear all cached data? This will delete all offline maps.')) {
      try {
        await offlineMapService.clearCache();
        alert('✅ Cache cleared');
        loadData();
      } catch (error) {
        console.error('Failed to clear cache:', error);
        alert('❌ Failed to clear cache');
      }
    }
  };

  const handleResetAnalytics = () => {
    if (confirm('Reset all analytics data?')) {
      locationService.resetAnalytics();
      setAnalytics(locationService.getAnalytics());
      alert('✅ Analytics reset');
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const getSuccessRate = (): number => {
    if (analytics.attempts === 0) return 0;
    return Math.round((analytics.successes / analytics.attempts) * 100);
  };

  const getQualityColor = (quality: string): string => {
    switch (quality) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-orange-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  const locationQuality = currentLocation
    ? locationService.getLocationQuality(currentLocation)
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📍 Location Analytics</h2>
            <p className="text-sm text-gray-500">Deep analysis of location services</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Permission Status */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
            <h3 className="font-bold text-gray-800 mb-2">🔐 Permission Status</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {permission === 'granted' ? '✅' : permission === 'denied' ? '❌' : '⏳'}
              </span>
              <span className="font-semibold capitalize">{permission}</span>
            </div>
            {permission === 'denied' && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ Location permission is blocked. Please enable it in your browser settings.
              </p>
            )}
          </div>

          {/* Current Location */}
          {currentLocation && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
              <h3 className="font-bold text-gray-800 mb-3">📌 Current Location</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Latitude:</span>
                  <p className="font-mono font-semibold">{currentLocation.lat.toFixed(6)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Longitude:</span>
                  <p className="font-mono font-semibold">{currentLocation.lng.toFixed(6)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Accuracy:</span>
                  <p className="font-semibold">{currentLocation.accuracy.toFixed(1)}m</p>
                </div>
                <div>
                  <span className="text-gray-600">Source:</span>
                  <p className="font-semibold uppercase">{currentLocation.source}</p>
                </div>
                {locationQuality && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Quality:</span>
                    <p className={`font-semibold ${getQualityColor(locationQuality.quality)}`}>
                      {locationQuality.quality.toUpperCase()} - {locationQuality.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">📊 Performance Analytics</h3>
              <button
                onClick={handleResetAnalytics}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <span className="text-gray-600 text-xs">Total Attempts</span>
                <p className="text-2xl font-bold text-blue-600">{analytics.attempts}</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <span className="text-gray-600 text-xs">Successes</span>
                <p className="text-2xl font-bold text-green-600">{analytics.successes}</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <span className="text-gray-600 text-xs">Failures</span>
                <p className="text-2xl font-bold text-red-600">{analytics.failures}</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <span className="text-gray-600 text-xs">Success Rate</span>
                <p className="text-2xl font-bold text-purple-600">{getSuccessRate()}%</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <span className="text-gray-600 text-xs">Avg Accuracy</span>
                <p className="text-lg font-bold text-blue-600">
                  {analytics.averageAccuracy.toFixed(1)}m
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <span className="text-gray-600 text-xs">Avg Time</span>
                <p className="text-lg font-bold text-green-600">
                  {(analytics.averageTime / 1000).toFixed(1)}s
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm col-span-2">
                <span className="text-gray-600 text-xs">Last Update</span>
                <p className="text-sm font-semibold text-gray-800">
                  {analytics.lastUpdate ? formatDate(analytics.lastUpdate) : 'Never'}
                </p>
              </div>
            </div>

            {/* Recent Errors */}
            {analytics.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700 mb-2 text-sm">Recent Errors:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {analytics.errors
                    .slice(-5)
                    .reverse()
                    .map((error, idx) => (
                      <div key={idx} className="bg-red-50 rounded p-2 text-xs">
                        <span className="font-semibold text-red-700">Code {error.code}:</span>{' '}
                        <span className="text-red-600">{error.message}</span>
                        <span className="text-gray-500 ml-2">
                          ({new Date(error.timestamp).toLocaleTimeString()})
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Offline Maps */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <h3 className="font-bold text-gray-800 mb-3">🗺️ Offline Maps</h3>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Cache Size:</span>
                <span className="font-semibold text-purple-600">{formatBytes(cacheSize)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Downloaded Areas:</span>
                <span className="font-semibold text-purple-600">{offlineAreas.length}</span>
              </div>
            </div>

            {/* Download Restaurant Area */}
            <div className="mb-4">
              <button
                onClick={handleDownloadArea}
                disabled={isDownloading || !currentLocation}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <span>
                    Downloading... {downloadProgress.current}/{downloadProgress.total}
                  </span>
                ) : (
                  '📥 Download Restaurant Area (5km)'
                )}
              </button>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Download map tiles for offline use around the restaurant
              </p>
            </div>

            {/* Downloaded Areas List */}
            {offlineAreas.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 text-sm">Downloaded Areas:</h4>
                {offlineAreas.map((area) => (
                  <div key={area.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{area.name}</p>
                        <p className="text-xs text-gray-500">
                          {area.radius}km radius • {formatBytes(area.size)} • {area.tiles.length}{' '}
                          tiles
                        </p>
                        <p className="text-xs text-gray-400">
                          Downloaded: {formatDate(area.downloadedAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteArea(area.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Clear Cache Button */}
            {cacheSize > 0 && (
              <button
                onClick={handleClearCache}
                className="w-full mt-3 bg-red-100 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors text-sm"
              >
                🗑️ Clear All Cache
              </button>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
            <h3 className="font-bold text-gray-800 mb-3">💡 Recommendations</h3>
            <ul className="space-y-2 text-sm">
              {permission !== 'granted' && (
                <li className="flex items-start gap-2">
                  <span className="text-red-500">❌</span>
                  <span>Enable location permission for best accuracy</span>
                </li>
              )}
              {currentLocation && currentLocation.accuracy > 50 && (
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">⚠️</span>
                  <span>Move to an open area for better GPS signal</span>
                </li>
              )}
              {offlineAreas.length === 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">💡</span>
                  <span>Download offline maps for use without internet</span>
                </li>
              )}
              {getSuccessRate() < 80 && analytics.attempts > 5 && (
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">⚠️</span>
                  <span>Low success rate detected. Check GPS settings and signal.</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span>Keep GPS enabled for automatic location updates</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};
