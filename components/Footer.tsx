export default function Footer() {
  return (
    <footer className="border-t border-[#E8DED1] bg-[#F1E6D8]">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* INFORMACIÓN */}
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold tracking-tight text-[#29251F]">
              Macralma
            </p>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#756B60]">
              Prendas para ti y tu mascota, adornos y accesorios hechos a mano
              con cariño y dedicación.
            </p>
          </div>

          {/* INFORMACIÓN DE CONTACTO */}
          <div className="text-center md:text-right">
            <p className="text-sm font-medium text-[#29251F]">Madrid, España</p>

            <p className="mt-2 text-sm text-[#756B60]">© 2026 Macralma</p>

            <p className="mt-2 text-xs text-[#9A8B78]">
              Desarrollado por Pedro Ceballo
            </p>
          </div>
        </div>

        {/* SEPARADOR */}
        <div className="mt-10 pt-6 border-t border-[#E8DED1] text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
            Hecho a mano · Hecho con cariño
          </p>
        </div>
      </div>
    </footer>
  );
}
