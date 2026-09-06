import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { conectarDB } from "@/lib/mongodb";
import { Pedido } from "@/models/Pedido";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const estadosPermitidos = [
  "Pendiente",
  "Confirmado",
  "En preparación",
  "Enviado",
  "En camino",
  "Entregado",
  "Cancelado",
];

async function obtenerSesionAdministrador() {
  const session = await auth();

  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return null;
  }

  return session;
}

function generarHashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// COMPROBAR ACCESO AL PEDIDO
async function puedeAccederAlPedido(
  pedido: {
    usuarioId?: unknown;
    seguimientoToken?: string;
  },
  token: string | null,
) {
  const session = await auth();

  // ==========================================================
  // ADMINISTRADOR
  // ==========================================================

  if (session?.user?.email === process.env.ADMIN_EMAIL) {
    return true;
  }

  // ==========================================================
  // USUARIO AUTENTICADO
  // ==========================================================

  if (session?.user?.id && pedido.usuarioId) {
    const usuarioActualId = String(session.user.id);

    const usuarioPedidoId = String(pedido.usuarioId);

    if (usuarioActualId === usuarioPedidoId) {
      return true;
    }
  }

  // ==========================================================
  // USUARIO INVITADO
  // ==========================================================
  // Si no está autenticado, utilizamos el token privado
  // que ya teníamos implementado.
  // ==========================================================

  if (!token) {
    return false;
  }

  if (!pedido.seguimientoToken) {
    return false;
  }

  const tokenHash = generarHashToken(token);

  return tokenHash === pedido.seguimientoToken;
}

// OBTENER UN PEDIDO
export async function GET(request: Request, { params }: Props) {
  try {
    await conectarDB();

    const { id } = await params;

    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    const pedido = await Pedido.findById(id).lean();

    if (!pedido) {
      return NextResponse.json(
        {
          error: "Pedido no encontrado",
        },
        { status: 404 },
      );
    }

    const tieneAcceso = await puedeAccederAlPedido(pedido, token);

    if (!tieneAcceso) {
      return NextResponse.json(
        {
          error: "No autorizado",
        },
        { status: 401 },
      );
    }

    // Nunca enviamos información sensible del pedido
    // ni el hash del token al cliente.
    const {
      seguimientoToken: _seguimientoToken,
      usuarioId: _usuarioId,
      ...pedidoSeguro
    } = pedido;

    return NextResponse.json(pedidoSeguro);
  } catch (error) {
    console.error("Error al obtener el pedido:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
      },
      { status: 500 },
    );
  }
}

// ACTUALIZAR ESTADO DEL PEDIDO
// SOLO ADMINISTRADOR
export async function PATCH(request: Request, { params }: Props) {
  try {
    const esAdministrador = await obtenerSesionAdministrador();

    if (!esAdministrador) {
      return NextResponse.json(
        {
          error: "No autorizado",
        },
        { status: 401 },
      );
    }

    await conectarDB();

    const { id } = await params;

    const body = await request.json();

    const { estado } = body;

    if (!estado || !estadosPermitidos.includes(estado)) {
      return NextResponse.json(
        {
          error: "El estado del pedido no es válido",
        },
        { status: 400 },
      );
    }

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return NextResponse.json(
        {
          error: "Pedido no encontrado",
        },
        { status: 404 },
      );
    }

    const estadoAnterior = pedido.estado;

    const metodoPago = String(pedido.metodoPago || "")
      .trim()
      .toLowerCase();

    pedido.estado = estado;

    // ==========================================================
    // WHATSAPP
    // ==========================================================

    if (metodoPago === "whatsapp" && estado === "Confirmado") {
      pedido.estadoPago = "Pagado";
    }

    // ==========================================================
    // HISTORIAL
    // ==========================================================

    if (estadoAnterior !== estado) {
      pedido.historialEstados.push({
        estado,
        fecha: new Date(),
      });
    }

    await pedido.save();

    return NextResponse.json({
      mensaje:
        estadoAnterior === estado
          ? "Pedido actualizado correctamente"
          : "Estado actualizado correctamente",
      pedido,
    });
  } catch (error) {
    console.error("Error al actualizar el estado:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
      },
      { status: 500 },
    );
  }
}
