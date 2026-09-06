import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CerrarSesion from "@/components/CerrarSesion";
import MisPedidos from "@/components/MisPedidos";

export default async function MiCuentaPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const adminEmail = String(process.env.ADMIN_EMAIL || "")
    .trim()
    .toLowerCase();

  const currentEmail = String(session.user.email || "")
    .trim()
    .toLowerCase();

  if (currentEmail === adminEmail) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14">
        <header className="mb-10 flex flex-col gap-6 border-b border-[#E8DED1] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
              Macralma
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#29251F] md:text-4xl">
              Mi cuenta
            </h1>

            <p className="mt-3 max-w-xl leading-relaxed text-[#756B60]">
              Gestiona tu información y consulta tus pedidos.
            </p>
          </div>

          <div className="relative z-[999] shrink-0">
            <CerrarSesion />
          </div>
        </header>

        <div className="mb-10 rounded-3xl border border-[#E8DED1] bg-white p-7 shadow-sm">
          <p className="text-sm uppercase tracking-[0.15em] text-[#9A8B78]">
            Mi información
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-[#29251F]">
            {session.user.name || "Usuario"}
          </h2>

          <p className="mt-2 text-[#756B60]">{session.user.email}</p>
        </div>

        <section>
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.15em] text-[#9A8B78]">
              Historial
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#29251F]">
              Mis pedidos
            </h2>
          </div>

          <MisPedidos />
        </section>
      </section>
    </main>
  );
}
