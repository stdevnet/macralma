import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { conectarDB } from "@/lib/mongodb";
import { Pedido } from "@/models/Pedido";
import PedidoAdminDetalle from "@/components/PedidoAdminDetalle";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PedidoAdminPage({ params }: Props) {
  const session = await auth();

  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    notFound();
  }

  await conectarDB();

  const { id } = await params;

  const pedido = await Pedido.findById(id).lean();

  if (!pedido) {
    notFound();
  }

  const pedidoParaCliente = {
    _id: pedido._id.toString(),

    cliente: {
      nombre: String(pedido.cliente.nombre),
      telefono: String(pedido.cliente.telefono),
      email: pedido.cliente.email ? String(pedido.cliente.email) : "",
    },

    envio: {
      direccion: String(pedido.envio.direccion),
      ciudad: String(pedido.envio.ciudad),
      provincia: String(pedido.envio.provincia),
      codigoPostal: String(pedido.envio.codigoPostal),
      pais: String(pedido.envio.pais),
    },

    productos: pedido.productos.map((producto: any) => ({
      productoId: String(producto.productoId),
      nombre: String(producto.nombre),
      imagen: String(producto.imagen),
      precio: Number(producto.precio),
      cantidad: Number(producto.cantidad),
      talla: producto.talla ? String(producto.talla) : "",
      medida: producto.medida ? String(producto.medida) : "",
      color: producto.color ? String(producto.color) : "",
    })),

    total: Number(pedido.total),

    estado: String(pedido.estado),

    estadoPago: pedido.estadoPago ? String(pedido.estadoPago) : "Pendiente",

    metodoPago: String(pedido.metodoPago),

    createdAt: new Date(pedido.createdAt).toISOString(),

    historialEstados: (pedido.historialEstados || []).map((item: any) => ({
      estado: String(item.estado),
      fecha: new Date(item.fecha).toISOString(),
    })),
  };

  return <PedidoAdminDetalle pedidoInicial={pedidoParaCliente} />;
}
