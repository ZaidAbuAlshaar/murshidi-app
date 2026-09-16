// Holds the current interface language and keeps <html lang/dir> in step with it.
// The context object and the `useLang` hook live in ./LangContext.ts so that this
// module exports a component and nothing else (see the note in that file).

import { useEffect, useState, type ReactNode } from 'react';
import { translations, type Lang, type TranslationKey } from './translations';
import { LangContext, LANG_STORAGE_KEY } from './LangContext';

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'ar';
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    return stored === 'en' ? 'en' : 'ar';
  });

  // Sync HTML attributes whenever language changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // localStorage may be unavailable
    }
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggleLang = () => setLangState((curr) => (curr === 'ar' ? 'en' : 'ar'));

  const t = (key: TranslationKey): string => {
    const dict = translations[lang];
    return (dict as Record<string, string>)[key]
      || (translations.ar as Record<string, string>)[key]
      || key;
  };

  const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, t, dir }}>
      {children}
    </LangContext.Provider>
  );
}
