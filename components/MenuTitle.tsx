import React from 'react';

interface MenuTitleProps {
  title: string;
}

const MenuTitle: React.FC<MenuTitleProps> = ({ title }) => {
  return (
    <div className="relative inline-block mb-6 px-4 py-1 z-10">
      <div className="brush-stroke" />
      <h2 className="relative text-3xl md:text-4xl font-display font-bold text-black uppercase tracking-wide text-center transform -rotate-2">
        {title}
      </h2>
    </div>
  );
};

export default MenuTitle;
