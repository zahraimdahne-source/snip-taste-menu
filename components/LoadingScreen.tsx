import React, { useState, useEffect } from 'react';
import { triggerCustomHaptic } from '../utils/haptics';

interface LoadingScreenProps {
  onLogoClick: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLogoClick }) => {
  const [logoSrc, setLogoSrc] = useState('/logo snow3.gif');
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // 30-Day Snow Season Feature (same as Logo component)
  useEffect(() => {
    const SNOW_SEASON_KEY = 'snipTasteSnowSeasonStart';
    const SNOW_DURATION_DAYS = 30;

    let snowSeasonStart = localStorage.getItem(SNOW_SEASON_KEY);

    if (!snowSeasonStart) {
      snowSeasonStart = new Date().toISOString();
      localStorage.setItem(SNOW_SEASON_KEY, snowSeasonStart);
    }

    const startDate = new Date(snowSeasonStart);
    const currentDate = new Date();
    const daysPassed = Math.floor(
      (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Determine which logo to show
    const targetLogo = daysPassed >= SNOW_DURATION_DAYS ? '/logo fire.gif' : '/logo snow3.gif';
    setLogoSrc(targetLogo);

    // Preload the GIF in the background
    const img = new Image();
    img.onload = () => {
      setIsLogoLoaded(true);
    };
    img.onerror = () => {
      setLogoError(true);
      setIsLogoLoaded(true); // Still show placeholder
    };
    img.src = targetLogo;
  }, []);
  return (
    <div className="loading-screen">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Righteous&family=Bungee&family=Reem+Kufi+Fun:wght@400;700&family=Bebas+Neue&family=Satisfy&display=swap');

          /* Force fonts to display immediately with fallbacks while loading */
          * {
            font-display: swap !important;
          }

          .loading-screen {
            position: fixed;
            inset: 0;
            background: url('/BG SNIP.jpg') center center / cover no-repeat;
            background-color: #FFFFFF;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }

          .loading-text-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            justify-content: center;
            align-items: center;
            font-family: 'Bungee', Impact, 'Arial Black', sans-serif;
            font-size: 52px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 3px;
            padding: 0 20px;
            max-width: 100%;
            min-height: 200px;
          }

          .loading-text-line {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
            align-items: center;
          }

          .loading-word {
            display: inline-block;
            color: #1A1A1A;
            position: relative;
            /* CRITICAL: Ensure text is ALWAYS visible */
            opacity: 1 !important;
            visibility: visible !important;
            min-width: fit-content;

            /* UNIFIED CREATIVE FONT */
            font-family: 'Bungee', Impact, 'Arial Black', sans-serif;
            font-size: 65px;
            font-weight: 900;

            /* Gradient text effect - Matching logo colors (Gold/Yellow/Orange) */
            background: linear-gradient(135deg, #FFD700, #FFA500, #FF8C00, #FFD700);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;

            /* Animated gradient */
            animation:
              waveIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) both,
              gradientShift 4s ease infinite,
              textPulse 2s ease-in-out infinite;
          }

          /* Wave entrance animation */
          @keyframes waveIn {
            0% {
              opacity: 0;
              transform: translateY(30px) scale(0.8) rotate(-5deg);
            }
            60% {
              transform: translateY(-10px) scale(1.1) rotate(2deg);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1) rotate(0deg);
            }
          }

          /* Gradient color shift - Logo-matching colors */
          @keyframes gradientShift {
            0%, 100% {
              background-position: 0% 50%;
              filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4));
            }
            50% {
              background-position: 100% 50%;
              filter: drop-shadow(0 6px 12px rgba(255, 165, 0, 0.5));
            }
          }

          /* Subtle pulse */
          @keyframes textPulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          /* Stagger animation delays for wave effect */
          .loading-word:nth-child(1) { animation-delay: 0s, 0s, 0s; }
          .loading-word:nth-child(2) { animation-delay: 0.1s, 0.3s, 0.2s; }
          .loading-word:nth-child(3) { animation-delay: 0.2s, 0.6s, 0.4s; }
          .loading-word:nth-child(4) { animation-delay: 0.3s, 0.9s, 0.6s; }
          .loading-word:nth-child(5) { animation-delay: 0.4s, 1.2s, 0.8s; }
          .loading-word:nth-child(6) { animation-delay: 0.5s, 1.5s, 1s; }
          .loading-word:nth-child(7) { animation-delay: 0.6s, 1.8s, 1.2s; }

          /* Remove old individual styles - keeping for backwards compatibility but overridden */
          .loading-word.snip,
          .loading-word.jak,
          .loading-word.ysakket,
          .loading-word.jooooo3 {
            /* All unified now - these classes kept for HTML structure */
          }

          /* Remove old underlines and circles */
          .loading-word.jak::before,
          .loading-word.jak::after {
            display: none;
          }

          /* Remove circle effects */
          .loading-word.jooooo3::before,
          .loading-word.jooooo3::after {
            display: none;
          }

          /* Modern ring appear animation */
          @keyframes modernRingAppear {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.5);
            }
            100% {
              opacity: 0.7;
              transform: translate(-50%, -50%) scale(1);
            }
          }

          /* Rotating ring animation */
          @keyframes rotateRing {
            0% {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }

          /* Counter-rotating ring */
          @keyframes rotateRingReverse {
            0% {
              transform: translate(-50%, -50%) rotate(45deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(-315deg);
            }
          }

          /* Pulsing glow effect */
          @keyframes pulseGlow {
            0%, 100% {
              opacity: 0.6;
              filter: blur(8px) drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
            }
            50% {
              opacity: 0.9;
              filter: blur(12px) drop-shadow(0 0 30px rgba(255, 107, 53, 0.8));
            }
          }

          /* Neon pulse */
          @keyframes neonPulse {
            0%, 100% {
              opacity: 0.5;
              filter: blur(6px) drop-shadow(0 0 15px rgba(255, 0, 0, 0.6));
            }
            50% {
              opacity: 0.8;
              filter: blur(10px) drop-shadow(0 0 25px rgba(255, 215, 0, 0.9));
            }
          }

          .loading-word:nth-child(1) { animation-delay: 0s; }
          .loading-word:nth-child(2) { animation-delay: 0.1s; }
          .loading-word:nth-child(3) { animation-delay: 0.2s; }
          .loading-word:nth-child(4) { animation-delay: 0.3s; }
          .loading-word:nth-child(5) { animation-delay: 0.4s; }
          .loading-word:nth-child(6) { animation-delay: 0.5s; }
          .loading-word:nth-child(7) { animation-delay: 0.6s; }

          @keyframes bounceIn {
            0% {
              transform: scale(0) rotate(-180deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.2) rotate(10deg);
            }
            100% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
          }

            /* Optimized Animations */
            .clickable-logo-container {
              margin-top: 60px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 15px;
              cursor: pointer;
              /* Removed 1s delay, faster entrance */
              animation: fadeInUp 0.6s ease-out 0.2s backwards;
              will-change: transform, opacity;
            }

            .clickable-logo {
              width: 450px;
              height: 450px;
              transition: transform 0.2s ease;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              background: transparent;
              /* Faster drop animation */
              animation: dropFromTop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              will-change: transform;
            }

            .clickable-logo:hover {
              transform: scale(1.05);
            }

            .clickable-logo img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: opacity 0.3s ease;
              /* Static shadow is better for performance than animating drop-shadow */
              filter: drop-shadow(-8px 8px 16px rgba(0, 0, 0, 0.2));
            }

            /* Loading state - Removed heavy blur that kills iOS performance */
            .clickable-logo img.loading {
              opacity: 0.8;
              /* Removed animation: logoPulseLoading - causes repaints */
            }

            /* Loaded state */
            .clickable-logo img.loaded {
              opacity: 1;
            }

            /* Error state */
            .clickable-logo img.error {
              opacity: 0.9;
            }

            /* Loading spinner overlay - Simplified */
            .logo-loading-spinner {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 50px;
              height: 50px;
              border: 3px solid rgba(255, 215, 0, 0.3);
              border-top: 3px solid #FFD700;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
              pointer-events: none;
            }

            @keyframes spin {
              from { transform: translate(-50%, -50%) rotate(0deg); }
              to { transform: translate(-50%, -50%) rotate(360deg); }
            }

            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            /* Optimized Drop Animation */
            @keyframes dropFromTop {
              0% {
                opacity: 0;
                transform: translateY(-50vh) scale(0.8);
              }
              70% {
                opacity: 1;
                transform: translateY(10px) scale(1.02);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            /* SKAT JOO3 Text with simpler shadow for performance */
            .click-text {
              font-family: 'Bungee', Impact, 'Arial Black', sans-serif;
              font-size: 42px;
              font-weight: 900;
              color: #FFFFFF;
              text-align: center;
              letter-spacing: 3px;
              margin-top: 20px;
              text-shadow:
                -2px 2px 0px rgba(0,0,0,0.3),
                -4px 4px 0px rgba(0,0,0,0.2);
              will-change: transform;
              animation: bounceText 2s infinite ease-in-out;
            }

            @keyframes bounceText {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }

          /* Responsive */
          @media (max-width: 768px) {
            .loading-text-container {
              font-size: 32px;
              gap: 8px;
              max-width: 95%;
            }

            .loading-word.jak {
              font-size: 32px;
            }

            .loading-word.snip {
              font-size: 48px;
            }

            .loading-word.ysakket {
              font-size: 32px;
            }

            .loading-word.jooooo3 {
              font-size: 32px;
            }

            .clickable-logo {
              width: 350px;
              height: 350px;
            }

            .click-text {
              font-size: 36px;
            }
          }

          @media (max-width: 480px) {
            .loading-text-container {
              font-size: 24px;
              gap: 6px;
              letter-spacing: 1px;
              max-width: 98%;
            }

            .loading-word.jak {
              font-size: 24px;
            }

            .loading-word.snip {
              font-size: 38px;
            }

            .loading-word.ysakket {
              font-size: 24px;
            }

            .loading-word.jooooo3 {
              font-size: 24px;
            }

            .clickable-logo {
              width: 300px;
              height: 300px;
            }

            .click-text {
              font-size: 32px;
            }
          }
        `}
      </style>

      <div
        className="clickable-logo-container"
        onClick={() => {
          // Celebration vibration when entering the app!
          triggerCustomHaptic([20, 100, 20, 100, 40]); // Welcome celebration!
          onLogoClick();
        }}
      >
        <div className="clickable-logo">
          {/* Always show PNG placeholder first, then overlay with GIF when loaded */}
          <img
            src={logoError ? '/logo.png' : isLogoLoaded ? logoSrc : '/logo.png'}
            alt="Snip Taste Logo"
            className={logoError ? 'error' : isLogoLoaded ? 'loaded' : 'loading'}
          />
          {/* Show loading spinner while GIF is loading */}
          {!isLogoLoaded && !logoError && <div className="logo-loading-spinner"></div>}
        </div>
        <div className="click-text">SKAT JOO3</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
