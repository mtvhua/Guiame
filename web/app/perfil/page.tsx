"use client";

import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsuario, getMe, logout, type Usuario } from "@/lib/api";

export default function Perfil() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
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
          // Si la sesión ya no es válida, api.ts la limpió: se muestra como "no logueado"
          if (!getUsuario()) setUser(null);
        });
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/login");
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-pink-50">
      <Navbar />

      <div className="flex justify-center mt-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
          {/* Encabezado */}
          <div className="flex items-center space-x-6 mb-8">
            <img
              src="/avatar.png"
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-pink-500 object-cover"
            />

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {cargando ? "Cargando..." : user?.nombre || user?.email || "No logueado"}
              </h1>
            </div>
          </div>

          {/* Información */}
          <div className="space-y-4">
            <div className="flex justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-700">Correo electrónico:</span>
              <span className="text-gray-600">{user?.email || "Sin correo"}</span>
            </div>

            <div className="flex justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-700">Edad:</span>
              <span className="text-gray-600">{user?.edad != null ? `${user.edad} años` : "—"}</span>
            </div>

            <div className="flex justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-700">Contraseña:</span>
              <span className="text-gray-600">********</span>
            </div>
          </div>

          {/* Login / Logout */}
          <div className="mt-10 border-t pt-6 flex justify-center">
            {user ? (
              <button onClick={handleLogout} className="text-red-500 font-semibold hover:text-red-600">
                Cerrar sesión
              </button>
            ) : (
              <button onClick={handleLoginRedirect} className="text-pink-500 font-semibold hover:text-pink-600">
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
