import React from 'react';
import './LiquidBackground.css';

const LiquidBackground = () => {
  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none opacity-20 overflow-hidden">
      {/* Container for the liquid effect */}
      <div className="water-toggle">
        <input type="checkbox" id="toggle-wave" defaultChecked />
        <div className="container">
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <filter id="water-rotate">
              <feTurbulence
                result="turbulence"
                seed="2"
                numOctaves="2"
                baseFrequency="0.0075 0.0075"
                type="turbulence"
              ></feTurbulence>
              <feComponentTransfer>
                <feFuncR type="table">
                  <animateTransform
                    repeatCount="indefinite"
                    dur="10s"
                    values="0.01;0.02;0.01"
                    attributeName="transform"
                  ></animateTransform>
                </feFuncR>
              </feComponentTransfer>
              <feDisplacementMap
                yChannelSelector="G"
                xChannelSelector="R"
                scale="17.5"
                in2="turbulence"
                in="SourceGraphic"
              ></feDisplacementMap>
            </filter>
            <filter id="still-water">
              <feTurbulence
                result="turbulence"
                seed="2"
                numOctaves="2"
                baseFrequency="0.0075 0.0075"
                type="turbulence"
              ></feTurbulence>
              <feComponentTransfer>
                <feFuncR type="table">
                  <animateTransform
                    repeatCount="indefinite"
                    dur="10s"
                    values="0.01;0.02;0.01"
                    attributeName="transform"
                  ></animateTransform>
                </feFuncR>
              </feComponentTransfer>
              <feDisplacementMap
                yChannelSelector="G"
                xChannelSelector="R"
                scale="12.5"
                in2="turbulence"
                in="SourceGraphic"
              ></feDisplacementMap>
            </filter>
          </svg>

          {/* Main Viscous Liquid Blobs */}
          <div className="liquid-blob blob-1"></div>
          <div className="liquid-blob blob-2"></div>
          <div className="liquid-blob blob-3"></div>
        </div>
      </div>
    </div>
  );
};

export default LiquidBackground;
