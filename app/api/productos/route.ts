import { NextResponse } from "next/server";
import { conectarDB } from "@/lib/mongodb";
import { Producto } from "@/models/Producto";
import { auth } from "@/auth";

export async function GET() {
  try {
    await conectarDB();

    const productos = await Producto.find();

    return NextResponse.json(productos);
  } catch (error) {
    console.error("ERROR MONGODB:", error);

    return NextResponse.json(
      {
        mensaje: "Error al obtener los productos",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ mensaje: "No autorizado" }, { status: 401 });
    }

    await conectarDB();

    const datos = await request.json();

    const nuevoProducto = await Producto.create(datos);

    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    console.error("ERROR AL CREAR PRODUCTO:", error);

    return NextResponse.json(
      { mensaje: "Error al crear el producto" },
      { status: 500 },
    );
  }
}
