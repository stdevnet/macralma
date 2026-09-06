"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  nombre: string;
};

export default function EliminarProducto({ id, nombre }: Props) {
  const router = useRouter();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  async function eliminarProducto() {
    setEliminando(true);

    try {
      const respuesta = await fetch(`/api/productos/${id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el producto");
      }

      setMostrarModal(false);
      router.refresh();
    } catch (error) {
      console.error(error);

      alert("No se pudo eliminar el producto");
      setEliminando(false);
    }
  }

  return (
    <>
      {/* BOTÓN ELIMINAR */}
      <button
        type="button"
        onClick={() => setMostrarModal(true)}
        className="flex-1 rounded bg-red-600 px-2 py-1 text-sm text-white hover:opacity-80"
      >
        Eliminar
      </button>

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border bg-black p-6 text-white shadow-xl">
            <h2 className="text-xl font-bold">Eliminar producto</h2>

            <p className="mt-3">
              ¿Seguro que quieres eliminar <strong>{nombre}</strong>?
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Esta acción no se puede deshacer.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMostrarModal(false)}
                disabled={eliminando}
                className="rounded border px-4 py-2 hover:opacity-80 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={eliminarProducto}
                disabled={eliminando}
                className="rounded bg-red-600 px-4 py-2 text-white hover:opacity-80 disabled:opacity-50"
              >
                {eliminando ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
