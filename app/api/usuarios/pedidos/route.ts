import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { conectarDB } from "@/lib/mongodb";
import { Pedido } from "@/models/Pedido";

type ProductoPedido = {
  productoId?: unknown;
  nombre?: string;
  imagen?: string;
  precio?: number;
  cantidad?: number;
  talla?: string;
  medida?: string;
  color?: string;
};

type HistorialEstado = {
  estado?: string;
  fecha?: Date | string;
};

type PedidoLean = {
  _id: unknown;
  productos?: ProductoPedido[];
  total?: number;
  estado?: string;
  estadoPago?: string;
  metodoPago?: string;
  createdAt?: Date | string;
  historialEstados?: HistorialEstado[];
};

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "No autorizado",
        },
        { status: 401 },
      );
    }

    await conectarDB();

    const pedidos = (await Pedido.find({
      usuarioId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean()) as unknown as PedidoLean[];

    const pedidosSeguros = pedidos.map((pedido) => ({
      _id: String(pedido._id),

      productos: Array.isArray(pedido.productos)
        ? pedido.productos.map((producto) => ({
            productoId: producto.productoId ? String(producto.productoId) : "",
            nombre: producto.nombre || "Producto",
            imagen: producto.imagen || "",
            precio:
              typeof producto.precio === "number"
                ? producto.precio
                : Number(producto.precio) || 0,
            cantidad:
              typeof producto.cantidad === "number"
                ? producto.cantidad
                : Number(producto.cantidad) || 1,
            talla: producto.talla || "",
            medida: producto.medida || "",
            color: producto.color || "",
          }))
        : [],

      total:
        typeof pedido.total === "number"
          ? pedido.total
          : Number(pedido.total) || 0,

      estado: pedido.estado || "Pendiente",

      estadoPago: pedido.estadoPago || "Pendiente",

      metodoPago: pedido.metodoPago || "WhatsApp",

      createdAt: pedido.createdAt
        ? new Date(pedido.createdAt).toISOString()
        : new Date().toISOString(),

      historialEstados: Array.isArray(pedido.historialEstados)
        ? pedido.historialEstados.map((item) => ({
            estado: item.estado || "",
            fecha: item.fecha
              ? new Date(item.fecha).toISOString()
              : new Date().toISOString(),
          }))
        : [],
    }));

    return NextResponse.json(pedidosSeguros);
  } catch (error) {
    console.error("====================================");
    console.error("ERROR AL OBTENER PEDIDOS DEL USUARIO");
    console.error(error);
    console.error("====================================");

    return NextResponse.json(
      {
        error: "Error interno del servidor",
      },
      { status: 500 },
    );
  }
}
