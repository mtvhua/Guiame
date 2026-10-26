"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageProvider";

/** Pestaña fija en el borde derecho: muestra el ícono y, al pasar el mouse (o enfocar con teclado), se despliega con el texto. */
export default function SideTab() {
  const { dict } = useLanguage();
  const pathname = usePathname();
  const activo = pathname.startsWith("/info-app");

  return (
    <Link
      href="/info-app"
      aria-label={dict.nav.app}
      aria-current={activo ? "page" : undefined}
      className={`group fixed right-0 top-[55%] z-40 flex -translate-y-1/2 items-center rounded-l-2xl bg-white py-2 pl-3 pr-2 shadow-[0_8px_30px_rgba(15,23,42,0.18)] ring-1 transition-all duration-300 hover:pl-4 hover:shadow-[0_8px_30px_rgba(15,23,42,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 ${
        activo ? "ring-rose-400" : "ring-stone-200"
      }`}
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold text-rose-800 transition-all duration-300 group-hover:max-w-[12rem] group-hover:pr-3 group-focus-visible:max-w-[12rem] group-focus-visible:pr-3">
        {dict.nav.app}
      </span>
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-700 text-lg font-bold text-white shadow-md ring-2 ring-white transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10"
      >
        i
      </span>
    </Link>
  );
}
