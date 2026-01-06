import { useEffect } from 'react';

export const useServiceWorker = () => {
  useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      // Service workers not supported
      return;
    }

    // Register service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        // Service worker registered successfully

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          // Update found

          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              // New version available

              // Optionally notify user
              if (window.confirm('New version available! Refresh to update?')) {
                newWorker.postMessage('skipWaiting');
                window.location.reload();
              }
            }
          });
        });

        // Handle controller change (new SW activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // Controller changed, reloading
          window.location.reload();
        });
      } catch (error) {
        console.error('[SW] Registration failed:', error);
      }
    };

    // Register when DOM is ready
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', registerSW);
    };
  }, []);
};

// Function to clear service worker cache
export const clearServiceWorkerCache = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.active?.postMessage('clearCache');
      // Cache cleared
    }
  }
};
