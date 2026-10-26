"use client";

import Navbar from "../Components/Navbar";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsuario, fetchExamenes, ApiError, type Usuario, type Examen } from "@/lib/api";
import { useLanguage } from "../Components/LanguageProvider";
import {
  ClipboardList,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lock,
  History,
  Sparkles,
  FileText,
  Info,
  Clock,
  RefreshCw,
} from "lucide-react";

type Filtro = "todos" | "alerta" | "sin_alerta";

// "2026-10-20" → fecha larga/corta según el idioma (sin convertir zona horaria)
function partes(f?: string | null) {
  if (!f) return null;
  const [y, m, d] = f.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}

function fechaLarga(f: string | null | undefined, tag: string, vacio: string) {
  const d = partes(f);
  if (!d) return f || vacio;
  return d.toLocaleDateString(tag, { day: "numeric", month: "long", year: "numeric" });
}

function fechaCorta(f: string | null | undefined, tag: string) {
  const d = partes(f);
  if (!d) return f || "—";
  return d.toLocaleDateString(tag, { day: "2-digit", month: "2-digit", year: "numeric" });
}

function horaDe(iso: string | undefined, tag: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleTimeString(tag, { hour: "numeric", minute: "2-digit" });
}

const TONOS = {
  pink: { icono: "bg-pink-100 text-pink-600", barra: "from-pink-500 to-rose-400" },
  sky: { icono: "bg-sky-100 text-sky-600", barra: "from-sky-500 to-cyan-400" },
  emerald: { icono: "bg-emerald-100 text-emerald-600", barra: "from-emerald-500 to-teal-400" },
  amber: { icono: "bg-amber-100 text-amber-600", barra: "from-amber-500 to-orange-400" },
} as const;
type Tono = keyof typeof TONOS;

