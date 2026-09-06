"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type ProductoPedido = {
  nombre: string;
  cantidad: number;
  precio: number;
  talla?: string;
  medida?: string;
  color?: string;
};

type Pedido = {
  _id: string;
  total: number;
  metodoPago: string;
  productos: ProductoPedido[];
};

function ConfirmadoContenido() {
  const searchParams = useSearchParams();

  const pedidoId = searchParams.get("id");
  const token = searchParams.get("token");

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const numeroWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const numeroPedido = pedidoId ? pedidoId.slice(-8) : "";

  useEffect(() => {
    if (!pedidoId || !token) {
      setCargando(false);
      return;
    }

    async function obtenerPedido() {
      try {
        const response = await fetch(
          `/api/pedidos/${pedidoId}?token=${encodeURIComponent(token)}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudo obtener el pedido.");
        }

        setPedido(data);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "No se pudo obtener el pedido.",
        );
      } finally {
        setCargando(false);
      }
    }

    obtenerPedido();
  }, [pedidoId, token]);

  const urlSeguimiento = useMemo(() => {
    if (!pedidoId || !token) {
      return "";
    }

    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/pedido/${pedidoId}?token=${encodeURIComponent(
      token,
    )}`;
  }, [pedidoId, token]);

  const mensajeWhatsapp = useMemo(() => {
    if (!pedidoId || !token || !pedido || !urlSeguimiento) {
      return "";
    }

    const productosTexto = pedido.productos
      .map((producto) => {
        const variantes: string[] = [];

        if (producto.talla) {
          variantes.push(`Talla: ${producto.talla}`);
        }

        if (producto.medida) {
          variantes.push(`Medida: ${producto.medida}`);
        }

        if (producto.color) {
          variantes.push(`Color: ${producto.color}`);
        }

        const detalles =
          variantes.length > 0 ? `\n  ${variantes.join(" · ")}` : "";

        return `• ${producto.nombre} × ${producto.cantidad}${detalles}`;
      })
      .join("\n");

    return `Hola, acabo de realizar un pedido en Macralma.

🧾 Pedido: #${numeroPedido}

🛍️ Productos:
${productosTexto}

💰 Total: ${pedido.total.toFixed(2)} €

🔗 Ver mi pedido:
${urlSeguimiento}

Quiero completar el pago de mi pedido.`;
  }, [pedidoId, token, pedido, urlSeguimiento, numeroPedido]);

  const enlaceWhatsapp =
    numeroWhatsapp && mensajeWhatsapp
      ? `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(
          mensajeWhatsapp,
        )}`
      : "#";

  if (!pedidoId || !token) {
    return (
      <main className="min-h-screen bg-[#FAF7F2]">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-20">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
              Macralma
            </p>

            <h1 className="mt-4 text-3xl font-bold text-[#29251F]">
              No podemos encontrar tu pedido
            </h1>

            <p className="mt-4 text-[#756B60]">
              El enlace de confirmación no es válido.
            </p>

            <Link
              href="/catalogo"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#29251F] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#403A32]"
            >
              Volver al catálogo
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <div className="text-sm text-[#756B60]">
          Cargando información del pedido...
        </div>
      </main>
    );
  }

  if (error || !pedido) {
    return (
      <main className="min-h-screen bg-[#FAF7F2]">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-20">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
              Macralma
            </p>

            <h1 className="mt-4 text-3xl font-bold text-[#29251F]">
              No podemos cargar tu pedido
            </h1>

            <p className="mt-4 text-[#756B60]">
              Comprueba el enlace o vuelve a intentarlo más tarde.
            </p>

            <Link
              href="/catalogo"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#29251F] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#403A32]"
            >
              Volver al catálogo
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const esWhatsapp = pedido.metodoPago.toLowerCase() === "whatsapp";

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center px-6 py-16">
        <div className="w-full rounded-3xl border border-[#E8DED1] bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F1E6D8]">
            <span className="text-3xl text-[#29251F]">✓</span>
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#9A8B78]">
            Macralma
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#29251F] md:text-4xl">
            ¡Pedido recibido!
          </h1>

          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[#756B60]">
            Hemos recibido correctamente tu pedido.
            {esWhatsapp &&
              " Para completar el pago, continúa la conversación por WhatsApp."}
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#E8DED1] bg-[#FAF7F2] p-6 text-left">
            <div className="flex items-center justify-between border-b border-[#E8DED1] pb-4">
              <span className="text-sm text-[#756B60]">Número de pedido</span>

              <span className="font-semibold text-[#29251F]">
                #{numeroPedido}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-[#756B60]">Método de pago</span>

              <span className="font-semibold text-[#29251F]">
                {pedido.metodoPago}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#E8DED1] pt-4">
              <span className="text-sm text-[#756B60]">Total</span>

              <span className="text-xl font-bold text-[#29251F]">
                {pedido.total.toFixed(2)} €
              </span>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#E8DED1] bg-white p-6 text-left">
            <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
              Productos
            </p>

            <div className="mt-4 space-y-4">
              {pedido.productos.map((producto, index) => (
                <div
                  key={`${producto.nombre}-${index}`}
                  className="border-b border-[#E8DED1] pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#29251F]">
                        {producto.nombre}
                      </p>

                      <p className="mt-1 text-sm text-[#756B60]">
                        Cantidad: {producto.cantidad}
                      </p>

                      {(producto.talla ||
                        producto.medida ||
                        producto.color) && (
                        <div className="mt-2 space-y-1 text-xs text-[#756B60]">
                          {producto.talla && <p>Talla: {producto.talla}</p>}

                          {producto.medida && <p>Medida: {producto.medida}</p>}

                          {producto.color && <p>Color: {producto.color}</p>}
                        </div>
                      )}
                    </div>

                    <p className="shrink-0 font-semibold text-[#29251F]">
                      {(producto.precio * producto.cantidad).toFixed(2)} €
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {esWhatsapp && (
            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#E8DED1] bg-[#F1E6D8] p-5 text-left">
              <p className="text-sm font-semibold text-[#29251F]">
                Siguiente paso
              </p>

              <p className="mt-2 text-sm leading-relaxed text-[#756B60]">
                Pulsa el botón de WhatsApp para contactar con nosotros. El
                mensaje incluirá automáticamente tu número de pedido, productos,
                total y enlace de seguimiento.
              </p>
            </div>
          )}

          {esWhatsapp &&
            (numeroWhatsapp ? (
              <a
                href={enlaceWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full max-w-md items-center justify-center rounded-full bg-[#29251F] px-7 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#403A32] hover:shadow-md"
              >
                Continuar por WhatsApp
              </a>
            ) : (
              <div className="mx-auto mt-8 max-w-md rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-left">
                <p className="text-sm font-medium text-red-700">
                  El número de WhatsApp de la tienda todavía no está
                  configurado.
                </p>

                <p className="mt-1 text-xs text-red-600">
                  Configura NEXT_PUBLIC_WHATSAPP_NUMBER en las variables de
                  entorno.
                </p>
              </div>
            ))}

          <Link
            href={`/pedido/${pedidoId}?token=${encodeURIComponent(token)}`}
            className="mt-4 inline-flex w-full max-w-md items-center justify-center rounded-full border border-[#CDBCA7] bg-white px-7 py-4 text-sm font-semibold text-[#29251F] transition-colors hover:bg-[#F1E6D8]"
          >
            Ver mi pedido
          </Link>

          <Link
            href="/catalogo"
            className="mt-6 inline-block text-sm text-[#756B60] underline-offset-4 transition-colors hover:text-[#29251F] hover:underline"
          >
            Volver al catálogo
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
          <div className="text-sm text-[#756B60]">Cargando...</div>
        </main>
      }
    >
      <ConfirmadoContenido />
    </Suspense>
  );
}
