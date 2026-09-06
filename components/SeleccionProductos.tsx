"use client";

import { useState } from "react";
import OpcionesProducto from "@/components/OpcionesProducto";
import { useCarrito } from "@/components/CarritoContext";

type SeleccionProductoProps = {
  productoId: string;
  imagen: string;
  tallas: string[];
  medidas: string[];
  colores: string[];
  whatsapp: string;
  nombre: string;
  precio: number;
  categoria: "prendas" | "mascotas" | "adornos";
  subcategoria?: "prendas" | "accesorios" | null;
};

export default function SeleccionProducto({
  productoId,
  imagen,
  tallas,
  medidas,
  colores,
  whatsapp,
  nombre,
  precio,
  categoria,
  subcategoria,
}: SeleccionProductoProps) {
  const [talla, setTalla] = useState("");
  const [medida, setMedida] = useState("");
  const [color, setColor] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const { agregarAlCarrito } = useCarrito();

  const esPrenda =
    categoria === "prendas" ||
    (categoria === "mascotas" && subcategoria === "prendas");

  const puedeContactar = esPrenda ? talla && color : medida && color;

  const mensaje = esPrenda
    ? `Hola, estoy interesado/a en el ${nombre} de ${precio}€. Talla: ${talla || "No seleccionada"}. Color: ${color || "No seleccionado"}.`
    : `Hola, estoy interesado/a en el ${nombre} de ${precio}€. Medida: ${medida || "No seleccionada"}. Color: ${color || "No seleccionado"}.`;

  const mensajeCodificado = encodeURIComponent(mensaje);
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${mensajeCodificado}`;

  const agregarProducto = () => {
    if (!puedeContactar) return;

    agregarAlCarrito({
      productoId,
      nombre,
      imagen,
      precio,
      cantidad,
      talla: esPrenda ? talla : undefined,
      medida: !esPrenda ? medida : undefined,
      color,
    });

    setAgregado(true);

    setTimeout(() => {
      setAgregado(false);
    }, 2000);
  };

  return (
    <div className="rounded-2xl bg-[#F1E6D8] p-6 md:p-7">
      {/* TÍTULO */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
          Personaliza tu pieza
        </p>

        <h2 className="mt-2 text-xl font-semibold text-[#29251F]">
          Elige tus opciones
        </h2>
      </div>

      {/* OPCIONES */}
      <OpcionesProducto
        tallas={tallas}
        medidas={medidas}
        colores={colores}
        categoria={categoria}
        subcategoria={subcategoria}
        onTallaChange={setTalla}
        onMedidaChange={setMedida}
        onColorChange={setColor}
      />

      {/* RESUMEN */}
      <div className="mt-6 space-y-3">
        <div className="rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
            {esPrenda ? "Talla" : "Medida"}
          </p>

          <p className="mt-1 text-sm font-medium text-[#29251F]">
            {esPrenda
              ? talla || "Ninguna seleccionada"
              : medida || "Ninguna seleccionada"}
          </p>
        </div>

        <div className="rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-[#9A8B78]">
            Color
          </p>

          <p className="mt-1 text-sm font-medium text-[#29251F]">
            {color || "Ninguno seleccionado"}
          </p>
        </div>
      </div>

      {/* CANTIDAD */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-[#29251F]">Cantidad</p>

        <div className="flex w-fit items-center overflow-hidden rounded-full border border-[#E8DED1] bg-[#FAF7F2]">
          <button
            type="button"
            onClick={() => setCantidad((actual) => Math.max(1, actual - 1))}
            className="flex h-10 w-10 items-center justify-center text-lg text-[#756B60] transition-colors hover:bg-[#F1E6D8] hover:text-[#29251F]"
            aria-label="Disminuir cantidad"
          >
            −
          </button>

          <span className="flex h-10 min-w-10 items-center justify-center text-sm font-semibold text-[#29251F]">
            {cantidad}
          </span>

          <button
            type="button"
            onClick={() => setCantidad((actual) => actual + 1)}
            className="flex h-10 w-10 items-center justify-center text-lg text-[#756B60] transition-colors hover:bg-[#F1E6D8] hover:text-[#29251F]"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      {/* AGREGAR AL CARRITO */}
      <button
        type="button"
        disabled={!puedeContactar}
        onClick={agregarProducto}
        className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#29251F] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#403A32] hover:shadow-md disabled:cursor-not-allowed disabled:bg-[#BDB5AA] disabled:text-[#F1EDE7] disabled:shadow-none"
      >
        {agregado ? "✓ Añadido al carrito" : "Agregar al carrito"}
      </button>

      {/* WHATSAPP */}
      <button
        type="button"
        disabled={!puedeContactar}
        onClick={() => {
          window.open(whatsappUrl, "_blank");
        }}
        className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#5C8A62] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#4F7855] hover:shadow-md disabled:cursor-not-allowed disabled:bg-[#BDB5AA] disabled:text-[#F1EDE7] disabled:shadow-none"
      >
        Consultar por WhatsApp
      </button>

      {!puedeContactar && (
        <p className="mt-3 text-center text-xs text-[#756B60]">
          Selecciona tus opciones para poder añadir el producto al carrito.
        </p>
      )}
    </div>
  );
}
