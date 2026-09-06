import mongoose, { Schema } from "mongoose";

const ProductoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },

    precio: {
      type: Number,
      required: true,
    },

    descripcion: {
      type: String,
      required: true,
    },

    imagen: {
      type: String,
      required: true,
    },

    imagenPublicId: {
      type: String,
      default: "",
    },

    tallas: {
      type: [String],
      default: [],
    },

    colores: {
      type: [String],
      default: [],
    },

    disponibilidad: {
      type: String,
      required: true,
    },

    whatsapp: {
      type: String,
      required: true,
    },

    categoria: {
      type: String,
      enum: ["prendas", "mascotas", "adornos"],
      required: true,
    },

    subcategoria: {
      type: String,
      enum: ["prendas", "accesorios"],
      default: null,
    },

    medidas: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Producto =
  mongoose.models.Producto || mongoose.model("Producto", ProductoSchema);
