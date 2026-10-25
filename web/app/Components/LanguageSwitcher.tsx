"use client";

import { LOCALES } from "../../lib/dictionaries";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale, dict } = useLanguage();

  return (  
    <div
      role="group"
      aria-label={dict.nav.language}
      className="inline-flex rounded-full bg-white/70 p-1 border border-pink-300 shadow-sm"
    >
      {LOCALES.map((l) => {
        const active = l.code === locale;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-pressed={active}
            title={l.label}
            lang={l.code === "ki" ? "quc" : l.code}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              active ? "bg-pink-600 text-white shadow" : "text-pink-700 hover:bg-pink-100"
            }`}
          >
            {l.short}
          </button>
        );
      })}
    </div>
  );
}
