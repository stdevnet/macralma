"use client";

import Image from "next/image";
import Link from "next/link";
import { useCarrito } from "@/components/CarritoContext";

export default function CarritoPage() {
  const {
    carrito,
    total,
    cantidadProductos,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useCarrito();

  if (carrito.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF7F2]">
        <section className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-6 py-20">
          <div className="w-full max-w-xl text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
              Tu carrito
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#29251F] md:text-5xl">
              Tu carrito está vacío
            </h1>

            <p className="mx-auto mt-5 max-w-md leading-relaxed text-[#756B60]">
              Todavía no has añadido ninguna pieza. Explora nuestro catálogo y
              encuentra una creación hecha especialmente para ti.
            </p>

            <Link
              href="/catalogo"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#29251F] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#403A32] hover:shadow-md"
            >
              Explorar catálogo
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        {/* CABECERA */}
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
            Macralma
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#29251F] md:text-5xl">
                Tu carrito
              </h1>

              <p className="mt-3 text-[#756B60]">
                {cantidadProductos === 1
                  ? "1 producto en tu carrito"
                  : `${cantidadProductos} productos en tu carrito`}
              </p>
            </div>

            <button
              type="button"
              onClick={vaciarCarrito}
              className="w-fit text-sm font-medium text-[#756B60] underline decoration-[#CDBCA7] underline-offset-4 transition-colors hover:text-[#29251F]"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* PRODUCTOS */}
          <div className="space-y-4">
            {carrito.map((producto) => {
              const subtotal = producto.precio * producto.cantidad;

              return (
                <article
                  key={`${producto.productoId}-${producto.talla ?? ""}-${producto.medida ?? ""}-${producto.color ?? ""}`}
                  className="rounded-2xl border border-[#E8DED1] bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* IMAGEN */}
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#F1E6D8] sm:h-36 sm:w-36">
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        fill
                        sizes="(max-width: 640px) 112px, 144px"
                        className="object-cover"
                      />
                    </div>

                    {/* INFORMACIÓN */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.15em] text-[#9A8B78]">
                            Hecho a mano
                          </p>

                          <h2 className="mt-1 text-lg font-semibold text-[#29251F] sm:text-xl">
                            {producto.nombre}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            eliminarDelCarrito(
                              producto.productoId,
                              producto.talla,
                              producto.medida,
                              producto.color,
                            )
                          }
                          aria-label={`Eliminar ${producto.nombre} del carrito`}
                          className="shrink-0 text-sm text-[#9A8B78] transition-colors hover:text-[#29251F]"
                        >
                          Eliminar
                        </button>
                      </div>

                      {/* OPCIONES */}
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#756B60]">
                        {producto.talla && (
                          <span>
                            Talla:{" "}
                            <strong className="font-medium text-[#29251F]">
                              {producto.talla}
                            </strong>
                          </span>
                        )}

                        {producto.medida && (
                          <span>
                            Medida:{" "}
                            <strong className="font-medium text-[#29251F]">
                              {producto.medida}
                            </strong>
                          </span>
                        )}

                        {producto.color && (
                          <span>
                            Color:{" "}
                            <strong className="font-medium text-[#29251F]">
                              {producto.color}
                            </strong>
                          </span>
                        )}
                      </div>

                      {/* PRECIO + CANTIDAD */}
                      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                            Precio
                          </p>

                          <p className="mt-1 text-sm text-[#756B60]">
                            {producto.precio.toFixed(2)}€ / unidad
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center overflow-hidden rounded-full border border-[#E8DED1] bg-[#FAF7F2]">
                            <button
                              type="button"
                              onClick={() =>
                                disminuirCantidad(
                                  producto.productoId,
                                  producto.talla,
                                  producto.medida,
                                  producto.color,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-lg text-[#756B60] transition-colors hover:bg-[#F1E6D8] hover:text-[#29251F]"
                              aria-label="Disminuir cantidad"
                            >
                              −
                            </button>

                            <span className="flex h-9 min-w-9 items-center justify-center text-sm font-semibold text-[#29251F]">
                              {producto.cantidad}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                aumentarCantidad(
                                  producto.productoId,
                                  producto.talla,
                                  producto.medida,
                                  producto.color,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-lg text-[#756B60] transition-colors hover:bg-[#F1E6D8] hover:text-[#29251F]"
                              aria-label="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-lg font-semibold text-[#29251F]">
                            {subtotal.toFixed(2)}€
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* RESUMEN */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#E8DED1] bg-[#F1E6D8] p-6 md:p-7">
              <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                Resumen
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#29251F]">
                Tu pedido
              </h2>

              <div className="my-6 h-px bg-[#E8DED1]" />

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-[#756B60]">
                  <span>Productos</span>

                  <span>{cantidadProductos}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-[#756B60]">
                  <span>Subtotal</span>

                  <span>{total.toFixed(2)}€</span>
                </div>

                <div className="flex items-center justify-between text-sm text-[#756B60]">
                  <span>Envío</span>

                  <span>Por calcular</span>
                </div>
              </div>

              <div className="my-6 h-px bg-[#E8DED1]" />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-[#29251F]">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#29251F]">
                  {total.toFixed(2)}€
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#29251F] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#403A32] hover:shadow-md"
              >
                Continuar con el pedido
              </Link>

              <Link
                href="/catalogo"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[#CDBCA7] bg-[#FAF7F2] px-5 py-3.5 text-sm font-semibold text-[#29251F] transition-all duration-300 hover:bg-white"
              >
                Seguir comprando
              </Link>

              <p className="mt-5 text-center text-xs leading-relaxed text-[#756B60]">
                El coste de envío se calculará antes de confirmar tu pedido.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
