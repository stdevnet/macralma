import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { conectarDB } from "@/lib/mongodb";
import { Producto } from "@/models/Producto";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: Props) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ mensaje: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { mensaje: "ID de producto no válido" },
        { status: 400 },
      );
    }

    const datos = await request.json();

    await conectarDB();

    // Buscamos el producto actual antes de actualizarlo
    const productoActual = await Producto.findById(id);

    if (!productoActual) {
      return NextResponse.json(
        { mensaje: "Producto no encontrado" },
        { status: 404 },
      );
    }

    const imagenAnterior = productoActual.imagenPublicId;
    const imagenNueva = datos.imagenPublicId;

    // Actualizamos el producto en MongoDB
    const productoActualizado = await Producto.findByIdAndUpdate(id, datos, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!productoActualizado) {
      return NextResponse.json(
        { mensaje: "Producto no encontrado" },
        { status: 404 },
      );
    }

    // Si se cambió la imagen, eliminamos la anterior de Cloudinary
    if (imagenAnterior && imagenNueva && imagenAnterior !== imagenNueva) {
      try {
        await cloudinary.uploader.destroy(imagenAnterior, {
          resource_type: "image",
        });

        console.log("Imagen anterior eliminada de Cloudinary:", imagenAnterior);
      } catch (error) {
        console.error(
          "ERROR AL ELIMINAR IMAGEN ANTERIOR DE CLOUDINARY:",
          error,
        );
      }
    }

    return NextResponse.json(productoActualizado);
  } catch (error) {
    console.error("ERROR AL ACTUALIZAR PRODUCTO:", error);

    return NextResponse.json(
      { mensaje: "Error al actualizar el producto" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ mensaje: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { mensaje: "ID de producto no válido" },
        { status: 400 },
      );
    }

    await conectarDB();

    // Buscamos el producto antes de eliminarlo
    const producto = await Producto.findById(id);

    if (!producto) {
      return NextResponse.json(
        { mensaje: "Producto no encontrado" },
        { status: 404 },
      );
    }

    const imagenPublicId = producto.imagenPublicId;

    // Eliminamos el producto de MongoDB
    await Producto.findByIdAndDelete(id);

    // Eliminamos la imagen de Cloudinary
    if (imagenPublicId) {
      try {
        await cloudinary.uploader.destroy(imagenPublicId, {
          resource_type: "image",
        });

        console.log("Imagen eliminada de Cloudinary:", imagenPublicId);
      } catch (error) {
        console.error("ERROR AL ELIMINAR IMAGEN DE CLOUDINARY:", error);
      }
    }

    return NextResponse.json({
      mensaje: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("ERROR AL ELIMINAR PRODUCTO:", error);

    return NextResponse.json(
      { mensaje: "Error al eliminar el producto" },
      { status: 500 },
    );
  }
}
