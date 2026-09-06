export type Producto = {
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  tipo: "prenda" | "adorno";
  tallas: string[];
  medidas: string[];
  colores: string[];
  disponibilidad: string;
  whatsapp: string;
};

export const productos: Producto[] = [
  {
    nombre: "Jersey de lana",
    precio: 35,
    descripcion: "Jersey tejido a mano con lana suave.",
    imagen: "/placeholder.jpg",
    tipo: "prenda",
    tallas: ["XS", "S", "M", "L", "XL"],
    medidas: [],
    colores: ["Rojo", "Azul", "Verde"],
    disponibilidad: "Disponible",
    whatsapp: "34600000000",
  },
  {
    nombre: "Bufanda tejida",
    precio: 20,
    descripcion: "Bufanda artesanal, suave y calentita.",
    imagen: "/placeholder.jpg",
    tipo: "prenda",
    tallas: ["Única"],
    medidas: [],
    colores: ["Gris", "Negro", "Beige"],
    disponibilidad: "Agotado",
    whatsapp: "34600000000",
  },
  {
    nombre: "Gorro de lana",
    precio: 15,
    descripcion: "Gorro tejido a mano para los días fríos.",
    imagen: "/placeholder.jpg",
    tipo: "prenda",
    tallas: ["Única"],
    medidas: [],
    colores: ["Gris", "Negro", "Beige"],
    disponibilidad: "Bajo pedido",
    whatsapp: "34600000000",
  },
  {
    nombre: "Adorno colgante",
    precio: 25,
    descripcion: "Adorno tejido a mano para decoración.",
    imagen: "/placeholder.jpg",
    tipo: "adorno",
    tallas: [],
    medidas: ['10 x 10cm' , '20 x 20cm'],
    colores: ["Beige", "Marrón"],
    disponibilidad: "Disponible",
    whatsapp: "34600000000",
  },
];
