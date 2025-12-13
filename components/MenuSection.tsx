import React from 'react';
import { MenuSectionData, MenuItem } from '../types';
import MenuTitle from './MenuTitle';

interface MenuSectionProps {
  section: MenuSectionData;
  className?: string;
  onItemClick: (item: MenuItem, section: MenuSectionData) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ section, className = '', onItemClick }) => {
  return (
    <div className={`mb-8 break-inside-avoid ${className}`}>
      <div className="flex justify-center">
        <MenuTitle title={section.title} />
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 md:p-4 shadow-sm border border-gray-200/50 relative overflow-hidden">
        {section.type === 'dual-price' && (
          <div className="flex justify-end mb-2 px-2 text-snip-black font-display font-bold text-sm md:text-base border-b border-gray-300 pb-1">
            <span className="w-16 text-center">PETIT</span>
            <span className="w-16 text-center">GRAND</span>
          </div>
        )}

        <ul className="space-y-3">
          {section.items.map((item, index) => (
            <li
              key={index}
              onClick={() => onItemClick(item, section)}
              className="group flex items-baseline justify-between border-b border-dashed border-gray-400 pb-1 last:border-0 cursor-pointer hover:bg-white/80 transition-colors rounded px-1 -mx-1 py-1"
            >
              <div className="flex items-center gap-2 flex-1">
                {/* Plus icon on hover */}
                <span className="text-snip-orange opacity-0 group-hover:opacity-100 transition-opacity font-bold text-lg">
                  +
                </span>
                <span className="font-body font-bold text-lg md:text-xl text-snip-black uppercase pr-2 leading-none tracking-tight">
                  {item.name}
                </span>
              </div>

              {section.type === 'standard' && item.price && (
                <span className="font-display font-bold text-xl md:text-2xl text-snip-orange whitespace-nowrap">
                  {item.price.toFixed(2)} <span className="text-sm text-gray-600">DH</span>
                </span>
              )}

              {section.type === 'dual-price' && item.prices && (
                <div className="flex gap-1 shrink-0">
                  <span className="w-16 text-center font-display font-bold text-xl md:text-2xl text-snip-orange">
                    {item.prices.small.toFixed(2)}{' '}
                    <span className="text-xs text-gray-600 hidden md:inline">DH</span>
                  </span>
                  <span className="w-16 text-center font-display font-bold text-xl md:text-2xl text-snip-orange">
                    {item.prices.large.toFixed(2)}{' '}
                    <span className="text-xs text-gray-600 hidden md:inline">DH</span>
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>

        {section.note && (
          <div className="mt-4 text-center">
            <span className="inline-block px-3 py-1 bg-snip-black text-snip-yellow font-display text-sm tracking-wider rounded-sm transform -rotate-1 shadow-md">
              {section.note}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuSection;
