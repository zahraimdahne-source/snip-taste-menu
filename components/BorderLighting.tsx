import React from 'react';
import './BorderLighting.css';

const BorderLighting = () => {
  return (
    <>
      {/* Magic Moving Border */}
      <div className="gold-border-wrapper">
        <div className="gold-glow-spinner"></div>
      </div>

      {/* Traveling Logo that follows the border */}
      <div className="fixed inset-0 pointer-events-none z-[102]">
        <div className="logo-traveler"></div>
      </div>

      {/* Static Inner Border for definition (Optional, keeps it looking "edged") */}
      <div
        className="fixed inset-0 pointer-events-none z-[100]"
        style={{
          boxShadow: 'inset 0 0 20px rgba(255, 215, 0, 0.2)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
        }}
      ></div>
    </>
  );
};

export default BorderLighting;
