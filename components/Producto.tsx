import Image from "next/image";
import Link from "next/link";

type ProductoProps = {
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  tallas: string[];
  medidas: string[];
  categoria: "prendas" | "mascotas" | "adornos";
  subcategoria?: "prendas" | "accesorios" | null;
};

export default function Producto({
  nombre,
  precio,
  descripcion,
  imagen,
  tallas,
  medidas,
  categoria,
  subcategoria,
}: ProductoProps) {
  const slug = nombre.toLowerCase().replaceAll(" ", "-");

  const esPrenda =
    categoria === "prendas" ||
    (categoria === "mascotas" && subcategoria === "prendas");

  const usaMedidas =
    categoria === "adornos" ||
    (categoria === "mascotas" && subcategoria === "accesorios");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8DED1] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* IMAGEN */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F1E6D8]">
        <Image
          src={imagen}
          alt={nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* INFORMACIÓN */}
      <div className="flex flex-1 flex-col p-6">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
            Hecho a mano
          </p>

          <h2 className="text-xl font-bold tracking-tight text-[#29251F]">
            {nombre}
          </h2>

          <p className="mt-2 text-xl font-semibold text-[#29251F]">{precio}€</p>

          <p className="mt-4 text-sm leading-relaxed text-[#756B60]">
            {descripcion}
          </p>

          {/* OPCIONES DISPONIBLES */}
          {esPrenda && tallas.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-[#29251F]">
                Tallas disponibles
              </p>

              <div className="flex flex-wrap gap-2">
                {tallas.map((talla) => (
                  <span
                    key={talla}
                    className="rounded-full border border-[#E8DED1] bg-[#FAF7F2] px-3 py-1 text-xs text-[#756B60]"
                  >
                    {talla}
                  </span>
                ))}
              </div>
            </div>
          )}

          {usaMedidas && medidas.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-[#29251F]">
                Medidas disponibles
              </p>

              <div className="flex flex-wrap gap-2">
                {medidas.map((medida) => (
                  <span
                    key={medida}
                    className="rounded-full border border-[#E8DED1] bg-[#FAF7F2] px-3 py-1 text-xs text-[#756B60]"
                  >
                    {medida}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOTÓN */}
        <div className="mt-auto pt-6">
          <Link
            href={`/productos/${slug}`}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#29251F] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#403A32] hover:shadow-md"
          >
            Ver producto
          </Link>
        </div>
      </div>
    </article>
  );
}
