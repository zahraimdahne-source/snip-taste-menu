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

          {/* Realistic Gold Filament Gradient */}
          <linearGradient id="filamentGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffecb3"></stop>
            <stop offset="50%" stopColor="#ffca28"></stop>
            <stop offset="100%" stopColor="#ff6f00"></stop>
          </linearGradient>

          {/* Glass Reflection Gradient - Crisp and Clear */}
          <linearGradient
            id="glassSheen"
            x1="0"
            x2="1"
            y1="0"
            y2="1"
            gradientTransform="rotate(45)"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)"></stop>
            <stop offset="30%" stopColor="rgba(255,255,255,0.1)"></stop>
            <stop offset="50%" stopColor="rgba(255,255,255,0)"></stop>
            <stop offset="70%" stopColor="rgba(255,255,255,0.1)"></stop>
            <stop offset="100%" stopColor="rgba(255,255,255,0.4)"></stop>
          </linearGradient>
        </defs>

        {/* Wire Structure - Shadows Removed */}
        <g className="wire-wrap">
          <path
            d="M-50 80 C 160 20, 340 140, 480 80 S 740 30, 1250 85"
            className="wire-base"
            stroke="url(#wireGrad)"
            strokeWidth="4" /* Thinner, cleaner wire */
            fill="none"
            strokeLinecap="round"
          ></path>
        </g>

        {/*
           LAMPS - "Liquid Glass" Realism
           No shadows, glass refraction, filament visible
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
            {/* The Bulb Group */}
            <g className="bulb-group" transform="translate(0,34)">
              {/* 1. The Filament (Inside) - Simple Curve */}
              <path
                d="M-6 -6 Q 0 6 6 -6"
                stroke="url(#filamentGrad)"
                strokeWidth="2"
                fill="none"
                className="filament"
                opacity="1"
              />

              {/* 2. The Main Liquid Bulb Body - ROBUST ELLIPSE */}
              <ellipse
                className="glass-body"
                cx="0"
                cy="0"
                rx="22"
                ry="30"
                fill="url(#glassSheen)"
                stroke="rgba(255,215,0,0.4)"
                strokeWidth="1.5"
                style={
                  {
                    '--on': GOLD_PALETTE.on,
                    '--off': GOLD_PALETTE.off,
                    '--dur': lamp.dur,
                    '--delay': lamp.delay,
                  } as React.CSSProperties
                }
              />

              {/* 3. Specular Highlight (The "Wet" Look) */}
              <ellipse
                cx="8"
                cy="-8"
                rx="5"
                ry="10"
                transform="rotate(-20)"
                fill="rgba(255,255,255,0.8)"
                filter="blur(0.5px)"
              />

              <circle cx="-6" cy="12" r="2.5" fill="rgba(255,255,255,0.6)" filter="blur(1px)" />
            </g>

            {/* Hanger and Socket - Simple Line and Rect */}
            <line
              className="hanger"
              x1="0"
              y1={-lamp.h}
              x2="0"
              y2="-24" /* Connects to top of socket */
              stroke="#1a1a1a"
              strokeWidth="2"
            ></line>

            {/* Socket Cap - Simple Rect */}
            <rect x="-12" y="-28" width="24" height="12" rx="2" fill="#222" />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default HangingLights;
