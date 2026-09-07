"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Producto from "@/components/Producto";

type ProductoType = {
  _id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  tallas: string[];
  medidas: string[];
  colores: string[];
  categoria: "prendas" | "mascotas" | "adornos";
  subcategoria?: "prendas" | "accesorios" | null;
};

export default function Catalogo() {
  const [productos, setProductos] = useState<ProductoType[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [orden, setOrden] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [mascotasAbierto, setMascotasAbierto] = useState(false);
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState<string[]>([]);
  const [medidasSeleccionadas, setMedidasSeleccionadas] = useState<string[]>(
    [],
  );
  const [coloresSeleccionados, setColoresSeleccionados] = useState<string[]>(
    [],
  );

  useEffect(() => {
    async function cargarProductos() {
      try {
        const respuesta = await fetch("/api/productos");

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener los productos");
        }

        const datos = await respuesta.json();
        setProductos(datos);
      } catch (error) {
        console.error("ERROR AL CARGAR PRODUCTOS:", error);
        setError("No se pudieron cargar los productos");
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  const esPrenda = tipo === "prendas" || tipo === "mascotas-prendas";

  const usaMedidas = tipo === "mascotas-accesorios" || tipo === "adornos";

  const productosDeCategoria = useMemo(() => {
    return productos.filter((producto) => {
      if (tipo === "prendas") {
        return producto.categoria === "prendas";
      }

      if (tipo === "mascotas-prendas") {
        return (
          producto.categoria === "mascotas" &&
          producto.subcategoria === "prendas"
        );
      }

      if (tipo === "mascotas-accesorios") {
        return (
          producto.categoria === "mascotas" &&
          producto.subcategoria === "accesorios"
        );
      }

      if (tipo === "adornos") {
        return producto.categoria === "adornos";
      }

      return true;
    });
  }, [productos, tipo]);

  const tallasDisponibles = useMemo(() => {
    const tallas = productosDeCategoria.flatMap((producto) => producto.tallas);

    return [...new Set(tallas)].sort();
  }, [productosDeCategoria]);

  const medidasDisponibles = useMemo(() => {
    const medidas = productosDeCategoria.flatMap(
      (producto) => producto.medidas,
    );

    return [...new Set(medidas)];
  }, [productosDeCategoria]);

  const coloresDisponibles = useMemo(() => {
    const colores = productosDeCategoria.flatMap(
      (producto) => producto.colores,
    );

    return [...new Set(colores)].sort();
  }, [productosDeCategoria]);

  const productosFiltrados = useMemo(() => {
    return [...productosDeCategoria]
      .filter((producto) => {
        if (tallasSeleccionadas.length > 0) {
          const tieneTalla = tallasSeleccionadas.some((talla) =>
            producto.tallas.includes(talla),
          );

          if (!tieneTalla) {
            return false;
          }
        }

        if (medidasSeleccionadas.length > 0) {
          const tieneMedida = medidasSeleccionadas.some((medida) =>
            producto.medidas.includes(medida),
          );

          if (!tieneMedida) {
            return false;
          }
        }

        if (coloresSeleccionados.length > 0) {
          const tieneColor = coloresSeleccionados.some((color) =>
            producto.colores.includes(color),
          );

          if (!tieneColor) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (orden === "menor") {
          return a.precio - b.precio;
        }

        if (orden === "mayor") {
          return b.precio - a.precio;
        }

        return 0;
      });
  }, [
    productosDeCategoria,
    tallasSeleccionadas,
    medidasSeleccionadas,
    coloresSeleccionados,
    orden,
  ]);

  const alternarTalla = (talla: string) => {
    setTallasSeleccionadas((actuales) =>
      actuales.includes(talla)
        ? actuales.filter((item) => item !== talla)
        : [...actuales, talla],
    );
  };

  const alternarMedida = (medida: string) => {
    setMedidasSeleccionadas((actuales) =>
      actuales.includes(medida)
        ? actuales.filter((item) => item !== medida)
        : [...actuales, medida],
    );
  };

  const alternarColor = (color: string) => {
    setColoresSeleccionados((actuales) =>
      actuales.includes(color)
        ? actuales.filter((item) => item !== color)
        : [...actuales, color],
    );
  };

  const cambiarTipo = (nuevoTipo: string) => {
    setTipo(nuevoTipo);

    if (
      nuevoTipo === "mascotas-prendas" ||
      nuevoTipo === "mascotas-accesorios"
    ) {
      setMascotasAbierto(true);
    }

    setTallasSeleccionadas([]);
    setMedidasSeleccionadas([]);
    setColoresSeleccionados([]);
  };

  const borrarFiltros = () => {
    setOrden("");
    setTipo("todos");
    setMascotasAbierto(false);
    setTallasSeleccionadas([]);
    setMedidasSeleccionadas([]);
    setColoresSeleccionados([]);
  };

  const filtrosActivos =
    (orden !== "" ? 1 : 0) +
    (tipo !== "todos" ? 1 : 0) +
    tallasSeleccionadas.length +
    medidasSeleccionadas.length +
    coloresSeleccionados.length;

  const claveAnimacion = `${tipo}-${orden}-${tallasSeleccionadas.join(
    ",",
  )}-${medidasSeleccionadas.join(",")}-${coloresSeleccionados.join(",")}`;

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* HERO */}
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/Fondo-Macralma.png')",
        }}
      >
        <div className="absolute inset-0 bg-[#29251F]/55"></div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center md:py-24">
          <p className="mb-5 text-sm uppercase tracking-[0.25em] text-[#F1E6D8] md:text-base">
            Nuestra colección
          </p>

          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
            Nuestro catálogo
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#F1E6D8] md:text-xl">
            Descubre prendas y adornos hechos a mano con cariño, dedicación y
            atención a cada detalle.
          </p>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        {/* CABECERA */}
        <div className="mb-12">
          <div className="text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
              Colección artesanal
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-[#29251F] md:text-4xl">
              Encuentra tu pieza favorita
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#756B60]">
              Explora nuestra colección y encuentra exactamente lo que estás
              buscando.
            </p>
          </div>

          {/* BOTÓN FILTROS MÓVIL */}
          <div className="mt-6 flex justify-center md:hidden">
            <button
              type="button"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-[#CDBCA7] bg-white px-6 py-3 text-sm font-medium text-[#29251F] shadow-sm transition-all duration-300 hover:bg-[#F1E6D8]"
            >
              <span>Filtros</span>

              {filtrosActivos > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#29251F] px-1.5 text-xs text-white">
                  {filtrosActivos}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col gap-10 md:flex-row">
          {/* FILTROS */}
          <aside
            className={`w-full shrink-0 md:block md:w-64 ${
              mostrarFiltros ? "block" : "hidden"
            }`}
          >
            <div className="sticky top-6 rounded-2xl border border-[#E8DED1] bg-white p-6 shadow-sm">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9A8B78]">
                    Filtrar
                  </p>

                  <h3 className="mt-1 text-xl font-semibold text-[#29251F]">
                    Productos
                  </h3>
                </div>

                {filtrosActivos > 0 && (
                  <button
                    type="button"
                    onClick={borrarFiltros}
                    className="text-xs text-[#756B60] underline underline-offset-4 hover:text-[#29251F]"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* CATEGORÍA */}
              <div className="border-b border-[#E8DED1] pb-6">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#756B60]">
                  Categoría
                </h4>

                <div className="space-y-3">
                  {/* TODOS */}
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-[#29251F]">
                    <input
                      type="radio"
                      name="tipo"
                      checked={tipo === "todos"}
                      onChange={() => cambiarTipo("todos")}
                      className="sr-only"
                    />

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        tipo === "todos"
                          ? "border-[#29251F]"
                          : "border-[#CDBCA7]"
                      }`}
                    >
                      {tipo === "todos" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#29251F]" />
                      )}
                    </span>

                    <span>Todos</span>
                  </label>

                  {/* PRENDAS */}
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-[#29251F]">
                    <input
                      type="radio"
                      name="tipo"
                      checked={tipo === "prendas"}
                      onChange={() => cambiarTipo("prendas")}
                      className="sr-only"
                    />

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        tipo === "prendas"
                          ? "border-[#29251F]"
                          : "border-[#CDBCA7]"
                      }`}
                    >
                      {tipo === "prendas" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#29251F]" />
                      )}
                    </span>

                    <span>Prendas</span>
                  </label>

                  {/* MASCOTAS */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setMascotasAbierto(!mascotasAbierto)}
                      className="flex w-full items-center justify-between text-sm text-[#29251F]"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            tipo === "mascotas-prendas" ||
                            tipo === "mascotas-accesorios"
                              ? "border-[#29251F]"
                              : "border-[#CDBCA7]"
                          }`}
                        >
                          {(tipo === "mascotas-prendas" ||
                            tipo === "mascotas-accesorios") && (
                            <span className="h-2.5 w-2.5 rounded-full bg-[#29251F]" />
                          )}
                        </span>

                        <span>Mascotas</span>
                      </span>

                      <span
                        className={`text-xs transition-transform duration-300 ${
                          mascotasAbierto ? "rotate-180" : ""
                        }`}
                      >
                        ↓
                      </span>
                    </button>

                    {/* SUBMENÚ MASCOTAS */}
                    <div
                      className={`ml-8 grid overflow-hidden transition-all duration-300 ${
                        mascotasAbierto
                          ? "mt-3 grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0 space-y-3 border-l border-[#E8DED1] pl-4">
                        {/* MASCOTAS → PRENDAS */}
                        <label className="flex cursor-pointer items-center gap-3 text-sm text-[#756B60] transition-colors hover:text-[#29251F]">
                          <input
                            type="radio"
                            name="tipo"
                            checked={tipo === "mascotas-prendas"}
                            onChange={() => cambiarTipo("mascotas-prendas")}
                            className="sr-only"
                          />

                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                              tipo === "mascotas-prendas"
                                ? "border-[#29251F]"
                                : "border-[#CDBCA7]"
                            }`}
                          >
                            {tipo === "mascotas-prendas" && (
                              <span className="h-2 w-2 rounded-full bg-[#29251F]" />
                            )}
                          </span>

                          <span>Prendas</span>
                        </label>

                        {/* MASCOTAS → ACCESORIOS */}
                        <label className="flex cursor-pointer items-center gap-3 text-sm text-[#756B60] transition-colors hover:text-[#29251F]">
                          <input
                            type="radio"
                            name="tipo"
                            checked={tipo === "mascotas-accesorios"}
                            onChange={() => cambiarTipo("mascotas-accesorios")}
                            className="sr-only"
                          />

                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                              tipo === "mascotas-accesorios"
                                ? "border-[#29251F]"
                                : "border-[#CDBCA7]"
                            }`}
                          >
                            {tipo === "mascotas-accesorios" && (
                              <span className="h-2 w-2 rounded-full bg-[#29251F]" />
                            )}
                          </span>

                          <span>Accesorios</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* ADORNOS */}
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-[#29251F]">
                    <input
                      type="radio"
                      name="tipo"
                      checked={tipo === "adornos"}
                      onChange={() => cambiarTipo("adornos")}
                      className="sr-only"
                    />

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        tipo === "adornos"
                          ? "border-[#29251F]"
                          : "border-[#CDBCA7]"
                      }`}
                    >
                      {tipo === "adornos" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#29251F]" />
                      )}
                    </span>

                    <span>Adornos</span>
                  </label>
                </div>
              </div>

              {/* ORDEN */}
              <div className="border-b border-[#E8DED1] py-6">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#756B60]">
                  Ordenar por
                </h4>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-[#29251F]">
                    <input
                      type="radio"
                      name="orden"
                      checked={orden === ""}
                      onChange={() => setOrden("")}
                      className="sr-only"
                    />

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        orden === "" ? "border-[#29251F]" : "border-[#CDBCA7]"
                      }`}
                    >
                      {orden === "" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#29251F]" />
                      )}
                    </span>

                    <span>Destacados</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 text-sm text-[#29251F]">
                    <input
                      type="radio"
                      name="orden"
                      checked={orden === "menor"}
                      onChange={() => setOrden("menor")}
                      className="sr-only"
                    />

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        orden === "menor"
                          ? "border-[#29251F]"
                          : "border-[#CDBCA7]"
                      }`}
                    >
                      {orden === "menor" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#29251F]" />
                      )}
                    </span>

                    <span>Precio: menor a mayor</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 text-sm text-[#29251F]">
                    <input
                      type="radio"
                      name="orden"
                      checked={orden === "mayor"}
                      onChange={() => setOrden("mayor")}
                      className="sr-only"
                    />

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        orden === "mayor"
                          ? "border-[#29251F]"
                          : "border-[#CDBCA7]"
                      }`}
                    >
                      {orden === "mayor" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#29251F]" />
                      )}
                    </span>

                    <span>Precio: mayor a menor</span>
                  </label>
                </div>
              </div>

              {/* TALLAS */}
              {esPrenda && tallasDisponibles.length > 0 && (
                <div className="border-b border-[#E8DED1] py-6">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#756B60]">
                    Talla
                  </h4>

                  <div className="space-y-3">
                    {tallasDisponibles.map((talla) => (
                      <label
                        key={talla}
                        className="flex cursor-pointer items-center gap-3 text-sm text-[#29251F]"
                      >
                        <input
                          type="checkbox"
                          checked={tallasSeleccionadas.includes(talla)}
                          onChange={() => alternarTalla(talla)}
                          className="sr-only"
                        />

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            tallasSeleccionadas.includes(talla)
                              ? "border-[#29251F] bg-[#29251F]"
                              : "border-[#CDBCA7]"
                          }`}
                        >
                          {tallasSeleccionadas.includes(talla) && (
                            <span className="text-xs text-white">✓</span>
                          )}
                        </span>

                        <span>{talla}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* MEDIDAS */}
              {usaMedidas && medidasDisponibles.length > 0 && (
                <div className="border-b border-[#E8DED1] py-6">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#756B60]">
                    Medida
                  </h4>

                  <div className="space-y-3">
                    {medidasDisponibles.map((medida) => (
                      <label
                        key={medida}
                        className="flex cursor-pointer items-center gap-3 text-sm text-[#29251F]"
                      >
                        <input
                          type="checkbox"
                          checked={medidasSeleccionadas.includes(medida)}
                          onChange={() => alternarMedida(medida)}
                          className="sr-only"
                        />

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            medidasSeleccionadas.includes(medida)
                              ? "border-[#29251F] bg-[#29251F]"
                              : "border-[#CDBCA7]"
                          }`}
                        >
                          {medidasSeleccionadas.includes(medida) && (
                            <span className="text-xs text-white">✓</span>
                          )}
                        </span>

                        <span>{medida}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* COLORES */}
              {coloresDisponibles.length > 0 && (
                <div className="pt-6">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#756B60]">
                    Color
                  </h4>

                  <div className="space-y-3">
                    {coloresDisponibles.map((color) => (
                      <label
                        key={color}
                        className="flex cursor-pointer items-center gap-3 text-sm text-[#29251F]"
                      >
                        <input
                          type="checkbox"
                          checked={coloresSeleccionados.includes(color)}
                          onChange={() => alternarColor(color)}
                          className="sr-only"
                        />

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            coloresSeleccionados.includes(color)
                              ? "border-[#29251F] bg-[#29251F]"
                              : "border-[#CDBCA7]"
                          }`}
                        >
                          {coloresSeleccionados.includes(color) && (
                            <span className="text-xs text-white">✓</span>
                          )}
                        </span>

                        <span>{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* PRODUCTOS */}
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-[#756B60]">
                {productosFiltrados.length} producto
                {productosFiltrados.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* CARGANDO */}
            {cargando && (
              <div className="py-20 text-center">
                <p className="text-[#756B60]">Cargando productos...</p>
              </div>
            )}

            {/* ERROR */}
            {!cargando && error && (
              <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center shadow-sm">
                <p className="text-[#9B4B4B]">{error}</p>
              </div>
            )}

            {/* SIN PRODUCTOS */}
            {!cargando && !error && productosFiltrados.length === 0 && (
              <div className="rounded-2xl border border-[#E8DED1] bg-white px-6 py-16 text-center shadow-sm">
                <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
                  Colección
                </p>

                <h2 className="text-2xl font-semibold tracking-tight text-[#29251F]">
                  No hay productos disponibles
                </h2>

                <p className="mx-auto mt-3 max-w-md text-[#756B60]">
                  Prueba a cambiar los filtros para encontrar otros productos.
                </p>
              </div>
            )}

            {/* PRODUCTOS */}
            {!cargando && !error && productosFiltrados.length > 0 && (
              <div
                key={claveAnimacion}
                className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              >
                {productosFiltrados.map((producto, index) => (
                  <div
                    key={producto._id}
                    className="producto-entrada"
                    style={
                      {
                        "--delay": `${index * 70}ms`,
                      } as CSSProperties
                    }
                  >
                    <Producto
                      nombre={producto.nombre}
                      precio={producto.precio}
                      descripcion={producto.descripcion}
                      imagen={producto.imagen}
                      tallas={producto.tallas}
                      medidas={producto.medidas}
                      categoria={producto.categoria}
                      subcategoria={producto.subcategoria}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ANIMACIÓN DE PRODUCTOS */}
      <style jsx>{`
        .producto-entrada {
          opacity: 0;
          transform: translateY(10px);
          animation: productoEntrada 450ms cubic-bezier(0.22, 1, 0.36, 1)
            var(--delay) forwards;
        }

        @keyframes productoEntrada {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .producto-entrada {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
