import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-white rounded-full shadow-lg p-1 flex gap-1">
        <button
          onClick={() => setLanguage('fr')}
          className={`px-4 py-2 rounded-full font-display font-bold text-sm transition-all ${
            language === 'fr'
              ? 'bg-snip-orange text-white'
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
          }`}
          aria-label="Switch to French"
        >
          FR
        </button>
        <button
          onClick={() => setLanguage('ar')}
          className={`px-4 py-2 rounded-full font-display font-bold text-sm transition-all ${
            language === 'ar'
              ? 'bg-snip-orange text-white'
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
          }`}
          aria-label="Switch to Arabic"
        >
          AR
        </button>
      </div>
    </div>
  );
}
