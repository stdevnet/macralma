"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ProductoPedido = {
  productoId: string;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
  talla: string;
  medida: string;
  color: string;
};

type Pedido = {
  _id: string;
  productos: ProductoPedido[];
  total: number;
  estado: string;
  estadoPago: string;
  metodoPago: string;
  createdAt: string;
};

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarPedidos() {
      try {
        const response = await fetch("/api/usuarios/pedidos");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudieron cargar los pedidos.");
        }

        setPedidos(data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);

        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los pedidos.",
        );
      } finally {
        setCargando(false);
      }
    }

    cargarPedidos();
  }, []);

  if (cargando) {
    return (
      <div className="rounded-3xl border border-[#E8DED1] bg-white p-8 text-center shadow-sm">
        <p className="text-[#756B60]">Cargando tus pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="rounded-3xl border border-[#E8DED1] bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F1E6D8]">
          <span className="text-2xl">🛍️</span>
        </div>

        <h3 className="mt-5 text-xl font-semibold text-[#29251F]">
          Todavía no tienes pedidos
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#756B60]">
          Cuando realices tu primera compra, aparecerá aquí para que puedas
          consultar su estado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {pedidos.map((pedido) => {
        const fecha = new Date(pedido.createdAt).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        return (
          <article
            key={pedido._id}
            className="overflow-hidden rounded-3xl border border-[#E8DED1] bg-white shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-[#E8DED1] p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[#9A8B78]">
                  Pedido
                </p>

                <p className="mt-1 font-mono text-sm text-[#29251F]">
                  #{pedido._id.slice(-8).toUpperCase()}
                </p>

                <p className="mt-1 text-sm text-[#756B60]">{fecha}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#F1E6D8] px-4 py-2 text-xs font-semibold text-[#29251F]">
                  {pedido.estado}
                </span>

                <span className="rounded-full border border-[#E8DED1] px-4 py-2 text-xs font-semibold text-[#756B60]">
                  Pago: {pedido.estadoPago}
                </span>
              </div>
            </div>

            <div className="divide-y divide-[#E8DED1]">
              {pedido.productos.map((producto, index) => (
                <div
                  key={`${producto.productoId}-${index}`}
                  className="flex gap-4 p-6"
                >
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#29251F]">
                      {producto.nombre}
                    </h3>

                    <p className="mt-1 text-sm text-[#756B60]">
                      Cantidad: {producto.cantidad}
                    </p>

                    {(producto.talla || producto.medida || producto.color) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {producto.talla && (
                          <span className="rounded-full bg-[#FAF7F2] px-3 py-1 text-xs text-[#756B60]">
                            Talla: {producto.talla}
                          </span>
                        )}

                        {producto.medida && (
                          <span className="rounded-full bg-[#FAF7F2] px-3 py-1 text-xs text-[#756B60]">
                            Medida: {producto.medida}
                          </span>
                        )}

                        {producto.color && (
                          <span className="rounded-full bg-[#FAF7F2] px-3 py-1 text-xs text-[#756B60]">
                            Color: {producto.color}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="shrink-0 font-semibold text-[#29251F]">
                    {(producto.precio * producto.cantidad).toFixed(2)} €
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-5 border-t border-[#E8DED1] bg-[#FAF7F2] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[#9A8B78]">
                  Método de pago
                </p>

                <p className="mt-1 text-sm font-medium text-[#29251F]">
                  {pedido.metodoPago}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <div className="text-left sm:text-right">
                  <p className="text-sm text-[#756B60]">Total</p>

                  <p className="text-2xl font-bold text-[#29251F]">
                    {pedido.total.toFixed(2)} €
                  </p>
                </div>

                <Link
                  href={`/mi-cuenta/pedidos/${pedido._id}`}
                  className="inline-flex items-center justify-center rounded-full bg-[#29251F] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#403A32] hover:shadow-md"
                >
                  Ver pedido →
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
