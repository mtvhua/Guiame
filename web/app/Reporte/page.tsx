"use client";

import Navbar from "../Components/Navbar";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsuario, fetchExamenes, ApiError, type Usuario, type Examen } from "@/lib/api";

type Filtro = "todos" | "alerta" | "sin_alerta";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// "2026-10-20" → "20 de octubre de 2026" (sin convertir zona horaria)
function formatearFecha(f?: string | null) {
  if (!f) return "Sin fecha";
  const [y, m, d] = f.split("-").map(Number);
  if (!y || !m || !d) return f;
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

function formatearCorta(f?: string | null) {
  if (!f) return "—";
  const [y, m, d] = f.split("-").map(Number);
  if (!y || !m || !d) return f;
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

function Badge({ alertas }: { alertas: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
        alertas
          ? "bg-amber-50 text-amber-800 ring-amber-200"
          : "bg-emerald-50 text-emerald-800 ring-emerald-200"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${alertas ? "bg-amber-500" : "bg-emerald-500"}`} />
      {alertas ? "Consultar" : "Sin hallazgos"}
    </span>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 rounded-lg bg-slate-100" />
      ))}
    </div>
  );
}

export default function Reporte() {
  const router = useRouter();

  const [user, setUser] = useState<Usuario | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todos");

  // Sesión guardada en el navegador
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
        // Sesión vencida: api.ts ya la limpió
        setUser(null);
        router.push("/login");
        return;
      }
      setError(e instanceof ApiError ? e.message : "No se pudieron cargar los reportes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Numeración estable: la más antigua es "Prueba 1"
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
    { id: "todos", label: `Todos (${stats.total})` },
    { id: "alerta", label: `Consultar (${stats.conAlerta})` },
    { id: "sin_alerta", label: `Sin hallazgos (${stats.sinAlerta})` },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Mis reportes</h1>
          <p className="mt-1 text-slate-500">Consulta el resultado y el historial de los autoexámenes que realizas desde la app Guíame.</p>
        </header>

        {/* Sin sesión */}
        {!cargandoSesion && !user && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-900">Inicia sesión para ver tus reportes</p>
            <p className="mt-1 text-sm text-slate-500">Tu historial se guarda en tu cuenta.</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-5 rounded-md bg-pink-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-pink-700"
            >
              Iniciar sesión
            </button>
          </div>
        )}

        {user && (
          <>
            {/* Resumen */}
            <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Autoexámenes" value={cargando ? "…" : stats.total} />
              <StatCard label="Último" value={cargando ? "…" : formatearCorta(stats.ultima)} />
              <StatCard label="Sin hallazgos" value={cargando ? "…" : stats.sinAlerta} />
              <StatCard label="Consultar" value={cargando ? "…" : stats.conAlerta} hint="Acude con tu médico" />
            </section>

            {error && (
              <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>{error}</span>
                <button onClick={cargar} className="font-medium underline hover:no-underline">
                  Reintentar
                </button>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-5">
              {/* HISTORIAL */}
              <section className="lg:col-span-2">
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 p-4">
                    <h2 className="font-semibold text-slate-900">Historial</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {filtros.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setFiltro(f.id)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            filtro === f.id
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                      <p className="px-2 py-10 text-center text-sm text-slate-400">
                        {examenes.length === 0
                          ? "Aún no hay autoexámenes. Realiza uno desde la app Guíame y aparecerá aquí."
                          : "No hay reportes en este filtro."}
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {visibles.map((ex) => {
                          const activo = ex.id === seleccionadoId;
                          return (
                            <li key={ex.id}>
                              <button
                                onClick={() => setSeleccionadoId(ex.id)}
                                aria-current={activo ? "true" : undefined}
                                className={`w-full rounded-lg border p-3 text-left transition ${
                                  activo
                                    ? "border-pink-300 bg-pink-50/60 ring-1 ring-pink-200"
                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-semibold text-slate-900">
                                    Prueba {numeracion.get(ex.id)}
                                  </span>
                                  <Badge alertas={ex.tieneAlertas} />
                                </div>
                                <p className="mt-1 text-xs text-slate-500">{formatearFecha(ex.fecha)}</p>
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
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
                  {cargando ? (
                    <Skeleton />
                  ) : !seleccionado ? (
                    <p className="py-16 text-center text-sm text-slate-400">Selecciona un reporte para ver el detalle.</p>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Prueba {numeracion.get(seleccionado.id)} · {formatearFecha(seleccionado.fecha)}
                          </p>
                          <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                            {seleccionado.tieneAlertas ? "Se recomienda consultar" : "Sin hallazgos preocupantes"}
                          </h2>
                        </div>
                        <Badge alertas={seleccionado.tieneAlertas} />
                      </div>

                      <div
                        className={`mt-5 rounded-lg border-l-4 p-4 ${
                          seleccionado.tieneAlertas ? "border-amber-400 bg-amber-50" : "border-emerald-400 bg-emerald-50"
                        }`}
                      >
                        <p className="text-sm font-medium text-slate-800">Reporte</p>
                        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">
                          {seleccionado.reporte || "Este autoexamen no incluye un reporte."}
                        </p>
                      </div>

                      <p className="mt-6 text-xs leading-relaxed text-slate-400">
                        Este resultado es orientativo y no sustituye una evaluación médica. Si notas cambios en tus senos,
                        consulta a un profesional de salud.
                      </p>
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
