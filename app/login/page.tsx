"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setCargando(true);

    try {
      const resultado = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/mi-cuenta",
      });

      if (!resultado || resultado.error) {
        setError("Correo o contraseña incorrectos.");
        return;
      }

      window.location.href = "/mi-cuenta";
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      setError("Ha ocurrido un error al iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
              Macralma
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#29251F]">
              Iniciar sesión
            </h1>

            <p className="mt-3 leading-relaxed text-[#756B60]">
              Accede a tu cuenta para consultar y gestionar tus pedidos.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E8DED1] bg-white p-8 shadow-sm md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#9A8B78] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full rounded-full bg-[#29251F] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#403A32] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>

            <div className="mt-8 border-t border-[#E8DED1] pt-6 text-center">
              <p className="text-sm text-[#756B60]">¿No tienes una cuenta?</p>

              <Link
                href="/registro"
                className="mt-2 inline-block text-sm font-semibold text-[#29251F] underline-offset-4 transition-colors hover:text-[#756B60] hover:underline"
              >
                Crear una cuenta
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
