import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { conectarDB } from "@/lib/mongodb";
import { Pedido } from "@/models/Pedido";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type ProductoPedido = {
  productoId: string;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
  talla?: string;
  medida?: string;
  color?: string;
};

type HistorialEstado = {
  estado: string;
  fecha: Date;
};

const estados = [
  "Pendiente",
  "Confirmado",
  "En preparación",
  "Enviado",
  "En camino",
  "Entregado",
];

const iconosEstados: Record<string, string> = {
  Pendiente: "📋",
  Confirmado: "✓",
  "En preparación": "📦",
  Enviado: "🚚",
  "En camino": "📍",
  Entregado: "✓",
};

export default async function PedidoUsuarioPage({ params }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  await conectarDB();

  const pedido = await Pedido.findById(id).lean();

  if (!pedido) {
    notFound();
  }

  if (!pedido.usuarioId || pedido.usuarioId.toString() !== session.user.id) {
    notFound();
  }

  const fechaPedido = new Date(pedido.createdAt).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const historial: HistorialEstado[] = pedido.historialEstados || [];

  const estadoActual = pedido.estado;
  const estadoActualIndex = estados.indexOf(estadoActual);

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14">
        <Link
          href="/mi-cuenta"
          className="inline-flex items-center text-sm font-medium text-[#756B60] transition-colors hover:text-[#29251F]"
        >
          ← Volver a mi cuenta
        </Link>

        <header className="mt-8 border-b border-[#E8DED1] pb-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
                Macralma
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#29251F] md:text-4xl">
                Detalle del pedido
              </h1>

              <p className="mt-3 text-sm text-[#756B60]">
                Pedido #{pedido._id.toString().slice(-8).toUpperCase()}
                {" · "}
                {fechaPedido}
              </p>
            </div>

            <div className="rounded-full bg-[#F1E6D8] px-5 py-2.5 text-sm font-semibold text-[#29251F]">
              {pedido.estado}
            </div>
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-[#E8DED1] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.15em] text-[#9A8B78]">
              Seguimiento
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#29251F]">
              Estado de tu pedido
            </h2>
          </div>

          {pedido.estado === "Cancelado" ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="font-semibold text-red-800">Pedido cancelado</p>

              <p className="mt-1 text-sm text-red-700">
                Este pedido ha sido cancelado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div className="flex min-w-[720px] items-start px-4 pt-4">
                {estados.map((estado, index) => {
                  const completado = estadoActualIndex >= index;
                  const actual = estado === estadoActual;

                  return (
                    <div key={estado} className="flex flex-1 items-start">
                      <div className="flex w-24 shrink-0 flex-col items-center text-center">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold transition-all ${
                            completado
                              ? "bg-[#29251F] text-white"
                              : "border-2 border-[#E8DED1] bg-white text-[#9A8B78]"
                          } ${actual ? "ring-4 ring-[#F1E6D8]" : ""}`}
                        >
                          {completado ? iconosEstados[estado] || "✓" : "○"}
                        </div>

                        <p
                          className={`mt-3 min-h-[36px] w-full text-xs font-semibold leading-4 ${
                            completado ? "text-[#29251F]" : "text-[#9A8B78]"
                          }`}
                        >
                          {estado}
                        </p>
                      </div>

                      {index < estados.length - 1 && (
                        <div
                          className={`mt-6 h-0.5 min-w-[20px] flex-1 ${
                            estadoActualIndex > index
                              ? "bg-[#29251F]"
                              : "bg-[#E8DED1]"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {historial.length > 0 && (
            <div className="mt-10 border-t border-[#E8DED1] pt-8">
              <p className="text-sm font-semibold text-[#29251F]">
                Historial del pedido
              </p>

              <div className="mt-5 space-y-4">
                {historial
                  .slice()
                  .reverse()
                  .map((item: HistorialEstado, index: number) => (
                    <div
                      key={`${item.estado}-${index}`}
                      className="flex items-center gap-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1E6D8] text-sm">
                        ✓
                      </div>

                      <div className="flex flex-1 items-center justify-between gap-4">
                        <p className="text-sm font-medium text-[#29251F]">
                          {item.estado}
                        </p>

                        <p className="text-xs text-[#756B60]">
                          {new Date(item.fecha).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-[#E8DED1] bg-white shadow-sm">
          <div className="border-b border-[#E8DED1] p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.15em] text-[#9A8B78]">
              Productos
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#29251F]">
              Artículos del pedido
            </h2>
          </div>

          <div className="divide-y divide-[#E8DED1]">
            {pedido.productos.map((producto: ProductoPedido, index: number) => (
              <div
                key={`${producto.productoId}-${index}`}
                className="flex gap-4 p-6 md:p-8"
              >
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  width={112}
                  height={112}
                  className="h-24 w-24 shrink-0 rounded-2xl object-cover md:h-28 md:w-28"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#29251F] md:text-lg">
                    {producto.nombre}
                  </h3>

                  <p className="mt-1 text-sm text-[#756B60]">
                    Cantidad: {producto.cantidad}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {producto.talla && (
                      <span className="rounded-full bg-[#FAF7F2] px-3 py-1 text-xs text-[#756B60]">
                        Talla: {producto.talla}
                      </span>
                    )}

                    {producto.medida && (
                      <span className="rounded-full bg-[#FAF7F2] px-3 py-1 text-xs text-[#756B60]">
                        Medida: {producto.medida}
                      </span>
                    )}

                    {producto.color && (
                      <span className="rounded-full bg-[#FAF7F2] px-3 py-1 text-xs text-[#756B60]">
                        Color: {producto.color}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm text-[#756B60]">
                    {producto.precio.toFixed(2)} €
                  </p>

                  <p className="mt-1 font-semibold text-[#29251F]">
                    {(producto.precio * producto.cantidad).toFixed(2)} €
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E8DED1] bg-[#FAF7F2] p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#756B60]">Método de pago</p>

                <p className="mt-1 font-medium text-[#29251F]">
                  {pedido.metodoPago}
                </p>

                <p className="mt-1 text-sm text-[#756B60]">
                  Estado del pago:{" "}
                  <span className="font-medium text-[#29251F]">
                    {pedido.estadoPago}
                  </span>
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-[#756B60]">Total</p>

                <p className="mt-1 text-3xl font-bold text-[#29251F]">
                  {pedido.total.toFixed(2)} €
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#E8DED1] bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm uppercase tracking-[0.15em] text-[#9A8B78]">
              Cliente
            </p>

            <h2 className="mt-3 text-xl font-semibold text-[#29251F]">
              {pedido.cliente.nombre}
            </h2>

            <div className="mt-4 space-y-2 text-sm text-[#756B60]">
              <p>{pedido.cliente.email}</p>
              <p>{pedido.cliente.telefono}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E8DED1] bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm uppercase tracking-[0.15em] text-[#9A8B78]">
              Envío
            </p>

            <h2 className="mt-3 text-xl font-semibold text-[#29251F]">
              Dirección de entrega
            </h2>

            <div className="mt-4 space-y-1 text-sm leading-relaxed text-[#756B60]">
              <p>{pedido.envio.direccion}</p>
              <p>
                {pedido.envio.codigoPostal} {pedido.envio.ciudad}
              </p>
              <p>{pedido.envio.provincia}</p>
              <p>{pedido.envio.pais}</p>
            </div>
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <Link
            href="/mi-cuenta"
            className="inline-flex items-center justify-center rounded-full border-2 border-[#29251F] bg-white px-7 py-3 text-sm font-semibold text-[#29251F] transition-all duration-300 hover:bg-[#29251F] hover:text-white"
          >
            ← Volver a mis pedidos
          </Link>
        </div>
      </section>
    </main>
  );
}
