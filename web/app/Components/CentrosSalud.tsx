"use client";

import { useLanguage } from "./LanguageProvider";
import { CENTROS, mapaUrl, type TipoCentro } from "@/lib/centros";

const ESTILO_TIPO: Record<TipoCentro, string> = {
  publico: "bg-sky-50 text-sky-800 ring-sky-200",
  seguro: "bg-amber-50 text-amber-800 ring-amber-200",
  ong: "bg-rose-50 text-rose-800 ring-rose-200",
  privado: "bg-slate-100 text-slate-700 ring-slate-200",
};

// Fecha de la última revisión de los datos (cámbiala cuando actualices la lista)
const REVISION = new Date(2026, 9, 25);

function IconoPin() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function CentrosSalud() {
  const { dict, locale } = useLanguage();
  const c = dict.centros;
  const kinds = c.kinds as Record<string, string>;
  const services = c.services as Record<string, string>;
  const lang = locale === "en" ? "en" : "es";
  const tag = locale === "en" ? "en-US" : "es-GT";

  return (
    <section className="mb-24" aria-labelledby="centros-titulo">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2 id="centros-titulo" className="text-3xl font-semibold tracking-tight text-slate-900">
          {c.title}
        </h2>
        <p className="mt-3 leading-relaxed text-slate-600">{c.subtitle}</p>

        <div className="mt-6">
          <a
            href={mapaUrl(c.nearMeQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-rose-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
          >
            <IconoPin />
            {c.nearMe}
          </a>
          <p className="mt-2 text-xs text-slate-500">{c.nearMeHint}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {CENTROS.map((x) => (
          <article
            key={x.id}
            className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <span
              className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${ESTILO_TIPO[x.tipo]}`}
            >
              {kinds[x.tipo]}
            </span>

            <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-900">{x.nombre}</h3>
            <p className="mt-1 text-sm text-slate-500">{x.lugar[lang]}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{x.nota[lang]}</p>

            {x.servicios.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {x.servicios.map((s) => (
                  <li key={s} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-slate-700">
                    {services[s]}
                  </li>
                ))}
              </ul>
            )}

            <a
              href={mapaUrl(x.mapa)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${c.openMap}: ${x.nombre}`}
              className="mt-5 inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-rose-700 hover:text-rose-800 hover:underline"
            >
              <IconoPin />
              {c.openMap}
            </a>
          </article>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-slate-500">
        {c.disclaimer}{" "}
        <span className="whitespace-nowrap">
          {c.reviewed} {REVISION.toLocaleDateString(tag, { month: "long", year: "numeric" })}.
        </span>
      </p>
    </section>
  );
}
