import React from 'react';
import './HangingLights.css';

const HangingLights: React.FC = () => {
  // Gold Palette for that "Liquid Gold" look
  const GOLD_PALETTE = {
    on: '#FFD700', // Gold
    off: '#3e2723', // Dark Brown/Smoked Glass
  };

  return (
    <div className="hanging-lights-stage" role="img">
      <svg
        className="hanging-lights-svg"
        viewBox="0 0 1200 360"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="false"
        role="img"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="wireGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#1f2326"></stop>
            <stop offset="50%" stopColor="#2f3438"></stop>
            <stop offset="100%" stopColor="#16181a"></stop>
          </linearGradient>

          <linearGradient id="wireStripe" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.03)"></stop>
            <stop offset="50%" stopColor="rgba(255,255,255,0.06)"></stop>
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)"></stop>
          </linearGradient>

          {/* Golden Glow for the bulb center */}
          <radialGradient id="bulbGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fff8e1" stopOpacity="0.95"></stop>
            <stop offset="45%" stopColor="#ffecb3" stopOpacity="0.5"></stop>
            <stop offset="100%" stopColor="#ff6f00" stopOpacity="0"></stop>
          </radialGradient>

          {/* Liquid Glass Effect Gradient */}
          <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)"></stop>
            <stop offset="30%" stopColor="rgba(255,255,255,0.3)"></stop>
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)"></stop>
          </linearGradient>

          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="10"
              floodColor="#000"
              floodOpacity="0.55"
            ></feDropShadow>
          </filter>

          <filter id="glowBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur"></feGaussianBlur>
            <feMerge>
              <feMergeNode in="blur"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
        </defs>

        {/* Back Spot Lights - Warm Ambient */}
        <g transform="translate(600,160)">
          <ellipse className="back-spot" rx="500" ry="100" fill="#ffca28"></ellipse>
        </g>

        {/* Wire Structure */}
        <g className="wire-wrap">
          <path
            d="M-50 90 C 160 30, 340 150, 480 90 S 740 40, 1250 95"
            className="wire-base wire-shadow"
            stroke="black"
            strokeWidth="22"
            strokeLinecap="round"
            fill="none"
            opacity="0.18"
          ></path>

          <path
            d="M-50 80 C 160 20, 340 140, 480 80 S 740 30, 1250 85"
            className="wire-base"
            stroke="url(#wireGrad)"
          ></path>

          <path
            d="M-54 78 C 160 18, 340 138, 480 78 S 740 28, 1250 83"
            stroke="url(#wireStripe)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          ></path>

          <path
            d="M-50 84 C 160 24, 340 144, 480 84 S 740 34, 1250 89"
            stroke="#0c1114"
            strokeWidth="2"
            fill="none"
            opacity="0.9"
          ></path>
        </g>

        {/*
           LAMPS - All Gold, "Liquid" Glass Look
           Using the user's requested template structure but converted to React loop/components
        */}
        {[
          { x: 100, y: 105, dur: '3.2s', delay: '0s', h: 36 },
          { x: 240, y: 143, dur: '2.8s', delay: '0.3s', h: 60 },
          { x: 380, y: 127, dur: '3.5s', delay: '0.7s', h: 24 },
          { x: 540, y: 108, dur: '3.0s', delay: '0.2s', h: 44 },
          { x: 700, y: 63, dur: '3.1s', delay: '0.5s', h: 18 },
          { x: 860, y: 110, dur: '2.9s', delay: '0.9s', h: 56 },
          { x: 1040, y: 104, dur: '2.7s', delay: '0.4s', h: 28 },
        ].map((lamp, i) => (
          <g key={i} className="lamp" transform={`translate(${lamp.x},${lamp.y})`}>
            <g className="bulb bulb-base" transform="translate(0,34) scale(1)">
              {/* The Liquid Glass Bulb */}
              <ellipse
                className="glass"
                cx="0"
                cy="-6"
                rx="28"
                ry="36"
                style={
                  {
                    '--on': GOLD_PALETTE.on,
                    '--off': GOLD_PALETTE.off,
                    '--dur': lamp.dur,
                    '--delay': lamp.delay,
                    fill: 'var(--off)',
                  } as React.CSSProperties
                }
              ></ellipse>
              {/* Inner Glow */}
              <ellipse
                cx="0"
                cy="-8"
                rx="20"
                ry="28"
                fill="url(#bulbGlow)"
                className="glow"
              ></ellipse>
            </g>
            {/* Hanger and Socket */}
            <line
              className="hanger"
              x1="0"
              y1={-lamp.h}
              x2="0"
              y2="-6"
              stroke="#0f1214"
              strokeWidth="4"
              strokeLinecap="round"
            ></line>
            <rect className="socket" x="-22" y="-14" width="44" height="18" rx="4"></rect>
          </g>
        ))}

        {/* Floor Shadows */}
        <g transform="translate(0,0)" opacity="0.45">
          {[100, 240, 380, 540, 700, 860, 1040].map((x, i) => (
            <ellipse
              key={i}
              cx={x}
              cy={220 + (i % 2) * 20}
              rx="40"
              ry="10"
              fill="#000"
              opacity="0.15"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default HangingLights;
