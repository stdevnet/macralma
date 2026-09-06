"use client";

import { useEffect, useMemo, useState } from "react";
import FormularioProducto from "@/components/FormularioProducto";
import BuscadorProductos from "@/components/BuscadorProductos";
import PedidosAdmin from "@/components/PedidosAdmin";

type Producto = {
  _id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  imagenPublicId: string;
  categoria: "prendas" | "mascotas" | "adornos";
  subcategoria?: "prendas" | "accesorios" | null;
  tallas: string[];
  medidas: string[];
  colores: string[];
  disponibilidad: string;
  whatsapp: string;
};

type Pedido = {
  _id: string;
  estado: string;
};

type AdminDashboardProps = {
  productos: Producto[];
};

type Seccion = "resumen" | "productos" | "añadir" | "pedidos";

export default function AdminDashboard({ productos }: AdminDashboardProps) {
  const [seccion, setSeccion] = useState<Seccion>("resumen");

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await fetch("/api/pedidos");

        if (!response.ok) {
          throw new Error("No se pudieron obtener los pedidos.");
        }

        const data = await response.json();

        setPedidos(data);
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
      } finally {
        setCargandoPedidos(false);
      }
    };

    obtenerPedidos();
  }, []);

  const totalProductos = productos.length;

  const totalPedidos = pedidos.length;

  const pedidosPendientes = pedidos.filter(
    (pedido) => pedido.estado === "Pendiente",
  ).length;

  const pedidosPreparacion = pedidos.filter(
    (pedido) => pedido.estado === "En preparación",
  ).length;

  const estadisticas = useMemo(
    () => [
      {
        titulo: "Productos",
        valor: totalProductos,
        descripcion: "productos en catálogo",
      },
      {
        titulo: "Pedidos",
        valor: cargandoPedidos ? "—" : totalPedidos,
        descripcion: "pedidos realizados",
      },
      {
        titulo: "Pendientes",
        valor: cargandoPedidos ? "—" : pedidosPendientes,
        descripcion: "requieren atención",
      },
      {
        titulo: "En preparación",
        valor: cargandoPedidos ? "—" : pedidosPreparacion,
        descripcion: "pedidos en proceso",
      },
    ],
    [
      totalProductos,
      totalPedidos,
      pedidosPendientes,
      pedidosPreparacion,
      cargandoPedidos,
    ],
  );

  const cambiarSeccion = (nuevaSeccion: Seccion) => {
    setSeccion(nuevaSeccion);
  };

  return (
    <div>
      {/* NAVEGACIÓN */}
      <nav className="mb-10 border-b border-[#E8DED1]">
        <div className="flex overflow-x-auto">
          <button
            type="button"
            onClick={() => cambiarSeccion("resumen")}
            className={`relative mr-8 shrink-0 px-1 pb-4 text-sm font-medium transition-colors ${
              seccion === "resumen"
                ? "text-[#29251F]"
                : "text-[#756B60] hover:text-[#29251F]"
            }`}
          >
            Resumen
            {seccion === "resumen" && (
              <span className="absolute bottom-0 left-0 h-px w-full bg-[#29251F]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => cambiarSeccion("productos")}
            className={`relative mr-8 shrink-0 px-1 pb-4 text-sm font-medium transition-colors ${
              seccion === "productos"
                ? "text-[#29251F]"
                : "text-[#756B60] hover:text-[#29251F]"
            }`}
          >
            Productos
            {seccion === "productos" && (
              <span className="absolute bottom-0 left-0 h-px w-full bg-[#29251F]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => cambiarSeccion("añadir")}
            className={`relative mr-8 shrink-0 px-1 pb-4 text-sm font-medium transition-colors ${
              seccion === "añadir"
                ? "text-[#29251F]"
                : "text-[#756B60] hover:text-[#29251F]"
            }`}
          >
            Añadir producto
            {seccion === "añadir" && (
              <span className="absolute bottom-0 left-0 h-px w-full bg-[#29251F]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => cambiarSeccion("pedidos")}
            className={`relative flex shrink-0 items-center gap-2 px-1 pb-4 text-sm font-medium transition-colors ${
              seccion === "pedidos"
                ? "text-[#29251F]"
                : "text-[#756B60] hover:text-[#29251F]"
            }`}
          >
            Pedidos
            {pedidosPendientes > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#29251F] px-1.5 text-[10px] font-semibold text-white">
                {pedidosPendientes}
              </span>
            )}
            {seccion === "pedidos" && (
              <span className="absolute bottom-0 left-0 h-px w-full bg-[#29251F]" />
            )}
          </button>
        </div>
      </nav>

      {/* RESUMEN */}
      {seccion === "resumen" && (
        <section>
          <div className="mb-8">
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
              Resumen
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-[#29251F] md:text-3xl">
              Vista general
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#756B60]">
              Consulta rápidamente el estado actual de tu tienda.
            </p>
          </div>

          {/* ESTADÍSTICAS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {estadisticas.map((estadistica) => (
              <div
                key={estadistica.titulo}
                className="rounded-2xl border border-[#E8DED1] bg-white p-6"
              >
                <p className="text-sm text-[#756B60]">{estadistica.titulo}</p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-[#29251F]">
                  {estadistica.valor}
                </p>

                <p className="mt-2 text-xs text-[#9A8B78]">
                  {estadistica.descripcion}
                </p>
              </div>
            ))}
          </div>

          {/* ACCIONES */}
          <div className="mt-10">
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
              Acciones rápidas
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => cambiarSeccion("añadir")}
                className="group rounded-2xl border border-[#E8DED1] bg-[#F1E6D8] p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDBCA7] hover:shadow-sm"
              >
                <p className="text-lg font-semibold text-[#29251F]">
                  Añadir producto
                </p>

                <p className="mt-2 text-sm leading-relaxed text-[#756B60]">
                  Incorpora una nueva pieza al catálogo de Macralma.
                </p>

                <p className="mt-5 text-sm font-medium text-[#29251F] transition-transform duration-300 group-hover:translate-x-1">
                  Añadir producto →
                </p>
              </button>

              <button
                type="button"
                onClick={() => cambiarSeccion("pedidos")}
                className="group rounded-2xl border border-[#E8DED1] bg-white p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDBCA7] hover:shadow-sm"
              >
                <p className="text-lg font-semibold text-[#29251F]">
                  Gestionar pedidos
                </p>

                <p className="mt-2 text-sm leading-relaxed text-[#756B60]">
                  Consulta los pedidos y actualiza su estado.
                </p>

                <p className="mt-5 text-sm font-medium text-[#29251F] transition-transform duration-300 group-hover:translate-x-1">
                  Ver pedidos →
                </p>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTOS */}
      {seccion === "productos" && (
        <section>
          <div className="mb-8">
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
              Catálogo
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-[#29251F] md:text-3xl">
              Productos
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#756B60]">
              Consulta, busca y gestiona las piezas disponibles en tu tienda.
            </p>
          </div>

          <BuscadorProductos productos={productos} />
        </section>
      )}

      {/* AÑADIR PRODUCTO */}
      {seccion === "añadir" && (
        <section>
          <div className="mb-8">
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
              Catálogo
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-[#29251F] md:text-3xl">
              Añadir producto
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#756B60]">
              Añade una nueva creación al catálogo de Macralma.
            </p>
          </div>

          <FormularioProducto />
        </section>
      )}

      {/* PEDIDOS */}
      {seccion === "pedidos" && (
        <section>
          <PedidosAdmin />
        </section>
      )}
    </div>
  );
}
