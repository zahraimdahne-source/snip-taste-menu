import React, { useState, useRef, useEffect } from 'react';

const Logo: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  // Optimized: Use static logo for max performance (45MB -> 260KB)
  const [logoSrc, setLogoSrc] = useState('/logo.png');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Simplified logic - removed heavy snow/fire transitions for performance

  // Initialize audio on first user interaction
  const initializeAudio = () => {
    if (!audioInitialized && !audioRef.current) {
      try {
        audioRef.current = new Audio('/abdo.mp3');
        audioRef.current.volume = 0.7;
        audioRef.current.preload = 'auto';
        audioRef.current.load();
        setAudioInitialized(true);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    }
  };

  const playAudio = async () => {
    try {
      // Initialize audio if not already done
      initializeAudio();

      if (!audioRef.current) {
        // Create audio inline for immediate playback
        const audio = new Audio('/abdo.mp3');
        audio.volume = 0.7;
        await audio.play();
        return;
      }

      // Reset to start
      audioRef.current.currentTime = 0;

      // Play the audio
      await audioRef.current.play();
    } catch (error) {
      console.error('Audio playback error:', error);

      // Fallback: try creating a fresh audio instance
      try {
        const fallbackAudio = new Audio('/abdo.mp3');
        fallbackAudio.volume = 0.7;
        await fallbackAudio.play();
      } catch (fallbackError) {
        console.error('Fallback audio failed:', fallbackError);
      }
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    // Prevent default button behavior
    event.preventDefault();
    event.stopPropagation();

    // Play audio
    playAudio();

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className={`flex justify-center mb-2 cursor-pointer select-none transition-all duration-300 bg-transparent border-0 p-0 ${
          isAnimating ? 'scale-110' : 'hover:scale-105'
        }`}
        onClick={handleClick}
        aria-label="Play welcome message"
        style={{
          WebkitTapHighlightColor: 'transparent',
          outline: 'none',
        }}
      >
        <img
          src={logoSrc}
          alt="Snip Taste Logo"
          className={`w-80 h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] object-contain transition-all duration-500 ${
            isAnimating ? 'animate-pulse' : ''
          } ${isTransitioning ? 'opacity-0' : 'opacity-100'} ${!isLoaded ? 'opacity-0' : ''}`}
          style={{
            filter: 'drop-shadow(0 5px 15px rgba(255, 215, 0, 0.3))',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            pointerEvents: 'none',
          }}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          draggable={false}
        />
      </button>
    </div>
  );
};

export default Logo;
