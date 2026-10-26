"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import LanguageMenu, { type LanguageOption } from "./LanguageMenu";
import SideTab from "./SideTab";

// Idiomas disponibles en la lista del navbar
const LANGUAGES: LanguageOption[] = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "ki", label: "K'iche'" },
];

export default function Navbar() {
  const { dict, locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // "Info app" ya no va aquí: ahora es la pestaña lateral (SideTab)
  const items = [
    { href: "/", label: dict.nav.home },
    { href: "/Reporte", label: dict.nav.report },
    { href: "/perfil", label: dict.nav.profile },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* Navbar fijo */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-stone-200 bg-pink-100 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Logo Guíame" width={36} height={36} className="rounded-md" priority />
            <span className="text-xl font-semibold tracking-tight text-rose-800">Guíame</span>
          </Link>

          {/* Escritorio */}
          <div className="hidden items-center gap-6 md:flex">
            <ul className="flex items-center gap-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-rose-700"
                        : "text-slate-600 hover:bg-stone-100 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-rose-700" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageMenu value={locale} onChange={setLocale} options={LANGUAGES} className="w-36" />
          </div>

          {/* Móvil */}
          <button
            type="button"
            className="rounded-md p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label={dict.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </nav>

        {open && (
          <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`block rounded-md px-3 py-2 text-sm font-medium ${
                      isActive(item.href)
                        ? "bg-rose-50 text-rose-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <LanguageMenu value={locale} onChange={setLocale} options={LANGUAGES} />
            </div>
          </div>
        )}
      </header>

      {/* Espaciador para que el contenido no quede debajo del navbar fijo */}
      <div aria-hidden="true" className="h-16" />

      {/* Pestaña lateral de "Info app" */}
      <SideTab />
    </>
  );
}
