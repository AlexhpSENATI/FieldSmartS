// src/components/pages/Estadisticas.jsx
import React, { useContext, useState } from "react";
import { EstadisticasContext, EstadisticasProvider } from "../../context/EstadisticasContext";
import Logs from "../../components/pages/Logs";
import GraficaDona from "../../components/estadisticas/GraficaDona";
import { Bar, Pie } from "react-chartjs-2";
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
  humedadSuelo: "Humedad del suelo",
  humedadAmbiental: "Humedad ambiental",
  temperatura: "Temperatura",
};

// Nuevos colores vibrantes con gradientes
const COLORS = [
  "rgba(0, 230, 230, 0.8)", // Cian brillante - Humedad suelo
  "rgba(180, 70, 255, 0.8)", // Púrpura vibrante - Humedad ambiental
  "rgba(255, 100, 100, 0.8)", // Rojo coral - Temperatura
];

// Colores para fondos de gráficas
const CHART_BACKGROUNDS = [
  "rgba(0, 230, 230, 0.2)",
  "rgba(180, 70, 255, 0.2)",
  "rgba(255, 100, 100, 0.2)",
];

function parseFecha(d) {
  if (!d) return NaN;

  if (d.fecha_epoch) {
    return d.fecha_epoch * 1000;
  }

  if (typeof d.fechaHora === "number") {
    return d.fechaHora;
  }

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
  const [rango, setRango] = useState("actual");
  const [metrica, setMetrica] = useState("humedadSuelo");

  if (!datos || datos.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando datos...</p>
      </div>
    );
  }

  const obtenerDatosFiltrados = () => {
    if (rango === "actual") {
      return [datos[datos.length - 1]];
    }

    const ahora = Date.now();
    const limite = ahora - TIME_RANGES[rango];

    return datos.filter((d) => {
      const ts = parseFecha(d);
      return !isNaN(ts) && ts >= limite;
    });
  };

  const datosFiltrados = obtenerDatosFiltrados();

  const prepararDatosGraficos = () => {
    if (datosFiltrados.length === 0) {
      return { dataBar: { labels: [], datasets: [] }, dataPie: null };
    }

    if (rango === "actual") {
      const ultimo = datosFiltrados[0];
      const labels = ["Actual"];

      const dataBar = {
        labels,
        datasets: [
          {
            label: METRIC_NAMES.humedadSuelo,
            data: [ultimo.humedadSuelo || 0],
            backgroundColor: COLORS[0],
            borderColor: "#00ffff",
            borderWidth: 2,
            borderRadius: 6,
            hoverBackgroundColor: "rgba(0, 230, 230, 1)",
          },
          {
            label: METRIC_NAMES.humedadAmbiental,
            data: [ultimo.humedadAmbiental || 0],
            backgroundColor: COLORS[1],
            borderColor: "#b446ff",
            borderWidth: 2,
            borderRadius: 6,
            hoverBackgroundColor: "rgba(180, 70, 255, 1)",
          },
          {
            label: METRIC_NAMES.temperatura,
            data: [ultimo.temperatura || 0],
            backgroundColor: COLORS[2],
            borderColor: "#ff6464",
            borderWidth: 2,
            borderRadius: 6,
            hoverBackgroundColor: "rgba(255, 100, 100, 1)",
          },
        ],
      };

      const dataPie = {
        labels: Object.values(METRIC_NAMES),
        datasets: [
          {
            data: [
              ultimo.humedadSuelo || 0,
              ultimo.humedadAmbiental || 0,
              ultimo.temperatura || 0,
            ],
            backgroundColor: COLORS,
            borderColor: ["#00ffff", "#b446ff", "#ff6464"],
            borderWidth: 2,
            hoverBackgroundColor: [
              "rgba(0, 230, 230, 1)",
              "rgba(180, 70, 255, 1)",
              "rgba(255, 100, 100, 1)",
            ],
          },
        ],
      };

      return { dataBar, dataPie };
    }

    // ===============RANGO DE TIEMPO ================
    const labels = datosFiltrados.map((d) =>
      new Date(parseFecha(d)).toLocaleTimeString()
    );
    const valores = datosFiltrados.map((d) => d[metrica] || 0);

    const colorIndex = Object.keys(METRIC_NAMES).indexOf(metrica);

    const dataBar = {
      labels,
      datasets: [
        {
          label: METRIC_NAMES[metrica],
          data: valores,
          backgroundColor: CHART_BACKGROUNDS[colorIndex],
          borderColor: COLORS[colorIndex],
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: COLORS[colorIndex],
          pointBorderColor: "#ffffff",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    return { dataBar };
  };

  const { dataBar, dataPie } = prepararDatosGraficos();

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            size: 11,
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ffffff",
          font: {
            size: 12,
            weight: "bold",
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
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
          color: "#ffffff",
          font: {
            size: 12,
            weight: "bold",
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="estadisticas-container">
      {/* <div className="header-section">
        <h1 className="main-title">Panel de Estadísticas</h1>
        <p className="subtitle">Visualización de datos en tiempo real</p>
      </div> */}

      {/* <div className="controls-container">
        <div className="control-group">
          <label className="control-label">Rango de Tiempo</label>
          <select
            value={rango}
            onChange={(e) => setRango(e.target.value)}
            className="control-select"
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

        {rango !== "actual" && (
          <div className="control-group">
            <label className="control-label">Seleccionar Métrica</label>
            <select
              value={metrica}
              onChange={(e) => setMetrica(e.target.value)}
              className="control-select"
            >
              <option value="humedadSuelo">Humedad del suelo</option>
              <option value="humedadAmbiental">Humedad ambiental</option>
              <option value="temperatura">Temperatura</option>
            </select>
          </div>
        )}
      </div> */}

      <div className="card glow-effect">
        <div className="card-header">
          <h2 className="card-title">
            {rango === "actual"
              ? "Último dato registrado"
              : `Evolución de ${METRIC_NAMES[metrica]}`}
          </h2>
          <div className="card-badge">
            {datosFiltrados.length} {rango === "actual" ? "dato" : "datos"}
          </div>
        </div>
        <div className="controls-container">
          <div className="control-group">
            <label className="control-label">Rango de Tiempo</label>
            <select
              value={rango}
              onChange={(e) => setRango(e.target.value)}
              className="control-select"
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

          {rango !== "actual" && (
            <div className="control-group">
              <label className="control-label">Seleccionar Métrica</label>
              <select
                value={metrica}
                onChange={(e) => setMetrica(e.target.value)}
                className="control-select"
              >
                <option value="humedadSuelo">Humedad del suelo</option>
                <option value="humedadAmbiental">Humedad ambiental</option>
                <option value="temperatura">Temperatura</option>
              </select>
            </div>
          )}
        </div>


        <div className="card-content">
          <div className={`graficos-container ${rango === "actual" ? "dual-charts" : "single-chart"}`}>
            <div className="grafico-item bar-chart">
              <Bar
                data={dataBar}
                options={barOptions}
                height={rango === "actual" ? 280 : 350}
                width="100%"
              />
            </div>

            {rango === "actual" && dataPie && (
              <div className="grafico-item pie-chart">
                <Pie
                  data={dataPie}
                  options={pieOptions}
                  height={280}
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
      <GraficaDona />
      {/* <Logs /> */}
    </EstadisticasProvider>
  );
}