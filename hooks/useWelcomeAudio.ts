import { useEffect, useState } from 'react';

const WELCOME_PLAYED_KEY = 'snip_welcome_played';

export const useWelcomeAudio = () => {
  // Initialize from sessionStorage
  const [hasPlayed, setHasPlayed] = useState(() => {
    return sessionStorage.getItem(WELCOME_PLAYED_KEY) === 'true';
  });

  useEffect(() => {
    if (hasPlayed) return;

    const playWelcomeAudio = () => {
      if (hasPlayed) return;

      try {
        // Create audio element with your MP3 file
        const audio = new Audio('/welcome.mp3.mp3');
        audio.volume = 0.7; // 70% volume

        // Play the audio
        audio.play().catch((error) => {
          console.log('Audio autoplay prevented:', error);
        });

        // Mark as played
        sessionStorage.setItem(WELCOME_PLAYED_KEY, 'true');
        setHasPlayed(true);

        // Remove listener after playing
        document.removeEventListener('click', playWelcomeAudio);
      } catch (error) {
        console.error('Failed to play welcome audio:', error);
      }
    };

    // Play on first click
    document.addEventListener('click', playWelcomeAudio, { once: true });

    return () => {
      document.removeEventListener('click', playWelcomeAudio);
    };
  }, [hasPlayed]);

  return { hasPlayed };
};
