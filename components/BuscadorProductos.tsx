"use client";

import Image from "next/image";
import { useState } from "react";
import EditarProducto from "@/components/EditarProducto";
import EliminarProducto from "@/components/EliminarProducto";

type Producto = {
  _id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  imagenPublicId?: string;
  categoria: "prendas" | "mascotas" | "adornos";
  subcategoria?: "prendas" | "accesorios" | null;
  tallas: string[];
  medidas: string[];
  colores: string[];
  disponibilidad: string;
  whatsapp: string;
};

type Props = {
  productos: Producto[];
};

export default function BuscadorProductos({ productos }: Props) {
  const [busqueda, setBusqueda] = useState("");

  const [categoria, setCategoria] = useState<
    "todas" | "prendas" | "mascotas" | "adornos"
  >("todas");

  const [subcategoria, setSubcategoria] = useState<
    "todas" | "prendas" | "accesorios"
  >("todas");

  const [menuMascotasAbierto, setMenuMascotasAbierto] = useState(false);

  const cambiarCategoria = (
    nuevaCategoria: "todas" | "prendas" | "mascotas" | "adornos",
  ) => {
    setCategoria(nuevaCategoria);

    if (nuevaCategoria !== "mascotas") {
      setSubcategoria("todas");
      setMenuMascotasAbierto(false);
    }
  };

  const seleccionarSubcategoria = (
    nuevaSubcategoria: "todas" | "prendas" | "accesorios",
  ) => {
    setSubcategoria(nuevaSubcategoria);
    setMenuMascotasAbierto(false);
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoria === "todas" || producto.categoria === categoria;

    const coincideSubcategoria =
      categoria !== "mascotas" ||
      subcategoria === "todas" ||
      producto.subcategoria === subcategoria;

    return coincideBusqueda && coincideCategoria && coincideSubcategoria;
  });

  const hayFiltros =
    busqueda !== "" || categoria !== "todas" || subcategoria !== "todas";

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoria("todas");
    setSubcategoria("todas");
    setMenuMascotasAbierto(false);
  };

  return (
    <div>
      {/* BUSCADOR */}
      <div className="relative mb-5">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-5 py-3.5 pr-12 text-sm text-[#29251F] outline-none transition-all duration-300 placeholder:text-[#A99C8C] focus:border-[#CDBCA7] focus:bg-white focus:ring-2 focus:ring-[#E8DED1]"
        />

        <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#9A8B78]">
          ⌕
        </span>
      </div>

      {/* FILTROS */}
      <div className="mb-6 rounded-xl border border-[#E8DED1] bg-[#FAF7F2] p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-[#9A8B78]">
              Tipo
            </p>

            <div className="flex flex-wrap gap-2">
              {/* TODOS */}
              <button
                type="button"
                onClick={() => cambiarCategoria("todas")}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                  categoria === "todas"
                    ? "bg-[#29251F] text-white"
                    : "border border-[#E8DED1] bg-white text-[#756B60] hover:border-[#CDBCA7] hover:text-[#29251F]"
                }`}
              >
                Todos
              </button>

              {/* PRENDAS */}
              <button
                type="button"
                onClick={() => cambiarCategoria("prendas")}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                  categoria === "prendas"
                    ? "bg-[#29251F] text-white"
                    : "border border-[#E8DED1] bg-white text-[#756B60] hover:border-[#CDBCA7] hover:text-[#29251F]"
                }`}
              >
                Prendas
              </button>

              {/* MASCOTAS + DROPDOWN */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (categoria !== "mascotas") {
                      setCategoria("mascotas");
                      setSubcategoria("todas");
                    }

                    setMenuMascotasAbierto(!menuMascotasAbierto);
                  }}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                    categoria === "mascotas"
                      ? "bg-[#29251F] text-white"
                      : "border border-[#E8DED1] bg-white text-[#756B60] hover:border-[#CDBCA7] hover:text-[#29251F]"
                  }`}
                >
                  Mascotas
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-200 ${
                      menuMascotasAbierto ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* MENÚ DESPLEGABLE */}
                {menuMascotasAbierto && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-[#E8DED1] bg-white p-1.5 shadow-lg">
                    <button
                      type="button"
                      onClick={() => seleccionarSubcategoria("todas")}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                        subcategoria === "todas"
                          ? "bg-[#F1E6D8] font-medium text-[#29251F]"
                          : "text-[#756B60] hover:bg-[#FAF7F2] hover:text-[#29251F]"
                      }`}
                    >
                      Todas
                      {subcategoria === "todas" && (
                        <span className="text-[#9A8B78]">✓</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => seleccionarSubcategoria("prendas")}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                        subcategoria === "prendas"
                          ? "bg-[#F1E6D8] font-medium text-[#29251F]"
                          : "text-[#756B60] hover:bg-[#FAF7F2] hover:text-[#29251F]"
                      }`}
                    >
                      Prendas
                      {subcategoria === "prendas" && (
                        <span className="text-[#9A8B78]">✓</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => seleccionarSubcategoria("accesorios")}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                        subcategoria === "accesorios"
                          ? "bg-[#F1E6D8] font-medium text-[#29251F]"
                          : "text-[#756B60] hover:bg-[#FAF7F2] hover:text-[#29251F]"
                      }`}
                    >
                      Accesorios
                      {subcategoria === "accesorios" && (
                        <span className="text-[#9A8B78]">✓</span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* ADORNOS */}
              <button
                type="button"
                onClick={() => cambiarCategoria("adornos")}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                  categoria === "adornos"
                    ? "bg-[#29251F] text-white"
                    : "border border-[#E8DED1] bg-white text-[#756B60] hover:border-[#CDBCA7] hover:text-[#29251F]"
                }`}
              >
                Adornos
              </button>
            </div>
          </div>

          {/* LIMPIAR */}
          {hayFiltros && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="text-xs font-medium text-[#9A8B78] transition-colors hover:text-[#29251F]"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* CONTADOR */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[#756B60]">
          {productosFiltrados.length}{" "}
          {productosFiltrados.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      {/* PRODUCTOS */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {productosFiltrados.map((producto) => (
          <div
            key={producto._id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8DED1] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* IMAGEN */}
            <div className="relative aspect-[4/4.5] overflow-hidden bg-[#F1E6D8]">
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* ETIQUETA DISPONIBILIDAD */}
              <div className="absolute left-3 top-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-semibold shadow-sm backdrop-blur-sm ${
                    producto.disponibilidad === "Disponible"
                      ? "bg-[#E8EFE5]/95 text-[#5F7058]"
                      : producto.disponibilidad === "Agotado"
                        ? "bg-[#F3E5E2]/95 text-[#8A625B]"
                        : "bg-[#F1E6D8]/95 text-[#756B60]"
                  }`}
                >
                  {producto.disponibilidad}
                </span>
              </div>
            </div>

            {/* INFORMACIÓN */}
            <div className="flex flex-1 flex-col p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#9A8B78]">
                {producto.categoria}
                {producto.subcategoria ? ` · ${producto.subcategoria}` : ""}
              </p>

              <h3 className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-5 text-[#29251F]">
                {producto.nombre}
              </h3>

              <p className="mt-2 text-lg font-semibold text-[#29251F]">
                {producto.precio}€
              </p>

              <div className="my-4 h-px bg-[#E8DED1]" />

              <div className="mt-auto flex gap-2">
                <div className="flex-1">
                  <EditarProducto
                    id={producto._id}
                    producto={{
                      nombre: producto.nombre,
                      precio: producto.precio,
                      descripcion: producto.descripcion,
                      imagen: producto.imagen,
                      imagenPublicId: producto.imagenPublicId || "",
                      categoria: producto.categoria,
                      subcategoria: producto.subcategoria,
                      tallas: producto.tallas,
                      medidas: producto.medidas,
                      colores: producto.colores,
                      disponibilidad: producto.disponibilidad,
                      whatsapp: producto.whatsapp,
                    }}
                  />
                </div>

                <EliminarProducto id={producto._id} nombre={producto.nombre} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SIN RESULTADOS */}
      {productosFiltrados.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#CDBCA7] bg-[#FAF7F2] py-14 text-center">
          <p className="text-sm font-medium text-[#756B60]">
            No se encontraron productos.
          </p>

          {busqueda && (
            <p className="mt-1 text-xs text-[#9A8B78]">
              Prueba con otro nombre.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
