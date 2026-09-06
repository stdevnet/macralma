import { conectarDB } from "./lib/mongodb";
import { Producto } from "./models/Producto";

async function eliminarTipo() {
  try {
    await conectarDB();

    const resultado = await Producto.updateMany(
      {},
      {
        $unset: {
          tipo: "",
        },
      },
    );

    console.log("Productos actualizados:", resultado.modifiedCount);
    console.log("Campo tipo eliminado correctamente.");
  } catch (error) {
    console.error("Error al eliminar tipo:", error);
  } finally {
    process.exit();
  }
}

eliminarTipo();
