import { createContext, useContext, useState, useEffect } from 'react';
import en from '../translations/en.js';
import ar from '../translations/ar.js';

const DICTS = { en, ar };
const KEY = 'wasteless:lang';
const Ctx = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(KEY) || 'en');
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem(KEY, lang);
  }, [lang, dir]);

  const t = (key) => DICTS[lang]?.[key] ?? DICTS.en[key] ?? key;
  const toggleLang = () => setLang(l => l === 'en' ? 'ar' : 'en');

  return <Ctx.Provider value={{ lang, dir, t, toggleLang }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
