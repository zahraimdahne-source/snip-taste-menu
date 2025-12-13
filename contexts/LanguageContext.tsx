import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../translations';
import { analytics } from '../utils/analytics';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load language preference from localStorage
    const stored = localStorage.getItem('sniptaste_language');
    return (stored === 'ar' || stored === 'fr' ? stored : 'fr') as Language;
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sniptaste_language', lang);
    analytics.trackLanguageChange(lang);
  };

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}
