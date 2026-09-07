import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#FAF7F2]">
      {/* HERO */}
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/Fondo-Macralma.png')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#29251F]/55"></div>

        {/* Contenido */}
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <p className="text-sm md:text-base uppercase tracking-[0.25em] text-[#F1E6D8] mb-6">
            Hecho a mano
          </p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Prendas tejidas
            <br />a mano
          </h1>

          <p className="max-w-2xl mx-auto mt-7 text-lg md:text-xl leading-relaxed text-[#F1E6D8]">
            Prendas y adornos hechos a mano con cariño y dedicación, creando
            piezas únicas para cada ocasión.
          </p>

          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center mt-10 bg-[#29251F] text-white px-8 py-4 rounded-full font-medium hover:bg-[#403A32] transition-all duration-300 hover:scale-105"
          >
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* PRESENTACIÓN */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-24 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78] mb-4">
          Nuestra esencia
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-[#29251F]">
          Cada pieza tiene su propia historia
        </h2>

        <p className="max-w-2xl mx-auto mt-6 text-base md:text-lg leading-relaxed text-[#756B60]">
          Dedicamos tiempo y cuidado a cada creación para ofrecer prendas y
          adornos elaborados de forma artesanal, cuidando cada detalle.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8DED1]">
            <h3 className="text-lg font-semibold text-[#29251F]">
              Hecho a mano
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-[#756B60]">
              Cada pieza es elaborada cuidadosamente de manera artesanal.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8DED1]">
            <h3 className="text-lg font-semibold text-[#29251F]">
              Piezas únicas
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-[#756B60]">
              Diseños especiales creados con dedicación y personalidad.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8DED1]">
            <h3 className="text-lg font-semibold text-[#29251F]">Con cariño</h3>

            <p className="mt-3 text-sm leading-relaxed text-[#756B60]">
              Ponemos ilusión y cuidado en cada una de nuestras creaciones.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#F1E6D8]">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#29251F]">
            Descubre nuestra colección
          </h2>

          <p className="mt-4 text-[#756B60]">
            Encuentra tu próxima pieza hecha a mano.
          </p>

          <Link
            href="/catalogo"
            className="inline-block mt-7 border border-[#29251F] text-[#29251F] px-7 py-3 rounded-full font-medium hover:bg-[#29251F] hover:text-white transition-colors"
          >
            Explorar catálogo
          </Link>
        </div>
      </section>
    </main>
  );
}
