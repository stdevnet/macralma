import mongoose, { Schema } from "mongoose";

const UsuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Usuario =
  mongoose.models.Usuario || mongoose.model("Usuario", UsuarioSchema);
