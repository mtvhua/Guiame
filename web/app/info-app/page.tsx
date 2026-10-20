"use client";

import Link from "next/link";
import Navbar from "../Components/Navbar";
import { useLanguage } from "../Components/LanguageProvider";

const FEATURE_ICONS = ["🧭", "🔔", "📋", "🌎"];

export default function InfoApp() {
  const { dict } = useLanguage();
  const a = dict.appInfo;

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white text-gray-800">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* HERO */}
        <header className="text-center mb-20">
          <span className="inline-block rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-widest px-4 py-1 mb-5">
            {a.badge}
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-pink-700 mb-5">{a.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">{a.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-pink-600 text-white font-semibold px-6 py-3 shadow hover:bg-pink-700 transition"
            >
              {a.ctaWeb}
            </Link>
            <Link
              href="/reporte"
              className="rounded-full bg-white text-pink-700 font-semibold px-6 py-3 border border-pink-300 hover:bg-pink-50 transition"
            >
              {a.ctaApp}
            </Link>
          </div>
        </header>

        {/* FUNCIONES */}
        <section className="mb-24">
          <h2 className="text-3xl text-pink-600 font-bold mb-10 text-center">{a.featuresTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {a.features.map((f, i) => (
              <div
                key={f.t}
                className="bg-white rounded-2xl border border-pink-100 shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="text-4xl mb-3" aria-hidden="true">
                  {FEATURE_ICONS[i]}
                </div>
                <h3 className="font-bold text-pink-700 mb-2">{f.t}</h3>
                <p className="text-gray-600 text-sm leading-snug">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="mb-24 bg-white rounded-3xl shadow-xl border border-pink-100 p-8 md:p-12">
          <h2 className="text-3xl text-pink-600 font-bold mb-10 text-center">{a.howTitle}</h2>
          <ol className="grid md:grid-cols-3 gap-8">
            {a.steps.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{s.t}</h3>
                  <p className="text-gray-600 text-sm leading-snug">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* PLATAFORMAS */}
        <section className="mb-24">
          <h2 className="text-3xl text-pink-600 font-bold mb-10 text-center">{a.platformsTitle}</h2>
          <div className="grid md:grid-cols-2 gap-8 text-white">
            <div className="bg-pink-700 rounded-3xl p-10 shadow-lg">
              <h3 className="text-2xl font-bold mb-4">{a.web.title}</h3>
              <ul className="space-y-2 text-sm text-pink-100">
                {a.web.items.map((it) => (
                  <li key={it}>• {it}</li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-400 rounded-3xl p-10 shadow-lg">
              <h3 className="text-2xl font-bold mb-4">{a.app.title}</h3>
              <ul className="space-y-2 text-sm text-rose-50">
                {a.app.items.map((it) => (
                  <li key={it}>• {it}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* IDIOMAS */}
        <section className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl text-pink-600 font-bold mb-4">{a.languagesTitle}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">{a.languagesText}</p>
          <div className="flex justify-center gap-3 text-sm font-semibold">
            {["Español", "English", "K'iche'"].map((l) => (
              <span key={l} className="rounded-full bg-pink-100 text-pink-700 px-4 py-1">
                {l}
              </span>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-gray-500 max-w-3xl mx-auto border-t border-gray-200 pt-8">
          {a.disclaimer}
        </p>
      </div>
    </main>
  );
}
