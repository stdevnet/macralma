import Image from "next/image";
import Link from "next/link";
import { conectarDB } from "@/lib/mongodb";
import { Producto } from "@/models/Producto";
import SeleccionProducto from "@/components/SeleccionProductos";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;

  await conectarDB();

  const nombreProducto = slug.replaceAll("-", " ");

  const producto = await Producto.findOne({
    nombre: {
      $regex: `^${nombreProducto}$`,
      $options: "i",
    },
  }).lean();

  if (!producto) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78] mb-3">
            Catálogo
          </p>

          <h1 className="text-3xl font-bold text-[#29251F]">
            Producto no encontrado
          </h1>

          <p className="mt-3 text-[#756B60]">
            El producto que buscas no está disponible.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* BOTÓN VOLVER */}
        <Link
          href="/catalogo"
          aria-label="Volver al catálogo"
          className="mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DED1] bg-[#FAF7F2] text-[#756B60] transition-all duration-300 ease-out hover:-translate-x-1 hover:bg-[#F1E6D8] hover:text-[#29251F]"
        >
          <span className="text-lg leading-none">←</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* IMAGEN */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#F1E6D8] border border-[#E8DED1]">
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4 md:p-8"
                priority
              />
            </div>

            <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-[#9A8B78]">
              Pieza artesanal
            </p>
          </div>

          {/* INFORMACIÓN */}
          <div className="flex flex-col">
            <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
              Hecho a mano
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#29251F]">
              {producto.nombre}
            </h1>

            <p className="mt-5 text-3xl font-semibold text-[#29251F]">
              {producto.precio}€
            </p>

            <div className="mt-8 h-px bg-[#E8DED1]" />

            {/* DESCRIPCIÓN */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#29251F]">
                Descripción
              </h2>

              <p className="mt-4 text-base leading-7 text-[#756B60]">
                {producto.descripcion}
              </p>
            </div>

            {/* OPCIONES */}
            <div className="mt-8">
              <SeleccionProducto
                productoId={producto._id.toString()}
                imagen={producto.imagen}
                tallas={producto.tallas}
                medidas={producto.medidas}
                colores={producto.colores}
                whatsapp={producto.whatsapp}
                nombre={producto.nombre}
                precio={producto.precio}
                categoria={producto.categoria}
                subcategoria={producto.subcategoria}
              />
            </div>

            {/* DISPONIBILIDAD */}
            <div className="mt-6 flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  producto.disponibilidad === "Disponible"
                    ? "bg-green-600"
                    : producto.disponibilidad === "Bajo pedido"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              />

              <p className="text-sm font-medium text-[#756B60]">
                {producto.disponibilidad === "Disponible"
                  ? "Producto disponible"
                  : producto.disponibilidad === "Bajo pedido"
                    ? "Disponible bajo pedido"
                    : "Producto agotado"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN INFERIOR */}
      <section className="border-t border-[#E8DED1] bg-[#F1E6D8]">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78] mb-3">
            Nuestra esencia
          </p>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#29251F]">
            Una pieza hecha con cariño
          </h2>

          <p className="max-w-2xl mx-auto mt-5 leading-relaxed text-[#756B60]">
            Cada creación se realiza de forma artesanal, cuidando los
            materiales, los detalles y el acabado para ofrecer una pieza
            especial y única.
          </p>
        </div>
      </section>
    </main>
  );
}
