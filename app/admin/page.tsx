import { redirect } from "next/navigation";

import { auth } from "@/auth";
import CerrarSesion from "@/components/CerrarSesion";
import AdminDashboard from "@/components/AdminDashboard";
import { conectarDB } from "@/lib/mongodb";
import { Producto } from "@/models/Producto";

export default async function AdminPage() {
  const session = await auth();

  const adminEmail = String(process.env.ADMIN_EMAIL || "")
    .trim()
    .toLowerCase();

  const currentEmail = String(session?.user?.email || "")
    .trim()
    .toLowerCase();

  if (!session?.user || currentEmail !== adminEmail) {
    redirect("/login");
  }

  await conectarDB();

  const productos = await Producto.find().sort({ createdAt: -1 }).lean();

  const productosParaCliente = productos.map((producto) => ({
    _id: producto._id.toString(),
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
  }));

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-14">
        <header className="mb-8 flex flex-col gap-6 border-b border-[#E8DED1] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
              Macralma
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#29251F] md:text-4xl">
              Panel de administración
            </h1>

            <p className="mt-3 max-w-xl leading-relaxed text-[#756B60]">
              Gestiona los productos y pedidos de tu tienda de forma sencilla.
            </p>
          </div>

          <div className="relative z-[999] shrink-0">
            <CerrarSesion />
          </div>
        </header>

        <AdminDashboard productos={productosParaCliente} />
      </div>
    </main>
  );
}
