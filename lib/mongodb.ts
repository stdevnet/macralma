import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

console.log("MONGODB_URI existe:", !!MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error("Falta la variable MONGODB_URI en .env.local");
}

export async function conectarDB() {
  await mongoose.connect(MONGODB_URI!);
}
