"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setExito(false);

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    try {
      const response = await fetch("/api/usuarios/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear la cuenta.");
      }

      setExito(true);

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      setError(
        error instanceof Error ? error.message : "No se pudo crear la cuenta.",
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center px-6 py-16 md:py-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
              Macralma
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#29251F]">
              Crear cuenta
            </h1>

            <p className="mt-3 leading-relaxed text-[#756B60]">
              Crea tu cuenta para gestionar tus pedidos fácilmente.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E8DED1] bg-white p-8 shadow-sm md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="nombre"
                  className="mb-2 block text-sm font-medium text-[#29251F]"
                >
                  Nombre
                </label>

                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#9A8B78] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#29251F]"
                >
                  Correo electrónico
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#9A8B78] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#29251F]"
                >
                  Contraseña
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#9A8B78] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmarPassword"
                  className="mb-2 block text-sm font-medium text-[#29251F]"
                >
                  Confirmar contraseña
                </label>

                <input
                  id="confirmarPassword"
                  type="password"
                  value={confirmarPassword}
                  onChange={(event) => setConfirmarPassword(event.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#9A8B78] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {exito && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                  <p className="text-sm text-green-700">
                    Cuenta creada correctamente. Redirigiendo al inicio de
                    sesión...
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={cargando || exito}
                className="w-full rounded-full bg-[#29251F] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#403A32] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cargando ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>

            <div className="mt-8 border-t border-[#E8DED1] pt-6 text-center">
              <p className="text-sm text-[#756B60]">¿Ya tienes una cuenta?</p>

              <Link
                href="/login"
                className="mt-2 inline-block text-sm font-semibold text-[#29251F] underline-offset-4 transition-colors hover:text-[#756B60] hover:underline"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[#756B60] underline-offset-4 transition-colors hover:text-[#29251F] hover:underline"
            >
              ← Volver a Macralma
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
