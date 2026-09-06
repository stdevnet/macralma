import { randomBytes, createHash } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { conectarDB } from "@/lib/mongodb";
import { Pedido } from "@/models/Pedido";
import { Producto } from "@/models/Producto";

async function comprobarAdministrador() {
  const session = await auth();

  return !!session?.user && session.user.email === process.env.ADMIN_EMAIL;
}

// CREAR PEDIDO
export async function POST(request: Request) {
  try {
    await conectarDB();

    const body = await request.json();

    const { cliente, envio, productos, metodoPago = "WhatsApp" } = body;

    // Comprobamos si hay un usuario autenticado.
    // Nunca confiamos en un usuarioId enviado desde el navegador.
    const session = await auth();

    const usuarioId = session?.user?.id || null;

    if (!cliente?.nombre || !cliente?.telefono) {
      return NextResponse.json(
        {
          error: "El nombre y teléfono del cliente son obligatorios",
        },
        { status: 400 },
      );
    }

    if (
      !envio?.direccion ||
      !envio?.ciudad ||
      !envio?.provincia ||
      !envio?.codigoPostal
    ) {
      return NextResponse.json(
        {
          error: "La dirección de envío está incompleta",
        },
        { status: 400 },
      );
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json(
        {
          error: "El pedido debe contener al menos un producto",
        },
        { status: 400 },
      );
    }

    const metodosPagoPermitidos = ["WhatsApp", "Crypto", "Stripe"];

    if (!metodosPagoPermitidos.includes(metodoPago)) {
      return NextResponse.json(
        {
          error: "El método de pago no es válido",
        },
        { status: 400 },
      );
    }

    const productosPedido = [];

    for (const item of productos) {
      if (!item.productoId || !item.cantidad || item.cantidad < 1) {
        return NextResponse.json(
          {
            error: "Los productos del pedido no son válidos",
          },
          { status: 400 },
        );
      }

      const producto = await Producto.findById(item.productoId);

      if (!producto) {
        return NextResponse.json(
          {
            error: `No se encontró el producto ${item.productoId}`,
          },
          { status: 404 },
        );
      }

      productosPedido.push({
        productoId: producto._id,
        nombre: producto.nombre,
        imagen: producto.imagen,
        precio: producto.precio,
        cantidad: item.cantidad,
        talla: item.talla || "",
        medida: item.medida || "",
        color: item.color || "",
      });
    }

    const total = productosPedido.reduce(
      (acumulado, producto) => acumulado + producto.precio * producto.cantidad,
      0,
    );

    // Token privado para que el cliente pueda consultar
    // su pedido sin necesidad de crear una cuenta.
    const seguimientoToken = randomBytes(32).toString("hex");

    // En MongoDB solamente guardamos el hash.
    const seguimientoTokenHash = createHash("sha256")
      .update(seguimientoToken)
      .digest("hex");

    const pedido = await Pedido.create({
      // Si el usuario está autenticado se guarda su ID.
      // Si compra como invitado será null.
      usuarioId,

      cliente,
      envio,
      productos: productosPedido,
      total,
      metodoPago,
      estado: "Pendiente",
      estadoPago: "Pendiente",

      seguimientoToken: seguimientoTokenHash,

      historialEstados: [
        {
          estado: "Pendiente",
          fecha: new Date(),
        },
      ],
    });

    return NextResponse.json(
      {
        mensaje: "Pedido creado correctamente",
        pedido: {
          ...pedido.toObject(),
          seguimientoToken,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al crear pedido:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
      },
      { status: 500 },
    );
  }
}

// OBTENER TODOS LOS PEDIDOS
// SOLO ADMINISTRADOR
export async function GET() {
  try {
    const esAdministrador = await comprobarAdministrador();

    if (!esAdministrador) {
      return NextResponse.json(
        {
          error: "No autorizado",
        },
        { status: 401 },
      );
    }

    await conectarDB();

    const pedidos = await Pedido.find()
      .sort({ createdAt: -1 })
      .populate("productos.productoId");

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
      },
      { status: 500 },
    );
  }
}
