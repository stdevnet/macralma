"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  historialEstados: HistorialEstado[];
  createdAt: string;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const estadosPedido = [
  "Pendiente",
  "Confirmado",
  "En preparación",
  "Enviado",
  "En camino",
  "Entregado",
];

export default function PedidoPage({ params }: Props) {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [id, setId] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const obtenerParametros = async () => {
      const datos = await params;

      const parametros = new URLSearchParams(window.location.search);

      setId(datos.id);
      setToken(parametros.get("token") || "");
    };

    obtenerParametros();
  }, [params]);

  useEffect(() => {
    if (!id || !token) {
      if (id && !token) {
        setCargando(false);
        setError("No tienes un enlace válido para consultar este pedido.");
      }

      return;
    }

    let intervalo: ReturnType<typeof setInterval> | null = null;
    let seguimientoActivo = true;

    const obtenerPedido = async (mostrarCarga = false) => {
      try {
        if (mostrarCarga) {
          setCargando(true);
        }

        const response = await fetch(
          `/api/pedidos/${id}?token=${encodeURIComponent(token)}`,
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudo obtener el pedido.");
        }

        setPedido(data);
        setError("");

        return data as Pedido;
      } catch (error) {
        console.error("Error al obtener el pedido:", error);

        if (mostrarCarga) {
          setError(
            error instanceof Error
              ? error.message
              : "No se pudo cargar el pedido.",
          );
        }

        return null;
      } finally {
        if (mostrarCarga) {
          setCargando(false);
        }
      }
    };

    const actualizarPedido = async () => {
      if (!seguimientoActivo) return;

      const pedidoActual = await obtenerPedido(false);

      if (!pedidoActual) return;

      if (
        pedidoActual.estado === "Entregado" ||
        pedidoActual.estado === "Cancelado"
      ) {
        seguimientoActivo = false;

        if (intervalo) {
          clearInterval(intervalo);
          intervalo = null;
        }
      }
    };

    const iniciarSeguimiento = async () => {
      const pedidoInicial = await obtenerPedido(true);

      if (!pedidoInicial) return;

      if (
        pedidoInicial.estado === "Entregado" ||
        pedidoInicial.estado === "Cancelado"
      ) {
        seguimientoActivo = false;
        return;
      }

      intervalo = setInterval(actualizarPedido, 10000);
    };

    iniciarSeguimiento();

    return () => {
      seguimientoActivo = false;

      if (intervalo) {
        clearInterval(intervalo);
      }
    };
  }, [id, token]);

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#E8DED1] border-t-[#29251F]" />

          <p className="mt-5 text-sm text-[#756B60]">Cargando tu pedido...</p>
        </div>
      </main>
    );
  }

  if (error || !pedido) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-6">
        <div className="max-w-lg text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
            Macralma
          </p>

          <h1 className="mt-4 text-3xl font-bold text-[#29251F]">
            No encontramos tu pedido
          </h1>

          <p className="mt-4 leading-relaxed text-[#756B60]">
            {error || "No ha sido posible cargar la información del pedido."}
          </p>

          <Link
            href="/catalogo"
            className="mt-8 inline-flex rounded-full bg-[#29251F] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#403A32] hover:shadow-md"
          >
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  const fecha = new Date(pedido.createdAt).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const fechaEstado = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const horaEstado = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const historial = pedido.historialEstados || [];

  const estaCancelado = pedido.estado === "Cancelado";

  const obtenerEstadoHistorial = (estado: string) => {
    return historial.find((item) => item.estado === estado);
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        {/* CONFIRMACIÓN */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8D8C3]">
            <span className="text-2xl text-[#29251F]">✓</span>
          </div>

          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
            Pedido realizado
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#29251F] md:text-5xl">
            ¡Gracias por tu pedido!
          </h1>

          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-[#756B60]">
            Hemos recibido correctamente tu pedido. A continuación puedes
            consultar todos los detalles.
          </p>
        </div>

        {/* INFORMACIÓN DEL PEDIDO */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#E8DED1] bg-white p-6">
            <p className="text-xs uppercase tracking-[0.15em] text-[#9A8B78]">
              Pedido
            </p>

            <p className="mt-2 break-all text-sm font-semibold text-[#29251F]">
              #{pedido._id}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8DED1] bg-white p-6">
            <p className="text-xs uppercase tracking-[0.15em] text-[#9A8B78]">
              Fecha
            </p>

            <p className="mt-2 text-sm font-semibold capitalize text-[#29251F]">
              {fecha}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8DED1] bg-white p-6">
            <p className="text-xs uppercase tracking-[0.15em] text-[#9A8B78]">
              Estado
            </p>

            <p className="mt-2 text-sm font-semibold text-[#29251F]">
              {pedido.estado}
            </p>
          </div>
        </div>

        {/* SEGUIMIENTO */}
        <section className="mx-auto mt-8 max-w-5xl rounded-2xl border border-[#E8DED1] bg-white p-6 md:p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
              Seguimiento
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#29251F]">
              Estado de tu pedido
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-[#756B60]">
              Puedes consultar aquí el progreso de tu pedido.
            </p>
          </div>

          {estaCancelado ? (
            <div className="rounded-2xl border border-[#E8DED1] bg-[#FAF7F2] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#29251F] text-white">
                  ×
                </div>

                <div>
                  <p className="font-semibold text-[#29251F]">
                    Pedido cancelado
                  </p>

                  {obtenerEstadoHistorial("Cancelado") && (
                    <p className="mt-1 text-sm text-[#756B60]">
                      {fechaEstado(obtenerEstadoHistorial("Cancelado")!.fecha)}{" "}
                      · {horaEstado(obtenerEstadoHistorial("Cancelado")!.fecha)}
                    </p>
                  )}

                  <p className="mt-3 text-sm leading-relaxed text-[#756B60]">
                    Este pedido ha sido cancelado. Si necesitas más información,
                    puedes ponerte en contacto con nosotros.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {estadosPedido.map((estado, indice) => {
                const registro = obtenerEstadoHistorial(estado);

                const completado = Boolean(registro);

                const actual = pedido.estado === estado;

                const ultimo = indice === estadosPedido.length - 1;

                return (
                  <div key={estado} className="relative flex min-h-20 gap-4">
                    {!ultimo && (
                      <div
                        className={`absolute left-[15px] top-8 h-full w-px ${
                          completado ? "bg-[#9A8B78]" : "bg-[#E8DED1]"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                        actual
                          ? "border-[#29251F] bg-[#29251F] text-white"
                          : completado
                            ? "border-[#9A8B78] bg-[#F1E6D8] text-[#29251F]"
                            : "border-[#E8DED1] bg-[#FAF7F2] text-transparent"
                      }`}
                    >
                      {completado && "✓"}
                    </div>

                    <div className="pb-6">
                      <p
                        className={`text-sm font-semibold ${
                          actual || completado
                            ? "text-[#29251F]"
                            : "text-[#B0A79C]"
                        }`}
                      >
                        {estado}
                      </p>

                      {registro ? (
                        <p className="mt-1 text-xs text-[#756B60]">
                          {fechaEstado(registro.fecha)} ·{" "}
                          {horaEstado(registro.fecha)}
                          {actual && (
                            <span className="ml-2 font-medium text-[#9A8B78]">
                              · Actual
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-[#B0A79C]">Pendiente</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* CONTENIDO */}
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          {/* PRODUCTOS */}
          <section className="rounded-2xl border border-[#E8DED1] bg-white p-6 md:p-8">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                Tu pedido
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#29251F]">
                Productos
              </h2>
            </div>

            <div className="space-y-5">
              {pedido.productos.map((producto) => (
                <div
                  key={`${producto.productoId}-${producto.talla ?? ""}-${producto.medida ?? ""}-${producto.color ?? ""}`}
                  className="flex gap-4 border-b border-[#E8DED1] pb-5 last:border-0 last:pb-0"
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
                    <h3 className="font-semibold text-[#29251F]">
                      {producto.nombre}
                    </h3>

                    <div className="mt-2 space-y-1 text-sm text-[#756B60]">
                      {producto.talla && <p>Talla: {producto.talla}</p>}

                      {producto.medida && <p>Medida: {producto.medida}</p>}

                      {producto.color && <p>Color: {producto.color}</p>}

                      <p>Cantidad: {producto.cantidad}</p>
                    </div>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-[#29251F]">
                    {(producto.precio * producto.cantidad).toFixed(2)}€
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* RESUMEN */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-[#E8DED1] bg-[#F1E6D8] p-6 md:p-7">
              <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                Resumen
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#29251F]">
                Total
              </h2>

              <div className="my-6 h-px bg-[#E8DED1]" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#756B60]">Productos</span>

                <span className="text-sm text-[#29251F]">
                  {pedido.productos.reduce(
                    (total, producto) => total + producto.cantidad,
                    0,
                  )}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-[#756B60]">Método de pago</span>

                <span className="text-sm font-medium text-[#29251F]">
                  {pedido.metodoPago}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-[#756B60]">Estado del pago</span>

                <span className="text-sm font-medium text-[#29251F]">
                  {pedido.estadoPago}
                </span>
              </div>

              <div className="my-6 h-px bg-[#E8DED1]" />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#29251F]">Total</span>

                <span className="text-2xl font-bold text-[#29251F]">
                  {pedido.total.toFixed(2)}€
                </span>
              </div>
            </div>

            {/* ENVÍO */}
            <div className="rounded-2xl border border-[#E8DED1] bg-white p-6 md:p-7">
              <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                Envío
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#29251F]">
                Dirección
              </h2>

              <div className="mt-5 space-y-1 text-sm leading-relaxed text-[#756B60]">
                <p className="font-medium text-[#29251F]">
                  {pedido.cliente.nombre}
                </p>

                <p>{pedido.envio.direccion}</p>

                <p>
                  {pedido.envio.codigoPostal} {pedido.envio.ciudad}
                </p>

                <p>{pedido.envio.provincia}</p>

                <p>{pedido.envio.pais}</p>

                <p className="pt-2">{pedido.cliente.telefono}</p>

                {pedido.cliente.email && <p>{pedido.cliente.email}</p>}
              </div>
            </div>
          </aside>
        </div>

        {/* ACCIONES */}
        <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center rounded-full bg-[#29251F] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#403A32] hover:shadow-md"
          >
            Seguir comprando
          </Link>
        </div>
      </section>
    </main>
  );
}
