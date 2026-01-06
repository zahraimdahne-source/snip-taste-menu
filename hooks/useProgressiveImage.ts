import { useState, useEffect } from 'react';

/**
 * Custom hook for progressive image loading with placeholder
 * Solves the problem of large GIF files being invisible on slow connections
 *
 * @param targetSrc - The final image source (usually a large GIF)
 * @param placeholderSrc - Lightweight placeholder image (PNG)
 * @returns Object with current image source, loading state, error state, and CSS class
 */
export const useProgressiveImage = (targetSrc: string, placeholderSrc: string = '/logo.png') => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset states when target changes
    setIsLoaded(false);
    setHasError(false);

    // Preload the target image in the background
    const img = new Image();

    img.onload = () => {
      setIsLoaded(true);
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoaded(true); // Still mark as "loaded" to stop spinner
    };

    img.src = targetSrc;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [targetSrc]);

  // Determine which image to show
  const currentSrc = hasError ? placeholderSrc : isLoaded ? targetSrc : placeholderSrc;

  // Determine CSS class for styling
  const imageClass = hasError ? 'error' : isLoaded ? 'loaded' : 'loading';

  return {
    src: currentSrc,
    isLoading: !isLoaded && !hasError,
    isLoaded,
    hasError,
    className: imageClass,
  };
};