function Badge({ alertas, textoAlerta, textoOk }: { alertas: boolean; textoAlerta: string; textoOk: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
        alertas
          ? "bg-amber-100 text-amber-800 ring-amber-300"
          : "bg-emerald-100 text-emerald-800 ring-emerald-300"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${alertas ? "bg-amber-500" : "bg-emerald-500"}`} />
      {alertas ? textoAlerta : textoOk}
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
  tono,
  icono: Icono,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tono: Tono;
  icono: React.ElementType;
}) {
  const t = TONOS[tono];
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.barra}`} />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${t.icono}`} aria-hidden="true">
          <Icono className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 rounded-xl bg-pink-100/60" />
      ))}
    </div>
  );
}

export default function Reporte() {
  const router = useRouter();
  const { dict, locale } = useLanguage();
  const r = dict.reporte;
  const tag = locale === "en" ? "en-US" : "es-GT";

  const [user, setUser] = useState<Usuario | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todos");

  useEffect(() => {
    setUser(getUsuario());
    setCargandoSesion(false);
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError("");
    try {
      const data = await fetchExamenes();
      setExamenes(data);
      setSeleccionadoId((prev) => (data.some((e) => e.id === prev) ? prev : data[0]?.id ?? null));
    } catch (e) {
      console.error(e);
      if (e instanceof ApiError && e.status === 401) {
        setUser(null);
        router.push("/login");
        return;
      }
      const errores = dict.auth.errors as Record<string, string>;
      setError(e instanceof ApiError ? errores[e.code] ?? e.message : r.loadError);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    cargar();
  }, [user?.id]);

  const numeracion = useMemo(() => {
    const orden = [...examenes].sort(
      (a, b) => (a.fecha || "").localeCompare(b.fecha || "") || Number(a.id) - Number(b.id)
    );
    return new Map(orden.map((e, i) => [e.id, i + 1]));
  }, [examenes]);

  const stats = useMemo(() => {
    const conAlerta = examenes.filter((e) => e.tieneAlertas).length;
    return { total: examenes.length, conAlerta, sinAlerta: examenes.length - conAlerta, ultima: examenes[0]?.fecha };
  }, [examenes]);

  const visibles = useMemo(
    () =>
      examenes.filter((e) => (filtro === "alerta" ? e.tieneAlertas : filtro === "sin_alerta" ? !e.tieneAlertas : true)),
    [examenes, filtro]
  );

  const seleccionado = examenes.find((e) => e.id === seleccionadoId) ?? null;

  const filtros: { id: Filtro; label: string }[] = [
    { id: "todos", label: `${r.filters.all} (${stats.total})` },
    { id: "alerta", label: `${r.filters.consult} (${stats.conAlerta})` },
    { id: "sin_alerta", label: `${r.filters.clear} (${stats.sinAlerta})` },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-sky-50 text-slate-800">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Banner */}
        <header className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 p-8 text-white shadow-lg sm:p-10">
          <div aria-hidden="true" className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div aria-hidden="true" className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-white/10" />
          <div aria-hidden="true" className="absolute right-24 bottom-6 h-16 w-16 rounded-full bg-white/10" />
          <div className="relative">
            {user && (
              <p className="text-sm font-medium text-pink-100">
                {r.greeting} {user.nombre}
              </p>
            )}
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{r.title}</h1>
            <p className="mt-2 max-w-2xl text-pink-50">{r.subtitle}</p>
          </div>
        </header>

        {/* Sin sesión */}
        {!cargandoSesion && !user && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg ring-1 ring-pink-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-600" aria-hidden="true">
              <Lock className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-slate-900">{r.loginTitle}</p>
            <p className="mt-1 text-sm text-slate-500">{r.loginText}</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-6 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-7 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
            >
              {r.loginButton}
            </button>
          </div>
        )}

        {user && (
          <>
            {/* Resumen */}
            <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard tono="pink" icono={ClipboardList} label={r.stats.total} value={cargando ? "…" : stats.total} />
              <StatCard
                tono="sky"
                icono={Calendar}
                label={r.stats.last}
                value={cargando ? "…" : fechaCorta(stats.ultima, tag)}
              />
              <StatCard tono="emerald" icono={CheckCircle2} label={r.stats.clear} value={cargando ? "…" : stats.sinAlerta} />
              <StatCard
                tono="amber"
                icono={AlertTriangle}
                label={r.stats.consult}
                value={cargando ? "…" : stats.conAlerta}
                hint={r.stats.consultHint}
              />
            </section>

            {error && (
              <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>{error}</span>
                <button onClick={cargar} className="flex items-center gap-1 font-semibold underline hover:no-underline">
                  <RefreshCw className="h-4 w-4" />
                  {r.retry}
                </button>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-5">
              {/* HISTORIAL */}
              <section className="lg:col-span-2">
                <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100">
                  <div className="border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 p-4">
                    <h2 className="flex items-center gap-2 font-bold text-pink-700">
                      <History className="h-5 w-5 text-pink-600" aria-hidden="true" /> {r.history}
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {filtros.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setFiltro(f.id)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            filtro === f.id
                              ? "bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow"
                              : "bg-white text-slate-600 ring-1 ring-pink-100 hover:bg-pink-50"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="max-h-[32rem] overflow-y-auto p-3">
                    {cargando ? (
                      <Skeleton />
                    ) : visibles.length === 0 ? (
                      <div className="px-2 py-10 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-pink-500" aria-hidden="true">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {examenes.length === 0 ? r.empty : r.emptyFilter}
                        </p>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {visibles.map((ex) => {
                          const activo = ex.id === seleccionadoId;
                          const hora = horaDe(ex.instante, tag);
                          return (
                            <li key={ex.id}>
                              <button
                                onClick={() => setSeleccionadoId(ex.id)}
                                aria-current={activo ? "true" : undefined}
                                className={`flex w-full items-center gap-3 rounded-xl border-l-4 p-3 text-left transition ${
                                  ex.tieneAlertas ? "border-amber-400" : "border-emerald-400"
                                } ${
                                  activo
                                    ? "bg-pink-50 shadow-md ring-1 ring-pink-200"
                                    : "bg-slate-50/70 hover:bg-pink-50/60 hover:shadow-sm"
                                }`}
                              >
                                <span
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow ${
                                    ex.tieneAlertas ? "from-amber-400 to-orange-500" : "from-emerald-400 to-teal-500"
                                  }`}
                                >
                                  {numeracion.get(ex.id)}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-sm font-semibold text-slate-900">
                                    {r.test} {numeracion.get(ex.id)}
                                  </span>
                                  <span className="block truncate text-xs text-slate-500">
                                    {fechaLarga(ex.fecha, tag, r.noDate)}
                                    {hora && ` · ${hora}`}
                                  </span>
                                </span>
                                <Badge alertas={ex.tieneAlertas} textoAlerta={r.badgeConsult} textoOk={r.badgeClear} />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </section>

              {/* DETALLE */}
              <section className="lg:col-span-3">
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100 lg:sticky lg:top-24">
                  {cargando ? (
                    <div className="p-6">
                      <Skeleton />
                    </div>
                  ) : !seleccionado ? (
                    <div className="px-6 py-20 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400" aria-hidden="true">
                        <FileText className="h-8 w-8" />
                      </div>
                      <p className="mt-3 text-sm text-slate-500">{r.selectOne}</p>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`bg-gradient-to-r px-6 py-5 text-white ${
                          seleccionado.tieneAlertas ? "from-amber-400 to-orange-500" : "from-emerald-400 to-teal-500"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25 text-white"
                            aria-hidden="true"
                          >
                            {seleccionado.tieneAlertas ? (
                              <AlertTriangle className="h-8 w-8" />
                            ) : (
                              <Sparkles className="h-8 w-8" />
                            )}
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                              {r.test} {numeracion.get(seleccionado.id)}
                            </p>
                            <h2 className="text-2xl font-extrabold leading-tight">
                              {seleccionado.tieneAlertas ? r.consultTitle : r.clearTitle}
                            </h2>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {fechaLarga(seleccionado.fecha, tag, r.noDate)}
                          </span>
                          {horaDe(seleccionado.instante, tag) && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1">
                              <Clock className="h-3.5 w-3.5" />
                              {horaDe(seleccionado.instante, tag)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-6">
                        <div
                          className={`rounded-xl border-l-4 p-4 ${
                            seleccionado.tieneAlertas ? "border-amber-400 bg-amber-50" : "border-emerald-400 bg-emerald-50"
                          }`}
                        >
                          <p className="text-sm font-bold text-slate-800">{r.report}</p>
                          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">
                            {seleccionado.reporte || r.noReport}
                          </p>
                        </div>

                        <p className="mt-5 flex items-start gap-2 rounded-lg bg-sky-50 px-4 py-3 text-xs leading-relaxed text-sky-800">
                          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                          <span>{r.disclaimer}</span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}