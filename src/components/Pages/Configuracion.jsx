// src/components/pages/Estadisticas.jsx
import React, { useContext, useState } from "react";
import { EstadisticasContext, EstadisticasProvider } from "../../context/EstadisticasContext";
import { Bar, Doughnut } from "react-chartjs-2";
import "../../styles/Estadisticas.css";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
);

const TIME_RANGES = {
  "7d": 7 * 24 * 60 * 60 * 1000,
  "1m": 30 * 24 * 60 * 60 * 1000,
};

const METRIC_NAMES = {
  humedadSuelo: "Humedad del suelo",
  humedadAmbiental: "Humedad ambiental",
  temperatura: "Temperatura",
};

// Paleta de colores por día/mes (7 días o 12 meses)
const PALETTE = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
  "#9966FF", "#FF9F40", "#66FF66", "#C9CBCF",
  "#E7E9ED", "#A2FF99", "#FF99C8", "#99E6FF"
];

function parseFecha(d) {
  if (!d) return NaN;
  if (d.fecha_epoch) return d.fecha_epoch * 1000;
  if (typeof d.fechaHora === "number") return d.fechaHora;
  if (d.fecha_texto) {
    const parsed = new Date(d.fecha_texto).getTime();
    return isNaN(parsed) ? NaN : parsed;
  }
  if (d.fechaHora) {
    const parsed = new Date(d.fechaHora).getTime();
    return isNaN(parsed) ? NaN : parsed;
  }
  return NaN;
}

const EstadisticasComponente = () => {
  const { datos } = useContext(EstadisticasContext);
  const [rango, setRango] = useState("7d");

  if (!datos || datos.length === 0) return <p className="text-gray-500">Cargando datos...</p>;

  const obtenerDatosFiltrados = () => {
    const ahora = Date.now();
    const limite = ahora - TIME_RANGES[rango];
    return datos.filter((d) => {
      const ts = parseFecha(d);
      return !isNaN(ts) && ts >= limite;
    });
  };

  const datosFiltrados = obtenerDatosFiltrados();

  // Agrupar por día o por mes
  const agruparDatos = () => {
    const agrupado = {};

    datosFiltrados.forEach((d) => {
      const ts = parseFecha(d);
      if (isNaN(ts)) return;

      const fecha = new Date(ts);
      let clave;
      if (rango === "7d") {
        clave = fecha.toLocaleDateString("es-ES", { weekday: "long" });
      } else {
        clave = fecha.toLocaleDateString("es-ES", { month: "long" });
      }

      if (!agrupado[clave]) {
        agrupado[clave] = { humedadSuelo: [], humedadAmbiental: [], temperatura: [] };
      }

      agrupado[clave].humedadSuelo.push(d.humedadSuelo || 0);
      agrupado[clave].humedadAmbiental.push(d.humedadAmbiental || 0);
      agrupado[clave].temperatura.push(d.temperatura || 0);
    });

    // Reducir: promedio, min y max
    const result = {};
    Object.keys(agrupado).forEach((k) => {
      result[k] = {
        humedadSuelo: promedio(agrupado[k].humedadSuelo),
        humedadSueloMin: Math.min(...agrupado[k].humedadSuelo),
        humedadSueloMax: Math.max(...agrupado[k].humedadSuelo),

        humedadAmbiental: promedio(agrupado[k].humedadAmbiental),
        humedadAmbientalMin: Math.min(...agrupado[k].humedadAmbiental),
        humedadAmbientalMax: Math.max(...agrupado[k].humedadAmbiental),

        temperatura: promedio(agrupado[k].temperatura),
        temperaturaMin: Math.min(...agrupado[k].temperatura),
        temperaturaMax: Math.max(...agrupado[k].temperatura),
      };
    });

    return result;
  };

  const promedio = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const agrupado = agruparDatos();
  const labels = Object.keys(agrupado);

  // Donas: cada métrica con colores por día/mes
  const prepararDona = (metrica) => ({
    labels,
    datasets: [
      {
        label: METRIC_NAMES[metrica],
        data: labels.map((k) => agrupado[k][metrica]),
        backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
      },
    ],
  });

  // Barras: comparar promedio, min y max
  const prepararBarras = (metrica) => ({
    labels,
    datasets: [
      {
        label: "Promedio",
        data: labels.map((k) => agrupado[k][metrica]),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Máximo",
        data: labels.map((k) => agrupado[k][`${metrica}Max`]),
        backgroundColor: "#4BC0C0",
      },
      {
        label: "Mínimo",
        data: labels.map((k) => agrupado[k][`${metrica}Min`]),
        backgroundColor: "#FF6384",
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 10 } } },
    },
  };

  return (
    <div className="estadisticas-container">
      <div className="selector-container">
        <label className="selector-label">Rango:</label>
        <select
          value={rango}
          onChange={(e) => setRango(e.target.value)}
          className="selector-input"
        >
          <option value="7d">Últimos 7 días</option>
          <option value="1m">Último mes</option>
        </select>
      </div>

      {/* Card con donas */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Donas - {rango === "7d" ? "Por día de la semana" : "Por mes"}</h2>
        </div>
        <div className="card-content">
          <div className="donas-container">
            <div className="donas-item">
              <Doughnut data={prepararDona("temperatura")} options={chartOptions} height={250} />
            </div>
            <div className="donas-item">
              <Doughnut data={prepararDona("humedadSuelo")} options={chartOptions} height={250} />
            </div>
            <div className="donas-item">
              <Doughnut data={prepararDona("humedadAmbiental")} options={chartOptions} height={250} />
            </div>
          </div>
        </div>
      </div>

      {/* Card con barras */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Barras - Promedio, Máximo y Mínimo</h2>
        </div>
        <div className="card-content">
          <div className="donas-container">
            <div className="donas-item">
              <Bar data={prepararBarras("temperatura")} options={chartOptions} height={300} />
            </div>
            <div className="donas-item">
              <Bar data={prepararBarras("humedadSuelo")} options={chartOptions} height={300} />
            </div>
            <div className="donas-item">
              <Bar data={prepararBarras("humedadAmbiental")} options={chartOptions} height={300} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// === Export principal ===
export default function Estadisticas() {
  return (
    <EstadisticasProvider>
      <EstadisticasComponente />
    </EstadisticasProvider>
  );
}
