import { NextResponse } from "next/server";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ mensaje: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();

    const archivo = formData.get("imagen") as File | null;

    if (!archivo) {
      return NextResponse.json(
        { mensaje: "No se recibió ninguna imagen" },
        { status: 400 },
      );
    }

    const bytes = await archivo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const resultado = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "catalogo-prendas",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      uploadStream.end(buffer);
    });

    const imagen = resultado as {
      secure_url: string;
      public_id: string;
    };

    return NextResponse.json({
      url: imagen.secure_url,
      public_id: imagen.public_id,
    });
  } catch (error) {
    console.error("ERROR AL SUBIR IMAGEN:", error);

    return NextResponse.json(
      { mensaje: "Error al subir la imagen" },
      { status: 500 },
    );
  }
}
