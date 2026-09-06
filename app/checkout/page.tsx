"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { useCarrito } from "@/components/CarritoContext";

type MetodoPago = "WhatsApp" | "Crypto" | "Stripe";

export default function CheckoutPage() {
  const router = useRouter();

  const { carrito, total, cantidadProductos, vaciarCarrito } = useCarrito();

  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");

  const [metodoPago, setMetodoPago] = useState<MetodoPago>("WhatsApp");

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  if (carrito.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF7F2]">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-20">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
              Checkout
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#29251F]">
              Tu carrito está vacío
            </h1>

            <p className="mx-auto mt-4 max-w-md leading-relaxed text-[#756B60]">
              Añade al menos un producto antes de continuar con el pedido.
            </p>

            <Link
              href="/catalogo"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#29251F] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#403A32] hover:shadow-md"
            >
              Volver al catálogo
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const crearPedido = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setCargando(true);

    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente: {
            nombre,
            telefono,
            email,
          },

          envio: {
            direccion,
            ciudad,
            provincia,
            codigoPostal,
            pais: "España",
          },

          productos: carrito.map((producto) => ({
            productoId: producto.productoId,
            cantidad: producto.cantidad,
            talla: producto.talla || "",
            medida: producto.medida || "",
            color: producto.color || "",
          })),

          metodoPago,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear el pedido.");
      }

      if (!data.pedido?._id || !data.pedido?.seguimientoToken) {
        throw new Error(
          "El pedido se creó, pero no se pudo generar el enlace de seguimiento.",
        );
      }

      vaciarCarrito();

      router.push(
        `/pedido/confirmado?id=${data.pedido._id}&token=${encodeURIComponent(
          data.pedido.seguimientoToken,
        )}`,
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error al crear el pedido.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <div className="mb-10">
          <Link
            href="/carrito"
            className="mb-6 inline-flex items-center text-sm text-[#756B60] transition-colors hover:text-[#29251F]"
          >
            <span className="mr-2 text-lg">←</span>
            Volver al carrito
          </Link>

          <p className="text-sm uppercase tracking-[0.2em] text-[#9A8B78]">
            Macralma
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#29251F] md:text-5xl">
            Finalizar pedido
          </h1>

          <p className="mt-3 text-[#756B60]">
            Completa tus datos para preparar tu pedido.
          </p>
        </div>

        <form
          onSubmit={crearPedido}
          className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]"
        >
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#E8DED1] bg-white p-6 md:p-8">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                  01
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-[#29251F]">
                  Tus datos
                </h2>

                <p className="mt-2 text-sm text-[#756B60]">
                  Necesitamos estos datos para gestionar tu pedido.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-sm font-medium text-[#29251F]"
                  >
                    Nombre completo
                  </label>

                  <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Pedro Ceballo"
                    className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#A59C91] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="telefono"
                      className="mb-2 block text-sm font-medium text-[#29251F]"
                    >
                      Teléfono
                    </label>

                    <input
                      id="telefono"
                      type="tel"
                      value={telefono}
                      onChange={(event) => setTelefono(event.target.value)}
                      required
                      autoComplete="tel"
                      placeholder="600 000 000"
                      className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#A59C91] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-[#29251F]"
                    >
                      Email
                      <span className="ml-1 font-normal text-[#9A8B78]">
                        (opcional)
                      </span>
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      placeholder="tu@email.com"
                      className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#A59C91] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E8DED1] bg-white p-6 md:p-8">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                  02
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-[#29251F]">
                  Dirección de envío
                </h2>

                <p className="mt-2 text-sm text-[#756B60]">
                  Indica dónde quieres recibir tu pedido.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="direccion"
                    className="mb-2 block text-sm font-medium text-[#29251F]"
                  >
                    Dirección
                  </label>

                  <input
                    id="direccion"
                    type="text"
                    value={direccion}
                    onChange={(event) => setDireccion(event.target.value)}
                    required
                    autoComplete="street-address"
                    placeholder="Calle, número, piso..."
                    className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#A59C91] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="ciudad"
                      className="mb-2 block text-sm font-medium text-[#29251F]"
                    >
                      Ciudad
                    </label>

                    <input
                      id="ciudad"
                      type="text"
                      value={ciudad}
                      onChange={(event) => setCiudad(event.target.value)}
                      required
                      autoComplete="address-level2"
                      placeholder="Madrid"
                      className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#A59C91] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="provincia"
                      className="mb-2 block text-sm font-medium text-[#29251F]"
                    >
                      Provincia
                    </label>

                    <input
                      id="provincia"
                      type="text"
                      value={provincia}
                      onChange={(event) => setProvincia(event.target.value)}
                      required
                      autoComplete="address-level1"
                      placeholder="Madrid"
                      className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#A59C91] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
                    />
                  </div>
                </div>

                <div className="sm:w-1/2">
                  <label
                    htmlFor="codigoPostal"
                    className="mb-2 block text-sm font-medium text-[#29251F]"
                  >
                    Código postal
                  </label>

                  <input
                    id="codigoPostal"
                    type="text"
                    value={codigoPostal}
                    onChange={(event) => setCodigoPostal(event.target.value)}
                    required
                    autoComplete="postal-code"
                    placeholder="28001"
                    className="w-full rounded-xl border border-[#E8DED1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#29251F] outline-none transition-all placeholder:text-[#A59C91] focus:border-[#9A8B78] focus:ring-2 focus:ring-[#E8DED1]"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E8DED1] bg-white p-6 md:p-8">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                  03
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-[#29251F]">
                  Método de pago
                </h2>

                <p className="mt-2 text-sm text-[#756B60]">
                  Selecciona cómo quieres realizar el pago.
                </p>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                    metodoPago === "WhatsApp"
                      ? "border-[#9A8B78] bg-[#F1E6D8]"
                      : "border-[#E8DED1] bg-[#FAF7F2] hover:border-[#CDBCA7]"
                  }`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value="WhatsApp"
                    checked={metodoPago === "WhatsApp"}
                    onChange={() => setMetodoPago("WhatsApp")}
                    className="h-4 w-4 accent-[#29251F]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[#29251F]">
                      WhatsApp
                    </p>

                    <p className="mt-1 text-xs text-[#756B60]">
                      Confirma tu pedido y coordina el pago por WhatsApp.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                    metodoPago === "Crypto"
                      ? "border-[#9A8B78] bg-[#F1E6D8]"
                      : "border-[#E8DED1] bg-[#FAF7F2] hover:border-[#CDBCA7]"
                  }`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value="Crypto"
                    checked={metodoPago === "Crypto"}
                    onChange={() => setMetodoPago("Crypto")}
                    className="h-4 w-4 accent-[#29251F]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[#29251F]">
                      Crypto
                    </p>

                    <p className="mt-1 text-xs text-[#756B60]">
                      Paga con USDT o USDC mediante Ethereum o BNB Smart Chain.
                    </p>
                  </div>
                </label>

                {metodoPago === "Crypto" && (
                  <div className="rounded-xl border border-[#E8DED1] bg-[#FAF7F2] p-5">
                    {!isConnected ? (
                      <div>
                        <p className="text-sm font-semibold text-[#29251F]">
                          Conecta tu wallet
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-[#756B60]">
                          Conecta MetaMask, Trust Wallet, Coinbase Wallet u
                          otras wallets compatibles para continuar con el pago.
                        </p>

                        <button
                          type="button"
                          onClick={() => open()}
                          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#29251F] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#403A32] hover:shadow-md"
                        >
                          Conectar wallet
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#29251F] text-sm text-white">
                            ✓
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#29251F]">
                              Wallet conectada
                            </p>

                            <p className="mt-1 truncate text-xs text-[#756B60]">
                              {address}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => disconnect()}
                          className="mt-4 text-xs font-semibold text-[#756B60] underline underline-offset-4 transition-colors hover:text-[#29251F]"
                        >
                          Desconectar wallet
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                    metodoPago === "Stripe"
                      ? "border-[#9A8B78] bg-[#F1E6D8]"
                      : "border-[#E8DED1] bg-[#FAF7F2] hover:border-[#CDBCA7]"
                  }`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value="Stripe"
                    checked={metodoPago === "Stripe"}
                    onChange={() => setMetodoPago("Stripe")}
                    className="h-4 w-4 accent-[#29251F]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[#29251F]">
                      Stripe
                    </p>

                    <p className="mt-1 text-xs text-[#756B60]">
                      Pago con tarjeta. Disponible próximamente.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#29251F] px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#403A32] hover:shadow-md disabled:cursor-not-allowed disabled:bg-[#BDB5AA]"
            >
              {cargando
                ? "Creando pedido..."
                : `Confirmar pedido · ${total.toFixed(2)}€`}
            </button>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[#E8DED1] bg-[#F1E6D8] p-6 md:p-7">
              <p className="text-xs uppercase tracking-[0.18em] text-[#9A8B78]">
                Resumen
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#29251F]">
                Tu pedido
              </h2>

              <div className="my-6 h-px bg-[#E8DED1]" />

              <div className="space-y-5">
                {carrito.map((producto) => (
                  <div
                    key={`${producto.productoId}-${producto.talla ?? ""}-${producto.medida ?? ""}-${producto.color ?? ""}`}
                    className="flex gap-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#FAF7F2]">
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />

                      <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#29251F] px-1 text-[10px] font-semibold text-white">
                        {producto.cantidad}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#29251F]">
                        {producto.nombre}
                      </p>

                      <div className="mt-1 space-y-0.5 text-xs text-[#756B60]">
                        {producto.talla && <p>Talla: {producto.talla}</p>}

                        {producto.medida && <p>Medida: {producto.medida}</p>}

                        {producto.color && <p>Color: {producto.color}</p>}
                      </div>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-[#29251F]">
                      {(producto.precio * producto.cantidad).toFixed(2)}€
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-6 h-px bg-[#E8DED1]" />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-[#756B60]">
                  <span>Productos</span>
                  <span>{cantidadProductos}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-[#756B60]">
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)}€</span>
                </div>

                <div className="flex items-center justify-between text-sm text-[#756B60]">
                  <span>Envío</span>
                  <span>Por calcular</span>
                </div>
              </div>

              <div className="my-6 h-px bg-[#E8DED1]" />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#29251F]">Total</span>

                <span className="text-2xl font-bold text-[#29251F]">
                  {total.toFixed(2)}€
                </span>
              </div>
            </div>
          </aside>
        </form>
      </section>
    </main>
  );
}
