// src/components/pages/Estadisticas.jsx
import React, { useContext } from "react";
import { EstadisticasContext, EstadisticasProvider } from "../../context/EstadisticasContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const EstadisticasComponente = () => {
  const { datos } = useContext(EstadisticasContext);

  // Si no hay datos, mostramos mensaje
  if (!datos.length) return <p>Cargando datos...</p>;

  const labels = datos.map((d) => d.fechaHora.slice(11, 19)); // Hora
  const valores = datos.map((d) => d.humedad || 0); // Ejemplo: humedad del suelo

  const data = {
    labels,
    datasets: [
      {
        label: "Humedad del suelo",
        data: valores,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return <Bar data={data} />;
};

// Exportamos envuelto en provider
export default function Estadisticas() {
  return (
    <EstadisticasProvider>
      <EstadisticasComponente />
    </EstadisticasProvider>
  );
}
