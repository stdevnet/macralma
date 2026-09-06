"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  producto: {
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
};

export default function EditarProducto({ id, producto }: Props) {
  const router = useRouter();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [formulario, setFormulario] = useState({
    nombre: producto.nombre,
    precio: producto.precio.toString(),
    descripcion: producto.descripcion,
    imagen: producto.imagen,
    imagenPublicId: producto.imagenPublicId || "",
    categoria: producto.categoria,
    subcategoria: producto.subcategoria || "",
    tallas: producto.tallas.join(", "),
    medidas: producto.medidas.join(", "),
    colores: producto.colores.join(", "),
    disponibilidad: producto.disponibilidad,
    whatsapp: producto.whatsapp,
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleImagenChange(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];

    if (!archivo) {
      return;
    }

    setSubiendoImagen(true);
    setMensaje("Subiendo imagen...");

    const formData = new FormData();
    formData.append("imagen", archivo);

    try {
      const respuesta = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo subir la imagen");
      }

      setFormulario((prev) => ({
        ...prev,
        imagen: datos.url,
        imagenPublicId: datos.public_id,
      }));

      setMensaje("Imagen subida correctamente");
    } catch (error) {
      console.error(error);
      setMensaje("Error al subir la imagen");
    } finally {
      setSubiendoImagen(false);
    }
  }

  async function guardarCambios(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formulario.imagen) {
      setMensaje("El producto necesita una imagen");
      return;
    }

    if (formulario.categoria === "mascotas" && !formulario.subcategoria) {
      setMensaje("Selecciona una subcategoría para mascotas");
      return;
    }

    setGuardando(true);
    setMensaje("Guardando cambios...");

    const datosActualizados = {
      nombre: formulario.nombre,
      precio: Number(formulario.precio),
      descripcion: formulario.descripcion,
      imagen: formulario.imagen,
      imagenPublicId: formulario.imagenPublicId,

      categoria: formulario.categoria,

      subcategoria:
        formulario.categoria === "mascotas" ? formulario.subcategoria : null,

      tallas: formulario.tallas
        ? formulario.tallas.split(",").map((item) => item.trim())
        : [],

      medidas: formulario.medidas
        ? formulario.medidas.split(",").map((item) => item.trim())
        : [],

      colores: formulario.colores
        ? formulario.colores.split(",").map((item) => item.trim())
        : [],

      disponibilidad: formulario.disponibilidad,
      whatsapp: formulario.whatsapp,
    };

    try {
      const respuesta = await fetch(`/api/productos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosActualizados),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo actualizar el producto");
      }

      setMensaje("Producto actualizado correctamente");

      setTimeout(() => {
        setMostrarModal(false);
        setMensaje("");
        setGuardando(false);
        router.refresh();
      }, 700);
    } catch (error) {
      console.error(error);
      setMensaje("Error al actualizar el producto");
      setGuardando(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all duration-300 placeholder:text-[#A99C8C] focus:border-[#CDBCA7] focus:bg-white focus:ring-2 focus:ring-[#E8DED1]";

  const labelClass = "mb-2 block text-sm font-semibold text-[#29251F]";

  const modal = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#29251F]/45 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center py-6 md:py-10">
        <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-[#E8DED1] bg-[#FAF7F2] shadow-2xl">
          {/* CABECERA */}
          <div className="flex items-start justify-between border-b border-[#E8DED1] bg-white px-6 py-6 md:px-8">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                Gestión del catálogo
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-[#29251F] md:text-3xl">
                Editar producto
              </h2>

              <p className="mt-1 text-sm text-[#756B60]">
                Actualiza la información de esta pieza.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMostrarModal(false)}
              disabled={guardando || subiendoImagen}
              aria-label="Cerrar"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8DED1] bg-[#FAF7F2] text-xl leading-none text-[#756B60] transition-all duration-300 hover:bg-[#F1E6D8] hover:text-[#29251F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              ×
            </button>
          </div>

          <form onSubmit={guardarCambios} className="p-6 md:p-8">
            {/* INFORMACIÓN BÁSICA */}
            <div>
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                  Información básica
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#29251F]">
                  Datos del producto
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* NOMBRE */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Nombre</label>

                  <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                {/* PRECIO */}
                <div>
                  <label className={labelClass}>Precio</label>

                  <div className="relative">
                    <input
                      type="number"
                      name="precio"
                      value={formulario.precio}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      className={`${inputClass} pr-10`}
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#9A8B78]">
                      €
                    </span>
                  </div>
                </div>

                {/* DISPONIBILIDAD */}
                <div>
                  <label className={labelClass}>Disponibilidad</label>

                  <select
                    name="disponibilidad"
                    value={formulario.disponibilidad}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Bajo pedido">Bajo pedido</option>
                    <option value="Agotado">Agotado</option>
                  </select>
                </div>

                {/* DESCRIPCIÓN */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Descripción</label>

                  <textarea
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* IMAGEN */}
            <div className="mt-8 border-t border-[#E8DED1] pt-8">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                  Imagen
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#29251F]">
                  Fotografía del producto
                </h3>
              </div>

              <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                {formulario.imagen && (
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#E8DED1] bg-[#F1E6D8]">
                    <Image
                      src={formulario.imagen}
                      alt="Vista previa"
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-col justify-center">
                  <label className={labelClass}>Cambiar imagen</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                    disabled={subiendoImagen || guardando}
                    className="w-full cursor-pointer rounded-xl border border-[#E8DED1] bg-white p-2.5 text-sm text-[#756B60] file:mr-4 file:rounded-lg file:border-0 file:bg-[#F1E6D8] file:px-4 file:py-2 file:text-xs file:font-medium file:text-[#29251F] hover:file:bg-[#E8DED1] disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  {subiendoImagen && (
                    <p className="mt-3 text-sm text-[#756B60]">
                      Subiendo imagen...
                    </p>
                  )}

                  {!subiendoImagen && formulario.imagen && (
                    <p className="mt-3 text-sm font-medium text-[#5F7058]">
                      ✓ Imagen lista
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* CATEGORÍA */}
            <div className="mt-8 border-t border-[#E8DED1] pt-8">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                  Organización
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#29251F]">
                  Categoría y opciones
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* CATEGORÍA */}
                <div>
                  <label className={labelClass}>Categoría</label>

                  <select
                    name="categoria"
                    value={formulario.categoria}
                    onChange={(e) => {
                      const categoria = e.target.value as
                        | "prendas"
                        | "mascotas"
                        | "adornos";

                      setFormulario((prev) => ({
                        ...prev,
                        categoria,
                        subcategoria:
                          categoria === "mascotas" ? prev.subcategoria : "",
                      }));
                    }}
                    className={inputClass}
                  >
                    <option value="prendas">Prendas</option>
                    <option value="mascotas">Mascotas</option>
                    <option value="adornos">Adornos</option>
                  </select>
                </div>

                {/* SUBCATEGORÍA */}
                {formulario.categoria === "mascotas" && (
                  <div>
                    <label className={labelClass}>Subcategoría</label>

                    <select
                      name="subcategoria"
                      value={formulario.subcategoria}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="prendas">Prendas</option>
                      <option value="accesorios">Accesorios</option>
                    </select>
                  </div>
                )}

                {/* TALLAS */}
                <div>
                  <label className={labelClass}>Tallas</label>

                  <input
                    type="text"
                    name="tallas"
                    value={formulario.tallas}
                    onChange={handleChange}
                    placeholder="XS, S, M, L, XL"
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-[#9A8B78]">
                    Separa las tallas con comas.
                  </p>
                </div>

                {/* MEDIDAS */}
                <div>
                  <label className={labelClass}>Medidas</label>

                  <input
                    type="text"
                    name="medidas"
                    value={formulario.medidas}
                    onChange={handleChange}
                    placeholder="10 x 10cm, 20 x 20cm"
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-[#9A8B78]">
                    Separa las medidas con comas.
                  </p>
                </div>

                {/* COLORES */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Colores</label>

                  <input
                    type="text"
                    name="colores"
                    value={formulario.colores}
                    onChange={handleChange}
                    placeholder="Rojo, Azul, Beige"
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-[#9A8B78]">
                    Separa los colores con comas.
                  </p>
                </div>
              </div>
            </div>

            {/* CONTACTO */}
            <div className="mt-8 border-t border-[#E8DED1] pt-8">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                  Contacto
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#29251F]">
                  WhatsApp
                </h3>
              </div>

              <div>
                <label className={labelClass}>Número de WhatsApp</label>

                <input
                  type="text"
                  name="whatsapp"
                  value={formulario.whatsapp}
                  onChange={handleChange}
                  placeholder="34600000000"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* MENSAJE */}
            {mensaje && (
              <div
                className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                  mensaje.includes("correctamente")
                    ? "border-[#D7E3D1] bg-[#E8EFE5] text-[#5F7058]"
                    : mensaje.includes("Error")
                      ? "border-[#E8D5D1] bg-[#F3E5E2] text-[#8A625B]"
                      : "border-[#E8DED1] bg-white text-[#756B60]"
                }`}
              >
                {mensaje}
              </div>
            )}

            {/* BOTONES */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#E8DED1] pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setMostrarModal(false)}
                disabled={guardando || subiendoImagen}
                className="rounded-full border border-[#E8DED1] bg-white px-6 py-3 text-sm font-medium text-[#756B60] transition-all duration-300 hover:bg-[#F1E6D8] hover:text-[#29251F] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={guardando || subiendoImagen}
                className="rounded-full bg-[#29251F] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#403A32] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {guardando
                  ? "Guardando..."
                  : subiendoImagen
                    ? "Subiendo imagen..."
                    : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* BOTÓN EDITAR */}
      <button
        type="button"
        onClick={() => setMostrarModal(true)}
        className="flex w-full items-center justify-center rounded-xl bg-[#29251F] px-3 py-2.5 text-xs font-medium text-white transition-all duration-300 hover:bg-[#403A32] hover:shadow-md"
      >
        Editar
      </button>

      {/* MODAL FUERA DE LA TARJETA */}
      {mostrarModal &&
        typeof document !== "undefined" &&
        createPortal(modal, document.body)}
    </>
  );
}
