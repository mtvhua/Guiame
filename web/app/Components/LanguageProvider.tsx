"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALES,
  getDictionary,
  type Dictionary,
  type Locale,
} from "../../lib/dictionaries";
import { syncIdiomaUsuario } from "../../lib/api";

const STORAGE_KEY = "guiame.locale";

type LanguageContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return LOCALES.some((l) => l.code === value);
}

// 1) idioma guardado por la usuaria, 2) idioma del navegador/dispositivo, 3) español.
function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    /* localStorage no disponible */
  }

  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const lang of preferred) {
    const base = lang.toLowerCase().split("-")[0];
    if (base === "es" || base === "en") return base;
    // "quc" es el código ISO 639-3 de K'iche'
    if (base === "ki" || base === "quc") return "ki";
  }
  return DEFAULT_LOCALE;
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  // Se renderiza en español en el servidor y se ajusta al montar (evita errores de hidratación).
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "ki" ? "quc" : locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignorar */
    }
    // Si hay sesión, guarda la preferencia en Usuario.id_idioma (no bloquea la UI).
    void syncIdiomaUsuario(next);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, dict: getDictionary(locale), setLocale }),
    [locale, setLocale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage debe usarse dentro de <LanguageProvider>");
  return ctx;
}
