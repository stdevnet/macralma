"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormularioProducto() {
  const router = useRouter();

  const [mensaje, setMensaje] = useState("");
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imagen: "",
    imagenPublicId: "",
    categoria: "prendas",
    subcategoria: "",
    tallas: "",
    medidas: "",
    colores: "",
    disponibilidad: "Disponible",
    whatsapp: "",
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formulario.imagen) {
      setMensaje("Primero debes seleccionar una imagen");
      return;
    }

    setMensaje("Guardando producto...");

    const producto = {
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
      const respuesta = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo crear el producto");
      }

      setMensaje("Producto creado correctamente");

      router.refresh();

      setFormulario({
        nombre: "",
        precio: "",
        descripcion: "",
        imagen: "",
        imagenPublicId: "",
        categoria: "prendas",
        subcategoria: "",
        tallas: "",
        medidas: "",
        colores: "",
        disponibilidad: "Disponible",
        whatsapp: "",
      });
    } catch (error) {
      console.error(error);
      setMensaje("Error al crear el producto");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all duration-300 placeholder:text-[#A99C8C] focus:border-[#CDBCA7] focus:bg-white focus:ring-2 focus:ring-[#E8DED1]";

  const labelClass = "mb-2 block text-sm font-semibold text-[#29251F]";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* INFORMACIÓN BÁSICA */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={labelClass}>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            required
            placeholder="Ej. Vestido de macramé"
            className={inputClass}
          />
        </div>

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
              placeholder="0.00"
              className={`${inputClass} pr-10`}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#756B60]">
              €
            </span>
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Describe el producto..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* IMAGEN */}
      <div>
        <label className={labelClass}>Imagen</label>

        <div className="rounded-xl border border-dashed border-[#CDBCA7] bg-[#FAF7F2] p-5 transition-colors duration-300 hover:bg-white">
          <input
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            disabled={subiendoImagen}
            required={!formulario.imagen}
            className="block w-full cursor-pointer text-sm text-[#756B60] file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#29251F] file:px-5 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#403A32]"
          />

          <p className="mt-2 text-xs text-[#9A8B78]">
            Selecciona una imagen para tu producto.
          </p>
        </div>

        {formulario.imagen && (
          <p className="mt-3 rounded-lg bg-[#F1E6D8] px-4 py-2.5 text-sm font-medium text-[#5F7058]">
            ✓ Imagen subida correctamente
          </p>
        )}
      </div>

      {/* CATEGORÍAS */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={labelClass}>Categoría</label>

          <select
            name="categoria"
            value={formulario.categoria}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="prendas">Prendas</option>
            <option value="mascotas">Mascotas</option>
            <option value="adornos">Adornos</option>
          </select>
        </div>

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
              <option value="">Selecciona una subcategoría</option>
              <option value="prendas">Prendas</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
        )}
      </div>

      {/* OPCIONES DEL PRODUCTO */}
      <div className="border-t border-[#E8DED1] pt-6">
        <div className="mb-5">
          <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
            Características
          </p>
          <h3 className="text-lg font-bold text-[#29251F]">
            Opciones del producto
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
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

          <div>
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

      {/* DISPONIBILIDAD Y CONTACTO */}
      <div className="grid gap-6 border-t border-[#E8DED1] pt-6 md:grid-cols-2">
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

        <div>
          <label className={labelClass}>WhatsApp</label>

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
        <div className="rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm font-medium text-[#756B60]">
          {mensaje}
        </div>
      )}

      {/* BOTÓN */}
      <div className="flex justify-end border-t border-[#E8DED1] pt-6">
        <button
          type="submit"
          disabled={subiendoImagen}
          className="rounded-full bg-[#29251F] px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#403A32] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {subiendoImagen ? "Subiendo imagen..." : "Añadir producto"}
        </button>
      </div>
    </form>
  );
}
