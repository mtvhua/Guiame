"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, ApiError } from "@/lib/api";
import { useLanguage } from "../Components/LanguageProvider";

export default function Login() {
  const { dict } = useLanguage();
  const t = dict.auth;
  const errores = t.errors as Record<string, string>;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validador de email
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setError("");

    // VALIDACIONES
    if (!email && !password) {
      setError(t.errBoth);
      return;
    }
    if (!email) {
      setError(t.errEmail);
      return;
    }
    if (!isValidEmail(email)) {
      setError(t.errEmailInvalid);
      return;
    }
    if (!password) {
      setError(t.errPassword);
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.push("/perfil");
    } catch (err) {
      console.error(err);
      setError(err instanceof ApiError ? errores[err.code] ?? err.message : t.errGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-pink-500 mb-6">{t.loginTitle}</h1>

        <input
          type="email"
          placeholder={t.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border p-2 mb-3 rounded-lg text-black placeholder-black focus:outline-none focus:ring-2 
            ${error ? "border-red-400 focus:ring-red-300" : "border-pink-200 focus:ring-pink-300"}`}
        />

        <input
          type="password"
          placeholder={t.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className={`w-full border p-2 mb-3 rounded-lg text-black placeholder-black focus:outline-none focus:ring-2 
            ${error ? "border-red-400 focus:ring-red-300" : "border-pink-200 focus:ring-pink-300"}`}
        />

        {/* Mensaje de error */}
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full transition text-white font-semibold py-2 rounded-lg shadow-md ${
            loading ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          {loading ? t.loggingIn : t.loginButton}
        </button>

        <button
          onClick={() => router.push("/registro")}
          className="mt-4 text-pink-500 font-semibold hover:underline"
        >
          {t.noAccount}
        </button>

        {/* Entrar sin cuenta: solo la parte informativa */}
        <div className="my-5 flex w-full items-center gap-3 text-xs text-gray-400" aria-hidden="true">
          <span className="h-px flex-1 bg-pink-100" />
          {t.orContinue}
          <span className="h-px flex-1 bg-pink-100" />
        </div>

        <Link
          href="/"
          className="w-full rounded-lg border border-pink-300 py-2 text-center font-semibold text-pink-600 transition hover:bg-pink-50"
        >
          {t.viewHome}
        </Link>
      </div>
    </main>
  );
}
