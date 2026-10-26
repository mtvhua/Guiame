"use client";

import Navbar from "../Components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsuario, getMe, logout, type Usuario } from "@/lib/api";
import { useLanguage } from "../Components/LanguageProvider";

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <dt className="text-sm text-slate-500">{etiqueta}</dt>
      <dd className="break-all text-sm font-medium text-slate-900 sm:text-right">{valor}</dd>
    </div>
  );
}

function Tarjeta({ children }: { children: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white">{children}</section>;
}

export default function Perfil() {
  const { dict } = useLanguage();
  const p = dict.perfil;

  const [user, setUser] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [saliendo, setSaliendo] = useState(false);
  const router = useRouter();

  // Muestra de inmediato lo guardado y luego lo actualiza desde el servidor
  useEffect(() => {
    const local = getUsuario();
    setUser(local);
    setCargando(false);

    if (local) {
      getMe()
        .then(setUser)
        .catch(() => {
          // Si la sesión ya no es válida, api.ts la limpió: se muestra como "sin sesión"
          if (!getUsuario()) setUser(null);
        });
    }
  }, []);

  const handleLogout = async () => {
    if (saliendo) return;
    setSaliendo(true);
    await logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{p.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{p.subtitle}</p>
        </header>

        {/* Cargando */}
        {cargando && (
          <Tarjeta>
            <div className="animate-pulse space-y-4 p-6" aria-hidden="true">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-slate-200" />
                  <div className="h-3 w-56 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-5/6 rounded bg-slate-100" />
            </div>
          </Tarjeta>
        )}

        {/* Sin sesión */}
        {!cargando && !user && (
          <Tarjeta>
            <div className="p-10 text-center">
              <p className="text-base font-medium text-slate-900">{p.noSession}</p>
              <p className="mt-1 text-sm text-slate-500">{p.noSessionText}</p>
              <button
                onClick={() => router.push("/login")}
                className="mt-6 rounded-md bg-pink-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
              >
                {p.login}
              </button>
            </div>
          </Tarjeta>
        )}

        {/* Con sesión */}
        {!cargando && user && (
          <div className="space-y-6">
            <Tarjeta>
              <div className="flex items-center gap-4 border-b border-slate-200 p-6">
                <Image
                  src="/avatar.png"
                  alt="Avatar"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-slate-900">{user.nombre || user.email}</p>
                  <p className="truncate text-sm text-slate-500">{user.email}</p>
                </div>
              </div>

              <dl className="divide-y divide-slate-100 px-6">
                <Fila etiqueta={p.name} valor={user.nombre || "—"} />
                <Fila etiqueta={p.email} valor={user.email || "—"} />
                <Fila etiqueta={p.age} valor={user.edad != null ? `${user.edad} ${p.years}` : "—"} />
              </dl>

              <p className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">{p.readOnly}</p>
            </Tarjeta>

            <Tarjeta>
              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">{p.historyTitle}</h2>
                  <p className="mt-1 text-sm text-slate-500">{p.historyText}</p>
                </div>
                <Link
                  href="/Reporte"
                  className="shrink-0 rounded-md bg-pink-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
                >
                  {p.historyButton}
                </Link>
              </div>
            </Tarjeta>

            <Tarjeta>
              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">{p.sessionTitle}</h2>
                  <p className="mt-1 text-sm text-slate-500">{p.sessionText}</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={saliendo}
                  className="shrink-0 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  {saliendo ? p.loggingOut : p.logout}
                </button>
              </div>
            </Tarjeta>
          </div>
        )}
      </div>
    </main>
  );
}
