"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  ReactNode,
} from "react";

export type ProductoCarrito = {
  productoId: string;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
  talla?: string;
  medida?: string;
  color?: string;
};

type CarritoContextType = {
  carrito: ProductoCarrito[];
  agregarAlCarrito: (producto: ProductoCarrito) => void;
  eliminarDelCarrito: (
    productoId: string,
    talla?: string,
    medida?: string,
    color?: string,
  ) => void;
  aumentarCantidad: (
    productoId: string,
    talla?: string,
    medida?: string,
    color?: string,
  ) => void;
  disminuirCantidad: (
    productoId: string,
    talla?: string,
    medida?: string,
    color?: string,
  ) => void;
  vaciarCarrito: () => void;
  total: number;
  cantidadProductos: number;
};

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

const STORAGE_KEY = "macralma-carrito";

const carritoVacio: ProductoCarrito[] = [];

let carritoActual: ProductoCarrito[] = carritoVacio;

const listeners = new Set<() => void>();

const obtenerCarritoGuardado = (): ProductoCarrito[] => {
  if (typeof window === "undefined") {
    return carritoVacio;
  }

  const carritoGuardado = window.localStorage.getItem(STORAGE_KEY);

  if (!carritoGuardado) {
    return carritoVacio;
  }

  try {
    const carrito = JSON.parse(carritoGuardado);

    if (!Array.isArray(carrito)) {
      return carritoVacio;
    }

    return carrito;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return carritoVacio;
  }
};

const obtenerCarritoCliente = (): ProductoCarrito[] => {
  if (carritoActual === carritoVacio) {
    carritoActual = obtenerCarritoGuardado();
  }

  return carritoActual;
};

const obtenerCarritoServidor = (): ProductoCarrito[] => {
  return carritoVacio;
};

const suscribirse = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const actualizarCarrito = (nuevoCarrito: ProductoCarrito[]) => {
  carritoActual = nuevoCarrito;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoCarrito));
  }

  listeners.forEach((listener) => listener());
};

const mismoProducto = (item: ProductoCarrito, producto: ProductoCarrito) => {
  return (
    item.productoId === producto.productoId &&
    item.talla === producto.talla &&
    item.medida === producto.medida &&
    item.color === producto.color
  );
};

export function CarritoProvider({ children }: { children: ReactNode }) {
  const carrito = useSyncExternalStore(
    suscribirse,
    obtenerCarritoCliente,
    obtenerCarritoServidor,
  );

  const agregarAlCarrito = (producto: ProductoCarrito) => {
    const existente = carrito.find((item) => mismoProducto(item, producto));

    if (existente) {
      actualizarCarrito(
        carrito.map((item) =>
          mismoProducto(item, producto)
            ? {
                ...item,
                cantidad: item.cantidad + producto.cantidad,
              }
            : item,
        ),
      );

      return;
    }

    actualizarCarrito([...carrito, producto]);
  };

  const eliminarDelCarrito = (
    productoId: string,
    talla?: string,
    medida?: string,
    color?: string,
  ) => {
    actualizarCarrito(
      carrito.filter(
        (item) =>
          !(
            item.productoId === productoId &&
            item.talla === talla &&
            item.medida === medida &&
            item.color === color
          ),
      ),
    );
  };

  const aumentarCantidad = (
    productoId: string,
    talla?: string,
    medida?: string,
    color?: string,
  ) => {
    actualizarCarrito(
      carrito.map((item) =>
        item.productoId === productoId &&
        item.talla === talla &&
        item.medida === medida &&
        item.color === color
          ? {
              ...item,
              cantidad: item.cantidad + 1,
            }
          : item,
      ),
    );
  };

  const disminuirCantidad = (
    productoId: string,
    talla?: string,
    medida?: string,
    color?: string,
  ) => {
    actualizarCarrito(
      carrito
        .map((item) =>
          item.productoId === productoId &&
          item.talla === talla &&
          item.medida === medida &&
          item.color === color
            ? {
                ...item,
                cantidad: item.cantidad - 1,
              }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  const vaciarCarrito = () => {
    actualizarCarrito([]);
  };

  const total = carrito.reduce(
    (acumulado, producto) => acumulado + producto.precio * producto.cantidad,
    0,
  );

  const cantidadProductos = carrito.reduce(
    (acumulado, producto) => acumulado + producto.cantidad,
    0,
  );

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        aumentarCantidad,
        disminuirCantidad,
        vaciarCarrito,
        total,
        cantidadProductos,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);

  if (!context) {
    throw new Error("useCarrito debe utilizarse dentro de CarritoProvider");
  }

  return context;
}
