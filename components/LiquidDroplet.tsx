import React from 'react';
import './LiquidDroplet.css';

interface LiquidDropletProps {
  text?: string;
  onClick?: () => void;
}

const LiquidDroplet: React.FC<LiquidDropletProps> = ({ text = 'LIQUID', onClick }) => {
  return (
    <div className="liquid-container" onClick={onClick}>
      <button className="liquid-button">
        {text}
        <div className="drop"></div>
      </button>

      {/* SVG Filter for the Gooey Effect */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>
    </div>
  );
};

export default LiquidDroplet;
