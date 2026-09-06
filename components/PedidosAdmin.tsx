"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

const filtrosEstado = [
  "Todos",
  "Pendiente",
  "Confirmado",
  "En preparación",
  "Enviado",
  "En camino",
  "Entregado",
  "Cancelado",
];

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [actualizando, setActualizando] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await fetch("/api/pedidos");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudieron obtener los pedidos.");
        }

        setPedidos(data);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los pedidos.",
        );
      } finally {
        setCargando(false);
      }
    };

    obtenerPedidos();
  }, []);

  const cambiarEstado = async (pedidoId: string, nuevoEstado: string) => {
    setError("");
    setActualizando(pedidoId);

    try {
      const response = await fetch(`/api/pedidos/${pedidoId}`, {
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
        throw new Error(data.error || "No se pudo actualizar el estado.");
      }

      setPedidos((actuales) =>
        actuales.map((pedido) =>
          pedido._id === pedidoId
            ? {
                ...pedido,
                estado: data.pedido.estado,
              }
            : pedido,
        ),
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el estado.",
      );
    } finally {
      setActualizando(null);
    }
  };

  const pedidosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return pedidos.filter((pedido) => {
      const coincideEstado =
        filtroEstado === "Todos" || pedido.estado === filtroEstado;

      if (!coincideEstado) {
        return false;
      }

      if (!termino) {
        return true;
      }

      const coincideNombre = pedido.cliente.nombre
        .toLowerCase()
        .includes(termino);

      const coincideEmail = pedido.cliente.email
        ?.toLowerCase()
        .includes(termino);

      const coincideTelefono = pedido.cliente.telefono
        .toLowerCase()
        .includes(termino);

      const coincideId = pedido._id.toLowerCase().includes(termino);

      return coincideNombre || coincideEmail || coincideTelefono || coincideId;
    });
  }, [pedidos, busqueda, filtroEstado]);

  if (cargando) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E8DED1] border-t-[#29251F]" />

          <p className="mt-4 text-sm text-[#756B60]">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error && pedidos.length === 0) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* CABECERA */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
            Gestión de pedidos
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-[#29251F] md:text-3xl">
            Pedidos
          </h2>

          <p className="mt-2 text-sm text-[#756B60]">
            Consulta y gestiona los pedidos realizados por tus clientes.
          </p>
        </div>

        <span className="w-fit rounded-full border border-[#E8DED1] bg-white px-4 py-2 text-sm text-[#756B60]">
          {pedidosFiltrados.length}{" "}
          {pedidosFiltrados.length === 1 ? "pedido" : "pedidos"}
        </span>
      </div>

      {/* FILTROS */}
      {pedidos.length > 0 && (
        <div className="mb-8 rounded-2xl border border-[#E8DED1] bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            {/* BUSCADOR */}
            <div className="flex-1">
              <label
                htmlFor="buscar-pedido"
                className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#9A8B78]"
              >
                Buscar pedido
              </label>

              <input
                id="buscar-pedido"
                type="text"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Nombre, email, teléfono o ID..."
                className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#A59C91] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
              />
            </div>

            {/* FILTRO ESTADO */}
            <div className="lg:w-64">
              <label
                htmlFor="filtro-estado"
                className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#9A8B78]"
              >
                Estado
              </label>

              <select
                id="filtro-estado"
                value={filtroEstado}
                onChange={(event) => setFiltroEstado(event.target.value)}
                className="w-full cursor-pointer rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm font-medium text-[#29251F] outline-none transition-all focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
              >
                {filtrosEstado.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            {/* LIMPIAR */}
            {(busqueda || filtroEstado !== "Todos") && (
              <button
                type="button"
                onClick={() => {
                  setBusqueda("");
                  setFiltroEstado("Todos");
                }}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[#CDBCA7] bg-white px-5 text-sm font-medium text-[#29251F] transition-colors hover:bg-[#F1E6D8]"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* RESULTADOS */}
          {(busqueda || filtroEstado !== "Todos") && (
            <p className="mt-4 text-xs text-[#9A8B78]">
              Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos.
            </p>
          )}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* SIN PEDIDOS */}
      {pedidos.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#CDBCA7] bg-[#FAF7F2] py-14 text-center">
          <p className="text-sm font-medium text-[#756B60]">
            Todavía no hay pedidos.
          </p>

          <p className="mt-1 text-xs text-[#9A8B78]">
            Los nuevos pedidos aparecerán aquí.
          </p>
        </div>
      )}

      {/* SIN RESULTADOS */}
      {pedidos.length > 0 && pedidosFiltrados.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#CDBCA7] bg-[#FAF7F2] py-14 text-center">
          <p className="text-sm font-medium text-[#756B60]">
            No encontramos pedidos.
          </p>

          <p className="mt-1 text-xs text-[#9A8B78]">
            Prueba con otro término de búsqueda o cambia el filtro.
          </p>

          <button
            type="button"
            onClick={() => {
              setBusqueda("");
              setFiltroEstado("Todos");
            }}
            className="mt-5 rounded-full border border-[#CDBCA7] bg-white px-5 py-2.5 text-sm font-medium text-[#29251F] transition-colors hover:bg-[#F1E6D8]"
          >
            Ver todos los pedidos
          </button>
        </div>
      )}

      {/* LISTADO */}
      {pedidosFiltrados.length > 0 && (
        <div className="space-y-4">
          {pedidosFiltrados.map((pedido) => {
            const fecha = new Date(pedido.createdAt).toLocaleDateString(
              "es-ES",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              },
            );

            const cantidadProductos = pedido.productos.reduce(
              (total, producto) => total + producto.cantidad,
              0,
            );

            const estadoPagoNormalizado =
              pedido.estadoPago?.toLowerCase() || "pendiente";

            const pagoPagado = estadoPagoNormalizado === "pagado";
            const pagoFallido = estadoPagoNormalizado === "fallido";

            return (
              <article
                key={pedido._id}
                className="rounded-2xl border border-[#E8DED1] bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6"
              >
                <div className="flex flex-col gap-5">
                  {/* INFORMACIÓN PRINCIPAL */}
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-xs uppercase tracking-[0.15em] text-[#9A8B78]">
                          Pedido
                        </p>

                        <span className="text-xs text-[#A59C91]">
                          #{pedido._id.slice(-8)}
                        </span>
                      </div>

                      <h3 className="mt-2 text-lg font-semibold text-[#29251F]">
                        {pedido.cliente.nombre}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#756B60]">
                        <span>{fecha}</span>

                        <span>
                          {cantidadProductos}{" "}
                          {cantidadProductos === 1 ? "producto" : "productos"}
                        </span>

                        <span>{pedido.metodoPago}</span>
                      </div>
                    </div>

                    {/* ESTADO + PAGO + TOTAL + DETALLE */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
                      {/* ESTADO */}
                      <div>
                        <label
                          htmlFor={`estado-${pedido._id}`}
                          className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-[#9A8B78]"
                        >
                          Estado
                        </label>

                        <select
                          id={`estado-${pedido._id}`}
                          value={pedido.estado}
                          disabled={actualizando === pedido._id}
                          onChange={(event) =>
                            cambiarEstado(pedido._id, event.target.value)
                          }
                          className="min-w-44 cursor-pointer rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-2.5 text-sm font-medium text-[#29251F] outline-none transition-all focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {estadosPermitidos.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </select>

                        {actualizando === pedido._id && (
                          <p className="mt-1.5 text-xs text-[#9A8B78]">
                            Guardando...
                          </p>
                        )}
                      </div>

                      {/* ESTADO DEL PAGO */}
                      <div>
                        <p className="mb-1.5 text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                          Pago
                        </p>

                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-2 text-sm font-medium ${
                            pagoPagado
                              ? "border-green-200 bg-green-50 text-green-700"
                              : pagoFallido
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-[#E8DED1] bg-[#FAF7F2] text-[#756B60]"
                          }`}
                        >
                          {pedido.estadoPago || "Pendiente"}
                        </span>
                      </div>

                      {/* TOTAL */}
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                          Total
                        </p>

                        <p className="mt-1 text-xl font-bold text-[#29251F]">
                          {pedido.total.toFixed(2)}€
                        </p>
                      </div>

                      {/* DETALLE */}
                      <Link
                        href={`/admin/pedidos/${pedido._id}`}
                        className="inline-flex items-center justify-center rounded-full border border-[#CDBCA7] bg-[#FAF7F2] px-5 py-2.5 text-sm font-semibold text-[#29251F] transition-all duration-200 hover:bg-[#F1E6D8]"
                      >
                        Ver pedido
                      </Link>
                    </div>
                  </div>

                  {/* PRODUCTOS */}
                  <div className="border-t border-[#E8DED1] pt-5">
                    <div className="flex flex-wrap gap-3">
                      {pedido.productos.map((producto) => (
                        <div
                          key={`${pedido._id}-${producto.productoId}-${producto.talla ?? ""}-${producto.medida ?? ""}-${producto.color ?? ""}`}
                          className="flex items-center gap-3 rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-3 py-2"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F1E6D8]">
                            <Image
                              src={producto.imagen}
                              alt={producto.nombre}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-48 truncate text-sm font-medium text-[#29251F]">
                              {producto.nombre}
                            </p>

                            <p className="mt-0.5 text-xs text-[#756B60]">
                              × {producto.cantidad}
                              {producto.talla && ` · Talla ${producto.talla}`}
                              {producto.medida && ` · ${producto.medida}`}
                              {producto.color && ` · ${producto.color}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* INFORMACIÓN DE ENVÍO */}
                  <div className="border-t border-[#E8DED1] pt-5">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                          Teléfono
                        </p>

                        <p className="mt-1 text-sm text-[#29251F]">
                          {pedido.cliente.telefono}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                          Email
                        </p>

                        <p className="mt-1 truncate text-sm text-[#29251F]">
                          {pedido.cliente.email || "No indicado"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                          Ciudad
                        </p>

                        <p className="mt-1 text-sm text-[#29251F]">
                          {pedido.envio.ciudad}, {pedido.envio.provincia}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
                          Código postal
                        </p>

                        <p className="mt-1 text-sm text-[#29251F]">
                          {pedido.envio.codigoPostal}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
