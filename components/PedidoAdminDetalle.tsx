"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ProductoPedido = {
  productoId: string;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
  talla?: string;
  medida?: string;
  color?: string;
};

type HistorialEstado = {
  estado: string;
  fecha: string;
};

type Pedido = {
  _id: string;
  cliente: {
    nombre: string;
    telefono: string;
    email?: string;
  };
  envio: {
    direccion: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
    pais: string;
  };
  productos: ProductoPedido[];
  total: number;
  estado: string;
  estadoPago: string;
  metodoPago: string;
  createdAt: string;
  historialEstados: HistorialEstado[];
};

const estadosPermitidos = [
  "Pendiente",
  "Confirmado",
  "En preparación",
  "Enviado",
  "En camino",
  "Entregado",
  "Cancelado",
];

export default function PedidoAdminDetalle({
  pedidoInicial,
}: {
  pedidoInicial: Pedido;
}) {
  const [pedido, setPedido] = useState(pedidoInicial);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function cambiarEstado(nuevoEstado: string) {
    if (nuevoEstado === pedido.estado) {
      return;
    }

    setActualizando(true);
    setError("");
    setMensaje("");

    try {
      const response = await fetch(`/api/pedidos/${pedido._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: nuevoEstado,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo actualizar el pedido.");
      }

      setPedido({
        ...pedido,
        estado: data.pedido.estado,
        estadoPago: data.pedido.estadoPago,
        historialEstados: data.pedido.historialEstados,
      });

      setMensaje("Pedido actualizado correctamente.");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el pedido.",
      );
    } finally {
      setActualizando(false);
    }
  }

  const fecha = new Date(pedido.createdAt).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const hora = new Date(pedido.createdAt).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const estadoPago = pedido.estadoPago || "Pendiente";

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14">
        {/* CABECERA */}
        <header className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#756B60] transition-colors hover:text-[#29251F]"
          >
            ← Volver al panel
          </Link>

          <div className="mt-6 border-b border-[#E8DED1] pb-8">
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
              Administración
            </p>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#29251F] md:text-4xl">
                  Detalle del pedido
                </h1>

                <p className="mt-2 text-sm text-[#756B60]">
                  Pedido #{pedido._id.slice(-8)}
                </p>
              </div>

              <div className="text-left md:text-right">
                <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                  Realizado
                </p>

                <p className="mt-1 text-sm text-[#29251F]">
                  {fecha} · {hora}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {/* MENSAJES */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {mensaje && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4">
              <p className="text-sm text-green-700">{mensaje}</p>
            </div>
          )}

          {/* RESUMEN */}
          <section className="grid gap-6 md:grid-cols-3">
            {/* ESTADO */}
            <div className="rounded-2xl border border-[#E8DED1] bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                Estado del pedido
              </p>

              <p className="mt-3 text-xl font-semibold text-[#29251F]">
                {pedido.estado}
              </p>

              <div className="mt-4">
                <label
                  htmlFor="estado-pedido"
                  className="mb-2 block text-xs text-[#756B60]"
                >
                  Cambiar estado
                </label>

                <select
                  id="estado-pedido"
                  value={pedido.estado}
                  disabled={actualizando}
                  onChange={(event) => cambiarEstado(event.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm font-medium text-[#29251F] outline-none transition-all focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {estadosPermitidos.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>

                {actualizando && (
                  <p className="mt-2 text-xs text-[#9A8B78]">
                    Guardando cambios...
                  </p>
                )}
              </div>
            </div>

            {/* PAGO */}
            <div className="rounded-2xl border border-[#E8DED1] bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                Estado del pago
              </p>

              <span
                className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-medium ${
                  estadoPago === "Pagado"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : estadoPago === "Fallido"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-[#E8DED1] bg-[#FAF7F2] text-[#756B60]"
                }`}
              >
                {estadoPago}
              </span>

              <p className="mt-4 text-sm text-[#756B60]">
                Método:{" "}
                <span className="font-medium text-[#29251F]">
                  {pedido.metodoPago}
                </span>
              </p>

              {pedido.metodoPago.toLowerCase() === "whatsapp" &&
                estadoPago === "Pagado" && (
                  <p className="mt-3 text-xs leading-relaxed text-green-700">
                    Pago confirmado manualmente mediante WhatsApp.
                  </p>
                )}
            </div>

            {/* TOTAL */}
            <div className="rounded-2xl border border-[#E8DED1] bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                Total
              </p>

              <p className="mt-3 text-3xl font-bold text-[#29251F]">
                {pedido.total.toFixed(2)}€
              </p>

              <p className="mt-2 text-sm text-[#756B60]">
                {pedido.productos.reduce(
                  (total, producto) => total + producto.cantidad,
                  0,
                )}{" "}
                unidades
              </p>
            </div>
          </section>

          {/* CLIENTE Y ENVÍO */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* CLIENTE */}
            <div className="rounded-2xl border border-[#E8DED1] bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                  Información del cliente
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#29251F]">
                  {pedido.cliente.nombre}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#9A8B78]">Teléfono</p>

                  <p className="mt-1 text-sm text-[#29251F]">
                    {pedido.cliente.telefono}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#9A8B78]">Email</p>

                  <p className="mt-1 break-all text-sm text-[#29251F]">
                    {pedido.cliente.email || "No indicado"}
                  </p>
                </div>
              </div>
            </div>

            {/* ENVÍO */}
            <div className="rounded-2xl border border-[#E8DED1] bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                  Dirección de envío
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#29251F]">
                  {pedido.envio.ciudad}
                </h2>
              </div>

              <div className="space-y-3 text-sm text-[#29251F]">
                <p>{pedido.envio.direccion}</p>

                <p>
                  {pedido.envio.codigoPostal} · {pedido.envio.ciudad}
                </p>

                <p>{pedido.envio.provincia}</p>

                <p>{pedido.envio.pais}</p>
              </div>
            </div>
          </section>

          {/* PRODUCTOS */}
          <section className="rounded-2xl border border-[#E8DED1] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 border-b border-[#E8DED1] pb-5">
              <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                Pedido
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#29251F]">
                Productos
              </h2>
            </div>

            <div className="space-y-5">
              {pedido.productos.map((producto, index) => (
                <div
                  key={`${producto.productoId}-${index}`}
                  className="flex flex-col gap-4 border-b border-[#E8DED1] pb-5 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F1E6D8]">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-[#29251F]">
                      {producto.nombre}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#756B60]">
                      <span>Cantidad: {producto.cantidad}</span>

                      {producto.talla && <span>Talla: {producto.talla}</span>}

                      {producto.medida && (
                        <span>Medida: {producto.medida}</span>
                      )}

                      {producto.color && <span>Color: {producto.color}</span>}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-[#9A8B78]">Precio</p>

                    <p className="mt-1 text-lg font-semibold text-[#29251F]">
                      {(producto.precio * producto.cantidad).toFixed(2)}€
                    </p>

                    <p className="text-xs text-[#756B60]">
                      {producto.precio.toFixed(2)}€ / unidad
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end border-t border-[#E8DED1] pt-6">
              <div className="w-full max-w-xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#756B60]">Total</span>

                  <span className="text-2xl font-bold text-[#29251F]">
                    {pedido.total.toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* HISTORIAL */}
          <section className="rounded-2xl border border-[#E8DED1] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                Seguimiento interno
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#29251F]">
                Historial del pedido
              </h2>
            </div>

            {pedido.historialEstados?.length > 0 ? (
              <div className="space-y-4">
                {pedido.historialEstados
                  .slice()
                  .reverse()
                  .map((item, index, historial) => (
                    <div
                      key={`${item.estado}-${item.fecha}-${index}`}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            index === 0 ? "bg-[#29251F]" : "bg-[#9A8B78]"
                          }`}
                        />

                        {index !== historial.length - 1 && (
                          <div className="mt-2 h-full w-px bg-[#E8DED1]" />
                        )}
                      </div>

                      <div className="pb-4">
                        <p
                          className={`font-medium ${
                            index === 0 ? "text-[#29251F]" : "text-[#756B60]"
                          }`}
                        >
                          {item.estado}
                        </p>

                        <p className="mt-1 text-xs text-[#756B60]">
                          {new Date(item.fecha).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                          ·{" "}
                          {new Date(item.fecha).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-[#756B60]">
                Todavía no hay cambios registrados.
              </p>
            )}
          </section>

          {/* VOLVER */}
          <div className="flex justify-start pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full border border-[#CDBCA7] bg-white px-6 py-3 text-sm font-semibold text-[#29251F] transition-colors hover:bg-[#F1E6D8]"
            >
              ← Volver a pedidos
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
