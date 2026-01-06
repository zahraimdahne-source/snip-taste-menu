import React, { useState, useRef } from 'react';
import './LiquidLogo.css';

const LiquidLogo: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/abdo.mp3');
        audioRef.current.volume = 0.7;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.error(e));
    } catch (e) {
      console.error('Audio error', e);
    }
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 50,
        width: '400px', // Maintain dimensions
        height: '400px',
      }}
      onClick={handleClick}
    >
      {/* Sharp Logo Overlay */}
      <img
        src="/logo.png"
        alt="Snip Taste Logo"
        className={`logo-image-overlay transition-transform duration-300 ${isAnimating ? 'scale-110' : 'hover:scale-105'}`}
      />
    </div>
  );
};

export default LiquidLogo;
