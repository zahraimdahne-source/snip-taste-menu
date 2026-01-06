import React from 'react';

export interface ProductItem {
  name: string;
  price?: number;
  price_small?: number;
  price_large?: number;
  category: string;
  image?: string;
}

interface ChatProductCarouselProps {
  items: ProductItem[];
  onSelect: (item: ProductItem) => void;
}

export const ChatProductCarousel: React.FC<ChatProductCarouselProps> = ({ items, onSelect }) => {
  // Helper to get a gradient or image based on category
  const getCategoryImage = (category: string) => {
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('pizza')) return '🍕';
    if (lowerCat.includes('tacos')) return '🌮';
    if (lowerCat.includes('burger')) return '🍔';
    if (lowerCat.includes('jus') || lowerCat.includes('boisson')) return '🍹';
    if (lowerCat.includes('salade')) return '🥗';
    if (lowerCat.includes('pates') || lowerCat.includes('pasta')) return '🍝';
    return '🍽️';
  };

  const getGradient = (category: string) => {
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('pizza')) return 'from-orange-400 to-red-500';
    if (lowerCat.includes('tacos')) return 'from-yellow-400 to-orange-500';
    if (lowerCat.includes('burger')) return 'from-red-500 to-red-700';
    if (lowerCat.includes('jus')) return 'from-green-400 to-green-600';
    return 'from-blue-400 to-purple-500';
  };

  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 -mx-4 px-4 scrollbar-hide">
      <div className="flex gap-4 min-w-max">
        {items.map((item, index) => (
          <div
            key={index}
            className="w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:scale-105 transition-transform duration-200 snap-center"
          >
            {/* Image Area */}
            <div
              className={`h-24 w-full bg-gradient-to-br ${getGradient(
                item.category
              )} flex items-center justify-center text-4xl shadow-inner relative group`}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              <span className="drop-shadow-lg transform group-hover:scale-125 transition-transform duration-300">
                {getCategoryImage(item.category)}
              </span>

              {/* Shine effect */}
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-spine-slow"></div>
            </div>

            {/* Content Area */}
            <div className="p-3 flex flex-col flex-1 justify-between bg-white/80 backdrop-blur-sm">
              <div>
                <h4 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 min-h-[2.5em]">
                  {item.name}
                </h4>
                <p className="text-xs text-orange-600 font-bold mt-1">
                  {item.price ? `${item.price} DH` : `${item.price_small} - ${item.price_large} DH`}
                </p>
              </div>

              <button
                onClick={() => onSelect(item)}
                className="mt-3 w-full py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1 hover:shadow-orange-500/30"
              >
                <span>Commander</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
