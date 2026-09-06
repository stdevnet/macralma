"use client";

import Image from "next/image";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

type NavbarProps = {
  nombre: string;
};

export default function Navbar({ nombre }: NavbarProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [silenciado, setSilenciado] = useState(false);
  const [sesionCargada, setSesionCargada] = useState(false);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intentoReproduccion = useRef(false);

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  useEffect(() => {
    async function comprobarSesion() {
      try {
        const session = await getSession();
        setUsuarioAutenticado(!!session?.user);
      } catch {
        setUsuarioAutenticado(false);
      } finally {
        setSesionCargada(true);
      }
    }

    comprobarSesion();
  }, []);

  useEffect(() => {
    const audio = new Audio("/chill.mp3");
    audio.loop = true;
    audio.volume = 0.35;

    const silencioGuardado = localStorage.getItem("musica-silenciada");

    if (silencioGuardado === "true") {
      audio.muted = true;
      setSilenciado(true);
    }

    audioRef.current = audio;

    const reproducir = async () => {
      if (intentoReproduccion.current) return;

      intentoReproduccion.current = true;

      try {
        await audio.play();
      } catch {
        intentoReproduccion.current = false;
      }
    };

    reproducir();

    const iniciarConInteraccion = () => {
      reproducir();

      document.removeEventListener("click", iniciarConInteraccion);
      document.removeEventListener("touchstart", iniciarConInteraccion);
      document.removeEventListener("keydown", iniciarConInteraccion);
    };

    document.addEventListener("click", iniciarConInteraccion);
    document.addEventListener("touchstart", iniciarConInteraccion);
    document.addEventListener("keydown", iniciarConInteraccion);

    return () => {
      audio.pause();
      audio.currentTime = 0;

      document.removeEventListener("click", iniciarConInteraccion);
      document.removeEventListener("touchstart", iniciarConInteraccion);
      document.removeEventListener("keydown", iniciarConInteraccion);
    };
  }, []);

  const alternarMusica = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.muted) {
      audio.muted = false;
      setSilenciado(false);
      localStorage.setItem("musica-silenciada", "false");

      try {
        await audio.play();
      } catch {
        console.log("No se pudo reproducir la música.");
      }
    } else {
      audio.muted = true;
      setSilenciado(true);
      localStorage.setItem("musica-silenciada", "true");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E8DED1] bg-[#FAF7F2]/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            onClick={cerrarMenu}
            className="relative z-10 inline-flex w-fit items-center transition-opacity duration-300 hover:opacity-70"
          >
            <Image
              src="/images/MACRALMA1.png"
              alt={nombre}
              width={320}
              height={120}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-[#756B60] transition-colors duration-300 hover:text-[#29251F]"
            >
              Inicio
            </Link>

            <Link
              href="/catalogo"
              className="text-sm font-medium text-[#756B60] transition-colors duration-300 hover:text-[#29251F]"
            >
              Catálogo
            </Link>

            <Link
              href="/sobre-nosotros"
              className="text-sm font-medium text-[#756B60] transition-colors duration-300 hover:text-[#29251F]"
            >
              Sobre nosotros
            </Link>

            <Link
              href="/contacto"
              className="text-sm font-medium text-[#756B60] transition-colors duration-300 hover:text-[#29251F]"
            >
              Contacto
            </Link>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              onClick={alternarMusica}
              aria-label={silenciado ? "Activar música" : "Silenciar música"}
              title={silenciado ? "Activar música" : "Silenciar música"}
              className="mr-2 flex items-center justify-center text-[#29251F] transition-opacity duration-200 hover:opacity-60"
            >
              {silenciado ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M4 9V15H8L13 19V5L8 9H4Z" fill="currentColor" />
                  <path
                    d="M16 9L21 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                  <path
                    d="M21 9L16 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M4 9V15H8L13 19V5L8 9H4Z" fill="currentColor" />
                  <path
                    d="M16 9C17.2 10.2 17.2 13.8 16 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                  <path
                    d="M18.5 6.5C21.5 9.5 21.5 14.5 18.5 17.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              )}
            </button>

            {sesionCargada &&
              (usuarioAutenticado ? (
                <>
                  <Link
                    href="/carrito"
                    aria-label="Carrito"
                    title="Carrito"
                    className="flex items-center justify-center text-[#29251F] transition-opacity duration-200 hover:opacity-60"
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 4H5L7.4 15.2C7.6 16.2 8.5 17 9.6 17H18.2C19.2 17 20.1 16.3 20.4 15.3L22 9H6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="10" cy="20" r="1.5" fill="currentColor" />
                      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                    </svg>
                  </Link>

                  <Link
                    href="/mi-cuenta"
                    className="text-sm font-medium text-[#756B60] transition-colors duration-300 hover:text-[#29251F]"
                  >
                    Mi cuenta
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-[#29251F] transition-colors duration-300 hover:text-[#756B60]"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/registro"
                    className="rounded-full bg-[#29251F] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#403A32] hover:shadow-md"
                  >
                    Sign up
                  </Link>
                </>
              ))}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={alternarMusica}
              aria-label={silenciado ? "Activar música" : "Silenciar música"}
              title={silenciado ? "Activar música" : "Silenciar música"}
              className="flex items-center justify-center text-[#29251F] transition-opacity duration-200 hover:opacity-60"
            >
              {silenciado ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M4 9V15H8L13 19V5L8 9H4Z" fill="currentColor" />
                  <path
                    d="M16 9L21 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                  <path
                    d="M21 9L16 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M4 9V15H8L13 19V5L8 9H4Z" fill="currentColor" />
                  <path
                    d="M16 9C17.2 10.2 17.2 13.8 16 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                  <path
                    d="M18.5 6.5C21.5 9.5 21.5 14.5 18.5 17.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuAbierto}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DED1] bg-white text-[#29251F] transition-all duration-300 hover:bg-[#F1E6D8]"
            >
              <span className="text-xl leading-none">
                {menuAbierto ? "×" : "☰"}
              </span>
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menuAbierto ? "max-h-[600px] pb-6 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-[#E8DED1] pt-4">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={cerrarMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#756B60] transition-colors duration-300 hover:bg-[#F1E6D8] hover:text-[#29251F]"
              >
                Inicio
              </Link>

              <Link
                href="/catalogo"
                onClick={cerrarMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#756B60] transition-colors duration-300 hover:bg-[#F1E6D8] hover:text-[#29251F]"
              >
                Catálogo
              </Link>

              <Link
                href="/sobre-nosotros"
                onClick={cerrarMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#756B60] transition-colors duration-300 hover:bg-[#F1E6D8] hover:text-[#29251F]"
              >
                Sobre nosotros
              </Link>

              <Link
                href="/contacto"
                onClick={cerrarMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#756B60] transition-colors duration-300 hover:bg-[#F1E6D8] hover:text-[#29251F]"
              >
                Contacto
              </Link>

              {sesionCargada &&
                (usuarioAutenticado ? (
                  <>
                    <Link
                      href="/carrito"
                      onClick={cerrarMenu}
                      className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#29251F] transition-colors duration-300 hover:bg-[#F1E6D8]"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 4H5L7.4 15.2C7.6 16.2 8.5 17 9.6 17H18.2C19.2 17 20.1 16.3 20.4 15.3L22 9H6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="10" cy="20" r="1.5" fill="currentColor" />
                        <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                      </svg>
                      Carrito
                    </Link>

                    <Link
                      href="/mi-cuenta"
                      onClick={cerrarMenu}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-[#29251F] transition-colors duration-300 hover:bg-[#F1E6D8]"
                    >
                      Mi cuenta
                    </Link>
                  </>
                ) : (
                  <div className="mt-2 flex flex-col gap-2 border-t border-[#E8DED1] pt-4">
                    <Link
                      href="/login"
                      onClick={cerrarMenu}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-[#29251F] transition-colors duration-300 hover:bg-[#F1E6D8]"
                    >
                      Sign in
                    </Link>

                    <Link
                      href="/registro"
                      onClick={cerrarMenu}
                      className="rounded-full bg-[#29251F] px-5 py-3 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-[#403A32]"
                    >
                      Sign up
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
