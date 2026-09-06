import { useState } from "react";

type OpcionesProductoProps = {
  tallas: string[];
  medidas: string[];
  colores: string[];
  categoria: "prendas" | "mascotas" | "adornos";
  subcategoria?: "prendas" | "accesorios" | null;
  onTallaChange: (talla: string) => void;
  onMedidaChange: (medida: string) => void;
  onColorChange: (color: string) => void;
};

export default function OpcionesProducto({
  tallas,
  medidas,
  colores,
  categoria,
  subcategoria,
  onTallaChange,
  onMedidaChange,
  onColorChange,
}: OpcionesProductoProps) {
  const [talla, setTalla] = useState("");
  const [medida, setMedida] = useState("");
  const [color, setColor] = useState("");

  const esPrenda =
    categoria === "prendas" ||
    (categoria === "mascotas" && subcategoria === "prendas");

  const usaMedidas =
    categoria === "adornos" ||
    (categoria === "mascotas" && subcategoria === "accesorios");

  return (
    <div className="mt-8 space-y-7">
      {/* Tallas */}
      {esPrenda && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-[#29251F]">Talla</h2>

          <div className="flex flex-wrap gap-3">
            {tallas.map((tallaDisponible) => (
              <button
                key={tallaDisponible}
                type="button"
                onClick={() => {
                  setTalla(tallaDisponible);
                  onTallaChange(tallaDisponible);
                }}
                className={`min-w-14 rounded-lg border px-5 py-3 font-medium transition-all ${
                  talla === tallaDisponible
                    ? "border-black bg-black text-white"
                    : "border-gray-400 bg-white text-black hover:bg-gray-100"
                }`}
              >
                {tallaDisponible}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Medidas */}
      {usaMedidas && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-[#29251F]">Medida</h2>

          <div className="flex flex-wrap gap-3">
            {medidas.map((medidaDisponible) => (
              <button
                key={medidaDisponible}
                type="button"
                onClick={() => {
                  setMedida(medidaDisponible);
                  onMedidaChange(medidaDisponible);
                }}
                className={`rounded-lg border px-5 py-3 font-medium transition-all ${
                  medida === medidaDisponible
                    ? "border-black bg-black text-white"
                    : "border-gray-400 bg-white text-black hover:bg-gray-100"
                }`}
              >
                {medidaDisponible}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colores */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-[#29251F]">Color</h2>

        <div className="flex flex-wrap gap-3">
          {colores.map((colorDisponible) => (
            <button
              key={colorDisponible}
              type="button"
              onClick={() => {
                setColor(colorDisponible);
                onColorChange(colorDisponible);
              }}
              className={`rounded-lg border px-5 py-3 font-medium transition-all ${
                color === colorDisponible
                  ? "border-black bg-black text-white"
                  : "border-gray-400 bg-white text-black hover:bg-gray-100"
              }`}
            >
              {colorDisponible}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
