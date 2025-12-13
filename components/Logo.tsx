import React, { useState, useRef } from 'react';

const Logo: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

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

  const handleClick = () => {
    // Play audio
    playAudio();

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
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
        src="/logo fire.gif"
        alt="Snip Taste Logo"
        className={`w-80 h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] object-contain transition-all ${
          isAnimating ? 'animate-pulse' : ''
        }`}
        style={{
          filter: 'drop-shadow(0 5px 15px rgba(255, 215, 0, 0.3))',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none',
        }}
        draggable={false}
      />
    </button>
  );
};

export default Logo;
