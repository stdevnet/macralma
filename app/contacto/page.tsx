export default function Contacto() {
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

        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-24 text-center">
          <p className="text-sm md:text-base uppercase tracking-[0.25em] text-[#F1E6D8] mb-5">
            Estamos para ayudarte
          </p>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            Contacto
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl leading-relaxed text-[#F1E6D8]">
            ¿Te interesa alguna de nuestras prendas o adornos? Estamos
            encantados de ayudarte con cualquier consulta.
          </p>
        </div>
      </section>

      {/* INFORMACIÓN */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78] mb-3">
            Hablemos
          </p>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#29251F]">
            Estamos a tu disposición
          </h2>

          <p className="mt-5 leading-relaxed text-[#756B60]">
            Puedes escribirnos para consultar disponibilidad, tallas, colores,
            medidas o cualquier detalle sobre nuestras piezas.
          </p>
        </div>

        {/* TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* WHATSAPP */}
          <div className="rounded-2xl border border-[#E8DED1] bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E6D8]">
              <span className="text-xl">W</span>
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#29251F]">
              WhatsApp
            </h3>

            <p className="mt-3 text-[#756B60]">
              Escríbenos directamente para resolver tus dudas o realizar un
              pedido.
            </p>

            <p className="mt-5 font-medium text-[#29251F]">+34 600 000 000</p>
          </div>

          {/* EMAIL */}
          <div className="rounded-2xl border border-[#E8DED1] bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E6D8]">
              <span className="text-xl">@</span>
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#29251F]">Email</h3>

            <p className="mt-3 text-[#756B60]">
              También puedes escribirnos por correo para cualquier consulta.
            </p>

            <p className="mt-5 font-medium text-[#29251F]">
              contacto@ejemplo.com
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#F1E6D8]">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78] mb-3">
            Piezas hechas a mano
          </p>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#29251F]">
            ¿Has encontrado algo que te gusta?
          </h2>

          <p className="max-w-xl mx-auto mt-4 leading-relaxed text-[#756B60]">
            No dudes en ponerte en contacto con nosotros. Estaremos encantados
            de atenderte.
          </p>
        </div>
      </section>
    </main>
  );
}
