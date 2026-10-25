"use client";

import Navbar from "./Components/Navbar";
import Image from "next/image";
import { useLanguage } from "./Components/LanguageProvider";

const REFERENCES = [
  {
    text: "Organización Mundial de la Salud. (2024, 13 de marzo). ",
    title: "Cáncer de mama: Datos y cifras",
    rest: ". News-room.",
    url: "https://www.who.int/es/news-room/fact-sheets/detail/breast-cancer",
  },
  {
    text: "Organización Panamericana de la Salud. (s.f.). ",
    title: "Cáncer de mama en las Américas: Temas de salud",
    rest: ".",
    url: "https://www.paho.org/es/temas/cancer-mama",
  },
  {
    text: "National Breast Cancer Foundation. (s.f.). ",
    title: "Autoexamen de senos: Recursos en español",
    rest: ".",
    url: "https://www.nationalbreastcancer.org/es/recursos/autoexamen-de-senos/",
  },
  {
    text: "American Cancer Society. (2024). ",
    title: "Breast Cancer Facts & Figures 2024",
    rest: ". Atlanta: American Cancer Society.",
    url: null,
  },
];

export default function Home() {
  const { dict } = useLanguage();
  const h = dict.home;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-white text-gray-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* TITULAR */}
        <header className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl text-pink-700 font-extrabold mt-2 mb-4">{h.title}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg italic">«{h.quote}»</p>
        </header>

        {/* DEFINICIÓN */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl text-pink-600 font-bold border-l-4 border-pink-600 pl-4">
              {h.definition.title}
            </h2>
            <p className="leading-relaxed text-justify">{h.definition.p1}</p>
            <p className="leading-relaxed text-justify">{h.definition.p2}</p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-rose-300 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
            <Image
              src="/doctor.webp"
              alt={h.definition.imageAlt}
              width={600}
              height={450}
              className="relative rounded-2xl shadow-2xl object-cover"
            />
          </div>
        </section>

        {/* SIGNOS DE ALERTA */}
        <section className="mb-24 bg-white p-10 rounded-3xl shadow-xl border border-pink-100">
          <h2 className="text-3xl text-pink-600 font-bold mb-10 text-center">{h.signs.title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {h.signs.items.map((item) => (
              <div
                key={item.t}
                className="p-6 rounded-2xl bg-gradient-to-br from-white to-pink-50 border border-pink-100 shadow-sm text-center"
              >
                <h3 className="font-bold text-pink-700 mb-2">{item.t}</h3>
                <p className="text-gray-600 text-sm leading-snug">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AUTOEXAMEN */}
        <section className="mb-24">
          <div className="bg-gradient-to-r from-pink-600 to-rose-500 rounded-3xl p-1 text-white shadow-2xl">
            <div className="bg-white rounded-[1.4rem] p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl text-pink-600 font-bold mb-6">{h.selfExam.title}</h2>
                  <p className="text-gray-700 leading-relaxed mb-6 text-justify">{h.selfExam.intro}</p>

                  <div className="space-y-4">
                    <h3 className="font-bold text-pink-700 uppercase text-sm tracking-wider">
                      {h.selfExam.stepsTitle}
                    </h3>
                    <ol className="grid grid-cols-1 gap-3">
                      {h.selfExam.steps.map((step, i) => (
                        <li key={step.t} className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-xs">
                            {i + 1}
                          </span>
                          <p className="text-gray-600 text-sm">
                            <strong className="text-gray-800">{step.t}:</strong> {step.d}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="bg-pink-50 rounded-2xl p-8 border border-pink-100">
                  <h3 className="text-xl font-bold text-pink-700 mb-4 text-center">{h.selfExam.whenTitle}</h3>
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-4xl font-black text-pink-600 mb-1">{h.selfExam.whenBig}</p>
                      <p className="text-gray-600 text-sm font-medium uppercase tracking-tighter">
                        {h.selfExam.whenSmall}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 text-center italic">«{h.selfExam.whenNote}»</p>
                    <div className="pt-4 border-t border-pink-200">
                      <p className="text-sm text-gray-700 text-center">
                        <strong>{h.selfExam.important}</strong> {h.selfExam.importantText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLASIFICACIÓN HISTOLÓGICA */}
        <section className="mb-24">
          <h2 className="text-3xl text-pink-600 font-bold mb-10 text-center">{h.histology.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {h.histology.items.map((item, i) => (
              <div
                key={item.t}
                className={`bg-white p-8 rounded-2xl shadow-lg border-t-4 ${
                  ["border-pink-500", "border-rose-400", "border-orange-300"][i]
                }`}
              >
                <h3 className="font-bold text-xl text-gray-800 mb-3">{item.t}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RIESGO */}
        <section className="grid md:grid-cols-2 gap-16 mb-24 items-center">
          <div className="order-2 md:order-1">
            <Image
              src="/doctora.jpg"
              alt={h.risk.imageAlt}
              width={550}
              height={400}
              className="rounded-3xl shadow-2xl"
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-3xl text-pink-600 font-bold">{h.risk.title}</h2>
            <p className="text-gray-700">{h.risk.intro}</p>
            <div className="space-y-4 text-sm">
              {h.risk.items.map((item) => (
                <div key={item.tag} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                  <span className="bg-pink-100 text-pink-600 font-bold px-3 py-1 rounded-full text-xs whitespace-nowrap">
                    {item.tag}
                  </span>
                  <p>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRATAMIENTO Y PREVENCIÓN */}
        <section className="grid md:grid-cols-2 gap-8 mb-24 text-white">
          <div className="bg-pink-700 p-10 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{h.treatment.title}</h2>
            <p className="text-pink-100 text-sm mb-6 leading-relaxed">{h.treatment.intro}</p>
            <ul className="space-y-2 text-sm">
              {h.treatment.items.map((it) => (
                <li key={it.t}>
                  • <strong>{it.t}:</strong> {it.d}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-rose-400 p-10 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{h.prevention.title}</h2>
            <p className="text-rose-50 text-sm mb-6 leading-relaxed">{h.prevention.intro}</p>
            <ul className="space-y-2 text-sm">
              {h.prevention.items.map((it) => (
                <li key={it}>• {it}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* REFERENCIAS (APA) */}
        <footer className="pt-12 border-t border-gray-200">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 text-center">
            {h.references}
          </h4>
          <div className="max-w-4xl mx-auto space-y-4 text-[11px] md:text-xs text-gray-400 text-center md:text-left">
            {REFERENCES.map((r) => (
              <p key={r.title}>
                {r.text}
                <em>{r.title}</em>
                {r.rest}
                {r.url && (
                  <>
                    {" "}
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline break-all">
                      {r.url}
                    </a>
                  </>
                )}
              </p>
            ))}
          </div>
          <div className="mt-10 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {h.footer}
          </div>
        </footer>
      </div>
    </main>
  );
}
