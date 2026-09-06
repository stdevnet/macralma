import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      const isOnAccount = nextUrl.pathname.startsWith("/mi-cuenta");

      const adminEmail = String(process.env.ADMIN_EMAIL || "")
        .trim()
        .toLowerCase();

      const currentEmail = String(auth?.user?.email || "")
        .trim()
        .toLowerCase();

      // =========================
      // PANEL ADMIN
      // =========================

      if (isOnAdmin) {
        return isLoggedIn && currentEmail === adminEmail;
      }

      // =========================
      // CUENTA DE USUARIO
      // =========================

      if (isOnAccount) {
        return isLoggedIn;
      }

      return true;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
