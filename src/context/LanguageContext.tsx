import React, { createContext, useContext, useState, useCallback } from 'react';
import { Lang, Translations, translations } from '../i18n/translations';

const STORAGE_KEY = 'bali_lang_v1';

function readLang(): Lang {
  try {
    const v = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (v === 'ko' || v === 'en' || v === 'id' || v === 'uk' || v === 'es') return v;
  } catch {}
  return 'ko';
}

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ko',
  setLang: () => {},
  t: translations.ko,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
