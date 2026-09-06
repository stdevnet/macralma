"use client";

import { signOut } from "next-auth/react";

export default function CerrarSesion() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="!inline-flex !h-12 !items-center !justify-center !rounded-full !border-2 !border-[#29251F] !bg-white !px-6 !text-sm !font-semibold !text-[#29251F] !opacity-100 !shadow-md"
    >
      Cerrar sesión
    </button>
  );
}
