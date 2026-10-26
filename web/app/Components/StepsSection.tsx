"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLanguage } from "./LanguageProvider";

// Lottie solo se carga en el navegador (evita el error "window is not defined").
// Requiere: npm install lottie-react
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Imágenes por paso (índice 0 = paso 1), guardadas en public/pasos/.
// La ruta NO lleva "public": /pasos/paso-1.png apunta a public/pasos/paso-1.png
const STEP_IMAGES: string[] = [
  "/pasos/11.png", // Inspección visual
  "/pasos/12.png", // Palpación de pie
  "/pasos/13.png", // Palpación acostada
  "/pasos/14.png", // Presión en el pezón
];

// Animaciones por paso (índice 0 = paso 1). Si un paso tiene animación, tiene prioridad sobre la imagen.
// Ejemplo:
//   import paso1 from "@/animations/paso1.json";
//   const ANIMATIONS: Record<number, object> = { 0: paso1 };
const ANIMATIONS: Record<number, object> = {};

// Textos de los botones. Si tu app es bilingüe, muévelos al diccionario.
const LABELS = { prev: "Anterior", next: "Siguiente", step: "Paso", of: "de" };

export default function StepsSection() {
  const { dict } = useLanguage();
  const h = dict.home;
  const steps = h.selfExam.steps;

  const [current, setCurrent] = useState(0);
  // Si una imagen no se encuentra, se muestra el número grande en su lugar
  const [missing, setMissing] = useState<Record<number, boolean>>({});

  const step = steps[current];
  const animation = ANIMATIONS[current];
  const image = STEP_IMAGES[current];
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <section className="mb-24">
      <h2 className="text-3xl text-slate-900 font-semibold mb-10 text-center">
        {h.selfExam.stepsTitle}
      </h2>

      <div className="grid md:grid-cols-[1fr_2fr] gap-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-stone-200">
        {/* LISTA DE PASOS */}
        <ol className="space-y-2">
          {steps.map((s, i) => (
            <li key={s.t}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-current={i === current ? "step" : undefined}
                className={`w-full flex items-center gap-3 text-left p-3 rounded-xl border transition ${
                  i === current
                    ? "bg-rose-50 border-rose-200 shadow-sm"
                    : "bg-white border-transparent hover:bg-stone-50"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= current ? "bg-rose-700 text-white" : "bg-stone-100 text-slate-600"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-sm ${
                    i === current ? "font-semibold text-rose-800" : "text-slate-600"
                  }`}
                >
                  {s.t}
                </span>
              </button>
            </li>
          ))}
        </ol>

        {/* PASO ACTUAL */}
        <div className="flex flex-col">
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-rose-700 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6 items-center flex-1">
            {/* Animación / imagen del paso */}
            <div className="relative aspect-square w-full max-w-xs mx-auto rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden">
              {animation ? (
                <Lottie
                  key={current}
                  animationData={animation}
                  loop
                  style={{ width: "100%", height: "100%" }}
                />
              ) : image && !missing[current] ? (
                <Image
                  key={current}
                  src={image}
                  alt={step.t}
                  fill
                  sizes="(min-width: 640px) 320px, 100vw"
                  className="object-contain p-4"
                  onError={() => setMissing((m) => ({ ...m, [current]: true }))}
                />
              ) : (
                <span className="text-8xl font-black text-stone-300">{current + 1}</span>
              )}
            </div>

            {/* Texto */}
            <div>
              <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2">
                {LABELS.step} {current + 1} {LABELS.of} {steps.length}
              </p>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">{step.t}</h3>
              <p className="text-slate-600 leading-relaxed">{step.d}</p>
            </div>
          </div>

          {/* NAVEGACIÓN */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setCurrent((c) => c - 1)}
              disabled={isFirst}
              className="px-5 py-2 rounded-full border border-stone-300 text-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition"
            >
              ← {LABELS.prev}
            </button>
            <button
              type="button"
              onClick={() => setCurrent((c) => c + 1)}
              disabled={isLast}
              className="px-5 py-2 rounded-full bg-rose-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-800 transition"
            >
              {LABELS.next} →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
