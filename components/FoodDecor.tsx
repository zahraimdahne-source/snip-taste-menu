import React from 'react';

export const PizzaDecor: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative rounded-full overflow-hidden shadow-2xl border-4 border-white ${className}`}>
    <img 
      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
      alt="Delicious Pizza" 
      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
    />
  </div>
);

export const BurgerDecor: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative rounded-full overflow-hidden shadow-2xl border-4 border-white ${className}`}>
    <img 
      src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
      alt="Juicy Burger" 
      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
    />
  </div>
);

export const SaladDecor: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative rounded-full overflow-hidden shadow-2xl border-4 border-white ${className}`}>
    <img 
      src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
      alt="Fresh Salad" 
      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
    />
  </div>
);

export const TacoDecor: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative rounded-full overflow-hidden shadow-2xl border-4 border-white ${className}`}>
    <img 
      src="https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
      alt="Tacos" 
      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
    />
  </div>
);
