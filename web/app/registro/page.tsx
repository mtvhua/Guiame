"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrar, ApiError } from "@/lib/api";

export default function Registro() {
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
      alert("Completa todos los campos");
      return;
    }
    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      alert("La contraseña es demasiado larga (máximo 72 caracteres)");
      return;
    }
    if (fechaNacimiento > hoy) {
      alert("Ingresa una fecha de nacimiento válida");
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
      alert(err instanceof ApiError ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h1 className="text-2xl font-bold text-pink-500 mb-6 text-center">Crear cuenta</h1>

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={100}
          className="w-full border border-pink-200 p-2 mb-3 rounded-lg text-black"
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-pink-200 p-2 mb-3 rounded-lg text-black"
        />

        <input
          type="password"
          placeholder="Contraseña (mínimo 8 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-pink-200 p-2 mb-3 rounded-lg text-black"
        />

        <label className="block text-xs text-gray-500 mb-1">Fecha de nacimiento</label>
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
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">¿Ya tienes cuenta?</p>

        <button
          onClick={() => router.push("/login")}
          className="w-full mt-2 text-pink-500 font-semibold hover:underline"
        >
          Iniciar sesión
        </button>
      </div>
    </main>
  );
}
