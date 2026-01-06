import React, { useRef, useState, useCallback } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number; // Maximum rotation in degrees
  scale?: number; // Scale on hover
  perspective?: number; // Perspective depth
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxRotation = 10, // Subtle per default
  scale = 1.02,
  perspective = 1000,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Throttling could be added here for performance, but React state is usually fast enough for simple transforms
  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Calculate rotation
      // Center of the card is (0,0) for calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Normalize mouse position (-1 to 1)
      const normalizedX = (x - centerX) / centerX;
      const normalizedY = (y - centerY) / centerY;

      // Calculate rotation (inverted logic for natural feel)
      const rotateX = normalizedY * -maxRotation; // Up/Down tilt
      const rotateY = normalizedX * maxRotation; // Left/Right tilt

      setRotation({ x: rotateX, y: rotateY });

      // Calculate Glare Position (follows mouse)
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePosition({ x: glareX, y: glareY });
    },
    [maxRotation]
  );

  const onMouseMove = (e: React.MouseEvent) => {
    setIsHovered(true);
    handleMove(e.clientX, e.clientY);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
    // Smoothly return to center
    setRotation({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    // For mobile, we just track the first finger
    const touch = e.touches[0];
    setIsHovered(true);
    handleMove(touch.clientX, touch.clientY);
  };

  const onTouchEnd = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const style: React.CSSProperties = {
    transform: isHovered
      ? `perspective(${perspective}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`
      : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
    transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
    willChange: 'transform',
    transformStyle: 'preserve-3d',
  };

  const shadowStyle: React.CSSProperties = {
    position: 'absolute',
    inset: '5%',
    background: 'linear-gradient(135deg, rgba(255, 102, 0, 0.4) 0%, rgba(255, 204, 0, 0.2) 100%)',
    transform: isHovered
      ? `translateY(20px) scale(0.9) blur(20px)`
      : `translateY(5px) scale(0.95) blur(10px)`,
    opacity: isHovered ? 0.8 : 0,
    transition: 'all 0.4s ease-out',
    zIndex: -1,
    borderRadius: '20px',
  };

  const glareStyle: React.CSSProperties = {
    background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`,
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    zIndex: 10,
    mixBlendMode: 'overlay',
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchStart={(e) => {
        setIsHovered(true);
      }}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        perspective: `${perspective}px`,
      }}
    >
      {/* Smart Ambient Shadow */}
      <div style={shadowStyle} />

      <div ref={cardRef} style={style} className="w-full h-full relative font-sans">
        {children}
        {/* Glare Effect Overlay */}
        <div style={glareStyle} />
      </div>
    </div>
  );
};

export default TiltCard;
