// Cliente para guiame-api (Cloud Run).
// En .env.local (carpeta web, junto a package.json), SIN "/" al final:
//   NEXT_PUBLIC_API_URL=https://TU-URL.run.app
// Después de editar .env.local hay que reiniciar `npm run dev`.

import type { Locale } from "./dictionaries";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const ACCESS_KEY = "guiame_access";
const REFRESH_KEY = "guiame_refresh";
const USER_KEY = "guiame_usuario";

/* ---------- Tipos (según lo que responde el backend) ---------- */

export type Usuario = { id: string; nombre: string; email: string; edad: number | null };

export type Examen = {
  id: string;
  fecha: string; // día local "AAAA-MM-DD"
  instante: string; // momento exacto (ISO); la hora se da formato en la página según el idioma
  reporte: string | null;
  tieneAlertas: boolean;
};

type ExamenServidor = { id: string; fecha: string; reporte: string | null; tieneAlertas: boolean };

export type RegistroDatos = {
  nombre: string;
  email: string;
  password: string; // 8 a 72 caracteres
  fechaNacimiento: string; // "AAAA-MM-DD"
};

export type PreguntaTraducida = { id_pregunta: number; paso: number; texto: string };

type Sesion = { accessToken: string; refreshToken: string; usuario: Usuario };
type Respuesta = { ok: boolean; status: number; data: Record<string, unknown> };

/* ---------- Errores: el backend manda códigos, aquí se traducen ---------- */

const MENSAJES: Record<string, string> = {
  credenciales_invalidas: "Correo o contraseña incorrectos",
  demasiados_intentos: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo",
  correo_en_uso: "Ese correo ya está registrado",
  nombre_invalido: "Ingresa un nombre válido",
  correo_invalido: "Ingresa un correo válido",
  fecha_nacimiento_invalida: "Ingresa una fecha de nacimiento válida",
  contrasena_invalida: "La contraseña debe tener entre 8 y 72 caracteres",
  campos_incompletos: "Completa todos los campos",
  no_autenticada: "Tu sesión expiró. Inicia sesión de nuevo",
  token_invalido: "Tu sesión expiró. Inicia sesión de nuevo",
  refresh_invalido: "Tu sesión expiró. Inicia sesión de nuevo",
};

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status: number, code = "") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function mensajeDe(code: string, status: number) {
  return MENSAJES[code] ?? (status >= 500 ? "Error del servidor. Intenta más tarde" : `Error ${status}`);
}

/* ---------- Sesión (guardada en el navegador) ---------- */

function leer(clave: string): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem(clave);
}

function guardarSesion(s: Sesion) {
  localStorage.setItem(ACCESS_KEY, s.accessToken);
  localStorage.setItem(REFRESH_KEY, s.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(s.usuario));
}

function limpiarSesion() {
  [ACCESS_KEY, REFRESH_KEY, USER_KEY].forEach((k) => localStorage.removeItem(k));
}

export function getUsuario(): Usuario | null {
  try {
    const raw = leer(USER_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  } catch {
    return null;
  }
}

/** Cierra la sesión aquí y revoca el refresh token en el servidor (si hay conexión). */
export async function logout(): Promise<void> {
  const rt = leer(REFRESH_KEY);
  limpiarSesion();
  if (!rt || !API_URL) return;
  try {
    await send("/api/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken: rt }) });
  } catch {
    /* ya se cerró la sesión localmente */
  }
}

/* ---------- Peticiones ---------- */

async function send(path: string, init: RequestInit = {}, token?: string): Promise<Respuesta> {
  if (!API_URL) throw new ApiError("Falta NEXT_PUBLIC_API_URL en .env.local", 0, "config");

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { ...headers, ...(init.headers as Record<string, string>) },
      signal: controller.signal,
    });
    const data = res.status === 204 ? {} : ((await res.json().catch(() => ({}))) as Record<string, unknown>);
    return { ok: res.ok, status: res.status, data };
  } catch {
    throw new ApiError("No se pudo conectar con el servidor", 0, "red");
  } finally {
    clearTimeout(timer);
  }
}

// El access token dura 30 min; con el refresh token se pide uno nuevo.
// Una sola renovación a la vez, porque el refresh token se consume al usarse.
let refrescando: Promise<string | null> | null = null;

function refrescar(): Promise<string | null> {
  if (!refrescando) {
    refrescando = (async () => {
      const rt = leer(REFRESH_KEY);
      if (!rt) return null;
      const r = await send("/api/auth/refresh", { method: "POST", body: JSON.stringify({ refreshToken: rt }) });
      if (!r.ok) {
        if (r.status === 400 || r.status === 401) limpiarSesion();
        return null;
      }
      const s = r.data as unknown as Sesion;
      guardarSesion(s);
      return s.accessToken;
    })().finally(() => {
      refrescando = null;
    });
  }
  return refrescando;
}

function sesionExpirada() {
  limpiarSesion();
  return new ApiError(MENSAJES.token_invalido, 401, "token_invalido");
}

async function request<T>(path: string, init: RequestInit = {}, conToken = false): Promise<T> {
  let r: Respuesta;

  if (!conToken) {
    r = await send(path, init);
  } else {
    const token = leer(ACCESS_KEY) ?? (await refrescar());
    if (!token) throw sesionExpirada();
    r = await send(path, init, token);
    if (r.status === 401) {
      const nuevo = await refrescar();
      if (!nuevo) throw sesionExpirada();
      r = await send(path, init, nuevo);
      if (r.status === 401) limpiarSesion();
    }
  }

  if (!r.ok) {
    const code = typeof r.data.error === "string" ? r.data.error : "";
    throw new ApiError(mensajeDe(code, r.status), r.status, code);
  }
  return r.data as T;
}

/* ---------- Autenticación ---------- */

export async function login(email: string, password: string): Promise<Usuario> {
  const s = await request<Sesion>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  guardarSesion(s);
  return s.usuario;
}

// El registro ya devuelve la sesión: no hace falta iniciar sesión después.
export async function registrar(datos: RegistroDatos): Promise<Usuario> {
  const s = await request<Sesion>("/api/auth/register", { method: "POST", body: JSON.stringify(datos) });
  guardarSesion(s);
  return s.usuario;
}

export async function getMe(): Promise<Usuario> {
  const u = await request<Usuario>("/api/usuarios/me", {}, true);
  localStorage.setItem(USER_KEY, JSON.stringify(u));
  return u;
}

/* ---------- Reportes (los crea la app; la web solo los muestra) ---------- */

export async function fetchExamenes(): Promise<Examen[]> {
  const lista = await request<ExamenServidor[]>("/api/examenes", {}, true);
  // ultima_fecha llega como instante UTC ("2026-10-21T02:38:00.000Z"): se convierte a la hora local de quien mira
  const dos = (n: number) => String(n).padStart(2, "0");
  return lista.map((e) => {
    const d = new Date(e.fecha);
    if (Number.isNaN(d.getTime())) return { ...e, fecha: String(e.fecha).slice(0, 10), instante: "" };
    return {
      ...e,
      fecha: `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`,
      instante: e.fecha,
    };
  });
}

/* ---------- Compatibilidad: el backend aún no tiene estas rutas ---------- */
// Se mantienen para no romper imports existentes (p. ej. LanguageProvider).

export async function syncIdiomaUsuario(_locale: Locale, _token?: string): Promise<void> {
  return;
}

export async function fetchPreguntas(_locale: Locale): Promise<PreguntaTraducida[]> {
  return [];
}
