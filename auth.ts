import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { authConfig } from "./auth.config";
import { conectarDB } from "@/lib/mongodb";
import { Usuario } from "@/models/Usuario";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      name: "Credenciales",

      credentials: {
        email: {
          label: "Correo",
          type: "email",
        },

        password: {
          label: "Contraseña",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = String(credentials?.email || "")
          .trim()
          .toLowerCase();

        const password = String(credentials?.password || "");

        if (!email || !password) {
          return null;
        }

        // =========================
        // ADMINISTRADOR
        // =========================

        const adminEmail = String(process.env.ADMIN_EMAIL || "")
          .trim()
          .toLowerCase();

        const adminPassword = String(process.env.ADMIN_PASSWORD || "");

        if (email === adminEmail && password === adminPassword) {
          return {
            id: "admin",
            name: "Administrador",
            email: adminEmail,
          };
        }

        // =========================
        // USUARIO NORMAL
        // =========================

        await conectarDB();

        const usuario = await Usuario.findOne({
          email,
        });

        if (!usuario) {
          return null;
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
          return null;
        }

        return {
          id: usuario._id.toString(),
          name: usuario.nombre,
          email: usuario.email,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});
