"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registrar, ApiError } from "@/lib/api";
import { useLanguage } from "../Components/LanguageProvider";

export default function Registro() {
  const { dict } = useLanguage();
  const t = dict.auth;
  const errores = t.errors as Record<string, string>;

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const hoy = new Date().toISOString().split("T")[0];

  const handleRegister = async () => {
    // Validaciones (el servidor vuelve a validar todo)
    if (!nombre.trim() || !email.trim() || !password || !fechaNacimiento) {
      alert(t.errFields);
      return;
    }
    if (password.length < 8) {
      alert(t.errPasswordShort);
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      alert(t.errPasswordLong);
      return;
    }
    if (fechaNacimiento > hoy) {
      alert(t.errBirth);
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      // El registro ya deja la sesión iniciada
      await registrar({
        nombre: nombre.trim(),
        email: email.trim(),
        password,
        fechaNacimiento,
      });
      router.push("/perfil");
    } catch (err) {
      console.error(err);
      alert(err instanceof ApiError ? errores[err.code] ?? err.message : t.errRegisterGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h1 className="text-2xl font-bold text-pink-500 mb-6 text-center">{t.registerTitle}</h1>

        <input
          type="text"
          placeholder={t.fullName}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={100}
          className="w-full border border-pink-200 p-2 mb-3 rounded-lg text-black"
        />

        <input
          type="email"
          placeholder={t.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-pink-200 p-2 mb-3 rounded-lg text-black"
        />

        <input
          type="password"
          placeholder={t.passwordHint}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-pink-200 p-2 mb-3 rounded-lg text-black"
        />

        <label className="block text-xs text-gray-500 mb-1">{t.birthDate}</label>
        <input
          type="date"
          max={hoy}
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          className="w-full border border-pink-200 p-2 mb-4 rounded-lg text-black"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full text-white py-2 rounded-lg ${
            loading ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          {loading ? t.registering : t.registerButton}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">{t.haveAccount}</p>

        <button
          onClick={() => router.push("/login")}
          className="w-full mt-2 text-pink-500 font-semibold hover:underline"
        >
          {t.loginButton}
        </button>

        {/* Entrar sin cuenta: solo la parte informativa */}
        <div className="my-4 flex w-full items-center gap-3 text-xs text-gray-400" aria-hidden="true">
          <span className="h-px flex-1 bg-pink-100" />
          {t.orContinue}
          <span className="h-px flex-1 bg-pink-100" />
        </div>

        <Link
          href="/"
          className="block w-full rounded-lg border border-pink-300 py-2 text-center font-semibold text-pink-600 transition hover:bg-pink-50"
        >
          {t.viewHome}
        </Link>
      </div>
    </main>
  );
}
