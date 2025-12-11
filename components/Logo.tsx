import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="relative w-32 h-32 md:w-52 md:h-52 rounded-full shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-300 z-50 bg-transparent">
        <img 
          src="/logo.png" 
          alt="Snip Taste Logo"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if logo.png is not found
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/FFD700/1A1A1A?text=Snip+Taste';
          }}
        />
    </div>
  );
};

export default Logo;