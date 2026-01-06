import React, { useState } from 'react';

interface OptimizedImageProps {
  webpSrc: string;
  gifSrc: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  draggable?: boolean;
}

/**
 * OptimizedImage Component
 *
 * Automatically uses WebP format with GIF fallback for older browsers.
 * This provides 90% smaller file sizes while maintaining compatibility.
 *
 * @example
 * <OptimizedImage
 *   webpSrc="/logo-snow3.webp"
 *   gifSrc="/logo snow3.gif"
 *   alt="Snip Taste Logo"
 *   className="w-80 h-80"
 * />
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  webpSrc,
  gifSrc,
  alt,
  className = '',
  style = {},
  loading = 'lazy',
  onLoad,
  draggable = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  const handleError = () => {
    console.warn(`Failed to load WebP image: ${webpSrc}, falling back to GIF`);
    setHasError(true);
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  return (
    <picture>
      {/* WebP source - modern browsers will use this (90% smaller!) */}
      {!hasError && <source srcSet={webpSrc} type="image/webp" />}

      {/* GIF fallback - for older browsers or if WebP fails */}
      <img
        src={hasError ? gifSrc : webpSrc}
        alt={alt}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={style}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        draggable={draggable}
      />
    </picture>
  );
};

export default OptimizedImage;
