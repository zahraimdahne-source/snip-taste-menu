import React, { useState, ImgHTMLAttributes } from 'react';

export default function LazyImage({
  src,
  alt,
  className = '',
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative">
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 animate-pulse rounded bg-snip-bg ${className}`} />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded">
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
}
