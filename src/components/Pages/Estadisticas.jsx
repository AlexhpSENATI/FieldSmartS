// src/components/pages/Estadisticas.jsx
import React, { useContext, useState } from "react";
import { EstadisticasContext, EstadisticasProvider } from "../../context/EstadisticasContext";
import { Bar, Pie } from "react-chartjs-2";
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

// ✅ Constantes
const TIME_RANGES = {
  "10s": 10 * 1000,
  "5m": 5 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "2h": 2 * 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "3d": 3 * 24 * 60 * 60 * 1000,
  "1w": 7 * 24 * 60 * 60 * 1000,
  "1m": 30 * 24 * 60 * 60 * 1000,
  "1y": 365 * 24 * 60 * 60 * 1000,
};

const METRIC_NAMES = {
  humedad: "Humedad del suelo",
  humedadAmbiental: "Humedad ambiental",
  temperatura: "Temperatura",
};

const COLORS = [
  "rgba(100, 180, 180, 0.7)", // Humedad suelo
  "rgba(170, 100, 230, 0.7)", // Humedad ambiental
  "rgba(255, 160, 90, 0.7)",  // Temperatura
];

// ✅ Componente principal
const EstadisticasComponente = () => {
  const { datos } = useContext(EstadisticasContext);
  const [rango, setRango] = useState("actual");
  const [metrica, setMetrica] = useState("humedad");

  if (!datos || datos.length === 0) return <p className="text-gray-500">Cargando datos...</p>;

  // ✅ Filtrar datos según rango
  const obtenerDatosFiltrados = () => {
    if (rango === "actual") {
      return [datos[datos.length - 1]];
    }

    const ahora = new Date();
    const limite = ahora.getTime() - TIME_RANGES[rango];
    return datos.filter((d) => new Date(d.fechaHora).getTime() >= limite);
  };

  const datosFiltrados = obtenerDatosFiltrados();

  // ✅ Preparar datos para gráficos
  const prepararDatosGraficos = () => {
    if (rango === "actual") {
      const ultimo = datosFiltrados[0];
      const labels = ["Actual"];

      const dataBar = {
        labels,
        datasets: [
          {
            label: METRIC_NAMES.humedad,
            data: [ultimo.humedad || 0],
            backgroundColor: COLORS[0],
          },
          {
            label: METRIC_NAMES.humedadAmbiental,
            data: [ultimo.humedadAmbiental || 0],
            backgroundColor: COLORS[1],
          },
          {
            label: METRIC_NAMES.temperatura,
            data: [ultimo.temperatura || 0],
            backgroundColor: COLORS[2],
          },
        ],
      };

      const dataPie = {
        labels: Object.values(METRIC_NAMES),
        datasets: [
          {
            data: [
              ultimo.humedad || 0,
              ultimo.humedadAmbiental || 0,
              ultimo.temperatura || 0,
            ],
            backgroundColor: COLORS,
          },
        ],
      };

      return { dataBar, dataPie };
    }

    // Para rangos históricos
    const labels = datosFiltrados.map((d) => d.fechaHora.slice(11, 19));
    const valores = datosFiltrados.map((d) => d[metrica] || 0);

    const dataBar = {
      labels,
      datasets: [
        {
          label: METRIC_NAMES[metrica],
          data: valores,
          backgroundColor: COLORS[0],
        },
      ],
    };

    return { dataBar };
  };

  const { dataBar, dataPie } = prepararDatosGraficos();

  // ✅ Opciones para evitar desbordamiento
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.1)",
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 10,
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="estadisticas-container">
      {/* Selector de rango */}
      <div className="selector-container">
        <label className="selector-label">Rango:</label>
        <select
          value={rango}
          onChange={(e) => setRango(e.target.value)}
          className="selector-input"
        >
          <option value="actual">Último dato</option>
          <option value="10s">Últimos 10s</option>
          <option value="5m">Últimos 5 min</option>
          <option value="30m">Últimos 30 min</option>
          <option value="1h">Última hora</option>
          <option value="2h">Últimas 2 h</option>
          <option value="6h">Últimas 6 h</option>
          <option value="12h">Últimas 12 h</option>
          <option value="24h">Últimas 24 h</option>
          <option value="3d">Últimos 3 días</option>
          <option value="1w">Última semana</option>
          <option value="1m">Último mes</option>
          <option value="1y">Último año</option>
        </select>
      </div>

      {/* Selector de métrica */}
      {rango !== "actual" && (
        <div className="selector-container">
          <label className="selector-label">Métrica:</label>
          <select
            value={metrica}
            onChange={(e) => setMetrica(e.target.value)}
            className="selector-input"
          >
            <option value="humedad">Humedad del suelo</option>
            <option value="humedadAmbiental">Humedad ambiental</option>
            <option value="temperatura">Temperatura</option>
          </select>
        </div>
      )}

      {/* Gráficos */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            {rango === "actual" ? "Último dato" : `Evolución de ${METRIC_NAMES[metrica]}`}
          </h2>
        </div>
        <div className="card-content">
          <div className="graficos-container">
            {/* Gráfico de barras */}
            <div className="grafico-item">
              <Bar
                data={dataBar}
                options={barOptions}
                height={300}
                width="100%"
              />
            </div>

            {/* Gráfico de pastel solo si es "actual" */}
            {rango === "actual" && (
              <div className="grafico-item">
                <Pie
                  data={dataPie}
                  options={pieOptions}
                  height={300}
                  width="100%"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Estadisticas() {
  return (
    <EstadisticasProvider>
      <EstadisticasComponente />
    </EstadisticasProvider>
  );
}