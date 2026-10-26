"use client";

import Link from "next/link";
import Navbar from "../Components/Navbar";
import { useLanguage } from "../Components/LanguageProvider";

// Íconos de línea (uno por función, en el mismo orden que dict.appInfo.features)
const svgProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const FEATURE_ICONS = [
  // brújula
  <svg key="compass" {...svgProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
  </svg>,
  // campana
  <svg key="bell" {...svgProps}>
    <path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8" />
    <path d="M10.3 20a2 2 0 003.4 0" />
  </svg>,
  // portapapeles
  <svg key="clipboard" {...svgProps}>
    <rect x="6" y="4" width="12" height="17" rx="2" />
    <path d="M9 4h6v3H9zM9 12h6M9 16h4" />
  </svg>,
  // globo
  <svg key="globe" {...svgProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
  </svg>,
];

function Check() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-pink-600"
    >
      <path d="M5 12l4 4 10-10" />
    </svg>
  );
}

function Titulo({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{children}</h2>
  );
}

export default function InfoApp() {
  const { dict } = useLanguage();
  const a = dict.appInfo;

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <Navbar />

      {/* HERO */}
      <header className="border-b border-pink-100 bg-pink-50/60">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">{a.badge}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">{a.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">{a.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-md bg-pink-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
            >
              {a.ctaWeb}
            </Link>
            <Link
              href="/Reporte"
              className="rounded-md border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              {a.ctaApp}
            </Link>
          </div>
        </div>
      </header>

      {/* FUNCIONES */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Titulo>{a.featuresTitle}</Titulo>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {a.features.map((f, i) => (
              <div
                key={f.t}
                className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-pink-200"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                  {FEATURE_ICONS[i % FEATURE_ICONS.length]}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Titulo>{a.howTitle}</Titulo>
          <ol className="mt-10 grid overflow-hidden rounded-xl border border-slate-200 bg-white md:grid-cols-3 md:divide-x md:divide-slate-200">
            {a.steps.map((s, i) => (
              <li key={s.t} className="border-b border-slate-200 p-6 last:border-b-0 md:border-b-0">
                <span className="text-sm font-semibold text-pink-600">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-semibold text-slate-900">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PLATAFORMAS */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Titulo>{a.platformsTitle}</Titulo>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 border-t-4 border-t-pink-600 bg-white p-8">
              <h3 className="text-xl font-semibold text-slate-900">{a.web.title}</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                {a.web.items.map((it) => (
                  <li key={it} className="flex gap-3">
                    <Check />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 border-t-4 border-t-slate-700 bg-white p-8">
              <h3 className="text-xl font-semibold text-slate-900">{a.app.title}</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                {a.app.items.map((it) => (
                  <li key={it} className="flex gap-3">
                    <Check />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* IDIOMAS */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{a.languagesTitle}</h2>
          <p className="mt-3 leading-relaxed text-slate-600">{a.languagesText}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Español", "English", "K'iche'"].map((l) => (
              <span
                key={l}
                className="rounded-md border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* AVISO */}
      <div className="mx-auto max-w-4xl px-6 py-10">
        <p className="rounded-lg bg-slate-100 px-5 py-4 text-center text-xs leading-relaxed text-slate-600">
          {a.disclaimer}
        </p>
      </div>
    </main>
  );
}
