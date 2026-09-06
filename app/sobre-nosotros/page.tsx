export default function SobreNosotros() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* HERO */}
      <section className="bg-[#E8D8C3]">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-24 text-center">
          <p className="text-sm md:text-base uppercase tracking-[0.25em] text-[#756B60] mb-5">
            Nuestra historia
          </p>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#29251F]">
            Sobre nosotros
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl leading-relaxed text-[#756B60]">
            Un pequeño proyecto familiar donde cada pieza se crea a mano, con
            cariño, dedicación y mucha ilusión.
          </p>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78] mb-3">
            Quiénes somos
          </p>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#29251F]">
            Una pasión por lo artesanal
          </h2>

          <p className="mt-6 text-base md:text-lg leading-8 text-[#756B60]">
            Somos un pequeño proyecto familiar dedicado a crear prendas y
            adornos tejidos a mano. Cada pieza nace de la ilusión por crear algo
            especial y diferente, cuidando cada detalle durante todo el proceso.
          </p>

          <p className="mt-5 text-base md:text-lg leading-8 text-[#756B60]">
            Nuestro objetivo es ofrecer productos únicos y hechos a mano,
            poniendo especial atención en la elección de los materiales, la
            elaboración y el acabado final.
          </p>
        </div>

        {/* VALORES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          <div className="rounded-2xl border border-[#E8DED1] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E6D8]">
              <span className="text-lg text-[#756B60]">01</span>
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#29251F]">
              Hecho a mano
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-[#756B60]">
              Cada pieza se elabora artesanalmente, dedicando tiempo y cuidado a
              cada detalle.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8DED1] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E6D8]">
              <span className="text-lg text-[#756B60]">02</span>
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#29251F]">
              Piezas únicas
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-[#756B60]">
              Buscamos crear piezas especiales que tengan su propia
              personalidad.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8DED1] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E6D8]">
              <span className="text-lg text-[#756B60]">03</span>
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#29251F]">
              Con dedicación
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-[#756B60]">
              Cuidamos cada creación desde los primeros pasos hasta el resultado
              final.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#F1E6D8]">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78] mb-3">
            Nuestra esencia
          </p>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#29251F]">
            Cada pieza cuenta una historia
          </h2>

          <p className="max-w-2xl mx-auto mt-5 leading-relaxed text-[#756B60]">
            Gracias por apoyar un proyecto familiar y valorar el trabajo
            artesanal detrás de cada creación.
          </p>
        </div>
      </section>
    </main>
  );
}
