import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { conectarDB } from "@/lib/mongodb";
import { Usuario } from "@/models/Usuario";

export async function POST(request: Request) {
  try {
    await conectarDB();

    const body = await request.json();

    const nombre = String(body.nombre || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    if (!nombre || !email || !password) {
      return NextResponse.json(
        {
          error: "Todos los campos son obligatorios.",
        },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "La contraseña debe tener al menos 6 caracteres.",
        },
        { status: 400 },
      );
    }

    const usuarioExistente = await Usuario.findOne({
      email,
    });

    if (usuarioExistente) {
      return NextResponse.json(
        {
          error: "Ya existe una cuenta con este correo.",
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
    });

    return NextResponse.json(
      {
        mensaje: "Cuenta creada correctamente.",
        usuario: {
          id: usuario._id.toString(),
          nombre: usuario.nombre,
          email: usuario.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    return NextResponse.json(
      {
        error: "No se pudo crear la cuenta.",
      },
      { status: 500 },
    );
  }
}
