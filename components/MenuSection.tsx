import React from 'react';
import { MenuSectionData, MenuItem } from '../types';
import MenuTitle from './MenuTitle';

interface MenuSectionProps {
  section: MenuSectionData;
  className?: string;
  onItemClick: (item: MenuItem, section: MenuSectionData) => void;
  compact?: boolean; // For chatbot display
}

const MenuSection: React.FC<MenuSectionProps> = ({
  section,
  className = '',
  onItemClick,
  compact = false,
}) => {
  return (
    <div className={`${compact ? 'mb-3' : 'mb-8'} break-inside-avoid ${className}`}>
      {!compact && (
        <div className="flex justify-center">
          <MenuTitle title={section.title} />
        </div>
      )}
      {compact && (
        <h3 className="text-center font-display font-bold text-base text-snip-orange mb-2">
          {section.title}
        </h3>
      )}

      <div
        className={`bg-white/60 backdrop-blur-sm rounded-lg ${compact ? 'p-2' : 'p-2 md:p-4'} shadow-sm border border-gray-200/50 relative overflow-hidden`}
      >
        {section.type === 'dual-price' && (
          <div className="flex justify-end mb-2 px-2 text-snip-black font-display font-bold text-sm md:text-base border-b border-gray-300 pb-1">
            <span className="w-16 text-center">PETIT</span>
            <span className="w-16 text-center">GRAND</span>
          </div>
        )}

        <ul className={compact ? 'space-y-1.5' : 'space-y-3'}>
          {section.items.map((item, index) => (
            <li
              key={index}
              onClick={() => onItemClick(item, section)}
              className={`group flex items-baseline justify-between border-b border-dashed border-gray-400 pb-1 last:border-0 cursor-pointer hover:bg-white/80 active:bg-snip-orange/10 active:scale-[0.98] transition-all duration-200 rounded px-1 -mx-1 ${compact ? 'py-0.5' : 'py-1'} select-none`}
            >
              <div className="flex items-center gap-2 flex-1">
                {/* Plus icon - visible for affordance */}
                <span
                  className={`text-snip-orange opacity-40 group-hover:opacity-100 transition-opacity font-bold ${compact ? 'text-base' : 'text-lg'}`}
                >
                  +
                </span>
                <span
                  className={`font-body font-bold ${compact ? 'text-sm' : 'text-lg md:text-xl'} text-snip-black uppercase pr-2 leading-none tracking-tight`}
                >
                  {item.name}
                </span>
              </div>

              {section.type === 'standard' && item.price && (
                <span
                  className={`font-display font-bold ${compact ? 'text-base' : 'text-xl md:text-2xl'} text-snip-orange whitespace-nowrap`}
                >
                  {item.price.toFixed(2)} <span className="text-xs text-gray-600">DH</span>
                </span>
              )}

              {section.type === 'dual-price' && item.prices && (
                <div className="flex gap-1 shrink-0">
                  <span
                    className={`${compact ? 'w-12' : 'w-16'} text-center font-display font-bold ${compact ? 'text-sm' : 'text-xl md:text-2xl'} text-snip-orange`}
                  >
                    {item.prices.small.toFixed(2)}{' '}
                    <span className="text-xs text-gray-600 hidden md:inline">DH</span>
                  </span>
                  <span
                    className={`${compact ? 'w-12' : 'w-16'} text-center font-display font-bold ${compact ? 'text-sm' : 'text-xl md:text-2xl'} text-snip-orange`}
                  >
                    {item.prices.large.toFixed(2)}{' '}
                    <span className="text-xs text-gray-600 hidden md:inline">DH</span>
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>

        {section.note && (
          <div className={`${compact ? 'mt-2' : 'mt-4'} text-center`}>
            <span
              className={`inline-block px-3 py-1 bg-snip-black text-snip-yellow font-display ${compact ? 'text-xs' : 'text-sm'} tracking-wider rounded-sm transform -rotate-1 shadow-md`}
            >
              {section.note}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MenuSection);
