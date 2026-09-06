import mongoose, { Schema } from "mongoose";

const PedidoSchema = new Schema(
  {
    // Usuario registrado que realizó el pedido.
    // Es opcional porque también permitimos compras
    // sin iniciar sesión.
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
      index: true,
    },

    cliente: {
      nombre: { type: String, required: true },
      telefono: { type: String, required: true },
      email: { type: String, default: "" },
    },

    envio: {
      direccion: { type: String, required: true },
      ciudad: { type: String, required: true },
      provincia: { type: String, required: true },
      codigoPostal: { type: String, required: true },
      pais: { type: String, required: true, default: "España" },
    },

    productos: [
      {
        productoId: {
          type: Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },

        nombre: {
          type: String,
          required: true,
        },

        imagen: {
          type: String,
          default: "",
        },

        precio: {
          type: Number,
          required: true,
        },

        cantidad: {
          type: Number,
          required: true,
          min: 1,
        },

        talla: {
          type: String,
          default: "",
        },

        medida: {
          type: String,
          default: "",
        },

        color: {
          type: String,
          default: "",
        },
      },
    ],

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    estado: {
      type: String,
      enum: [
        "Pendiente",
        "Confirmado",
        "En preparación",
        "Enviado",
        "En camino",
        "Entregado",
        "Cancelado",
      ],
      default: "Pendiente",
    },

    estadoPago: {
      type: String,
      enum: ["Pendiente", "Pagado", "Fallido"],
      default: "Pendiente",
    },

    metodoPago: {
      type: String,
      enum: ["WhatsApp", "Crypto", "Stripe"],
      default: "WhatsApp",
    },

    historialEstados: [
      {
        estado: {
          type: String,
          required: true,
        },

        fecha: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    seguimientoToken: {
      type: String,
      default: "",
      index: true,
    },

    transaccionHash: {
      type: String,
      default: "",
    },

    redBlockchain: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const Pedido =
  mongoose.models.Pedido || mongoose.model("Pedido", PedidoSchema);
