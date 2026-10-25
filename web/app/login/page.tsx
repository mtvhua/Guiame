"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, ApiError } from "@/lib/api";

export default function Login() {
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
      setError("Ingresa tu correo y contraseña");
      return;
    }
    if (!email) {
      setError("Ingresa tu correo");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Ingresa un correo válido (ej: usuario@gmail.com)");
      return;
    }
    if (!password) {
      setError("Ingresa tu contraseña");
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.push("/perfil");
    } catch (err) {
      console.error(err);
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión. Intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-pink-500 mb-6">Iniciar sesión</h1>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border p-2 mb-3 rounded-lg text-black placeholder-black focus:outline-none focus:ring-2 
            ${error ? "border-red-400 focus:ring-red-300" : "border-pink-200 focus:ring-pink-300"}`}
        />

        <input
          type="password"
          placeholder="Contraseña"
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
          {loading ? "Entrando..." : "Iniciar sesión"}
        </button>

        <button
          onClick={() => router.push("/registro")}
          className="mt-4 text-pink-500 font-semibold hover:underline"
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </main>
  );
}
