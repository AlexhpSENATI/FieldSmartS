// src/components/estadisticas/GraficasEstadisticas.jsx
import React, { useContext, useState } from "react";
import { EstadisticasContext } from "../../context/EstadisticasContext";
import { Bar, Doughnut } from "react-chartjs-2";
import "../../styles/EstadisticaDona.css";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
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

const WEEK_DAYS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

const COLORS_DAYS = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
  "#9966FF", "#FF9F40", "#66FF66"
];
const COLORS_MONTHS = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
  "#9966FF", "#FF9F40", "#66FF66", "#C9CBCF",
  "#E7E9ED", "#A2FF99", "#FF99C8", "#99E6FF"
];

function parseFecha(d) {
  if (!d) return NaN;
  if (d.fecha_epoch) return d.fecha_epoch * 1000;
  if (typeof d.fechaHora === "number") return d.fechaHora;
  if (d.fecha_texto) return new Date(d.fecha_texto).getTime();
  if (d.fechaHora) return new Date(d.fechaHora).getTime();
  return NaN;
}

export default function GraficasEstadisticas() {
  const { datos } = useContext(EstadisticasContext);
  const [rango, setRango] = useState("7d");
  const [orden, setOrden] = useState("default");

  if (!datos || datos.length === 0) return <p className="text-gray-500"></p>;

  const obtenerDatosFiltrados = () => {
    const ahora = Date.now();
    const limite = ahora - TIME_RANGES[rango];
    return datos.filter((d) => {
      const ts = parseFecha(d);
      return !isNaN(ts) && ts >= limite;
    });
  };

  const datosFiltrados = obtenerDatosFiltrados();

  const promedio = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const agruparDatos = () => {
    const agrupado = {};
    datosFiltrados.forEach((d) => {
      const ts = parseFecha(d);
      if (isNaN(ts)) return;

      const fecha = new Date(ts);
      let clave =
        rango === "7d"
          ? fecha.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase()
          : fecha.toLocaleDateString("es-ES", { month: "long" }).toLowerCase();

      if (!agrupado[clave]) {
        agrupado[clave] = { humedadSuelo: [], humedadAmbiental: [], temperatura: [] };
      }
      agrupado[clave].humedadSuelo.push(d.humedadSuelo || 0);
      agrupado[clave].humedadAmbiental.push(d.humedadAmbiental || 0);
      agrupado[clave].temperatura.push(d.temperatura || 0);
    });

    const base = rango === "7d" ? WEEK_DAYS : MONTHS;
    const result = {};
    base.forEach((k) => {
      const datosK = agrupado[k] || { humedadSuelo: [0], humedadAmbiental: [0], temperatura: [0] };
      result[k] = {
        humedadSuelo: promedio(datosK.humedadSuelo),
        humedadSueloMin: Math.min(...datosK.humedadSuelo),
        humedadSueloMax: Math.max(...datosK.humedadSuelo),
        humedadAmbiental: promedio(datosK.humedadAmbiental),
        humedadAmbientalMin: Math.min(...datosK.humedadAmbiental),
        humedadAmbientalMax: Math.max(...datosK.humedadAmbiental),
        temperatura: promedio(datosK.temperatura),
        temperaturaMin: Math.min(...datosK.temperatura),
        temperaturaMax: Math.max(...datosK.temperatura),
      };
    });
    return result;
  };

  let agrupado = agruparDatos();
  let labels = rango === "7d" ? WEEK_DAYS : MONTHS;
  const colors = rango === "7d" ? COLORS_DAYS : COLORS_MONTHS;

  if (orden !== "default") {
    labels = [...labels].sort((a, b) => {
      const valA = agrupado[a].temperatura;
      const valB = agrupado[b].temperatura;
      return orden === "desc" ? valB - valA : valA - valB;
    });
  }

  const prepararDona = (metrica) => ({
    labels,
    datasets: [
      {
        label: METRIC_NAMES[metrica],
        data: labels.map((k) => agrupado[k][metrica]),
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
      },
    ],
  });

  const prepararBarras = (metrica) => ({
    labels,
    datasets: [
      { label: "Promedio", data: labels.map((k) => agrupado[k][metrica]), backgroundColor: "#36A2EB" },
      { label: "Máximo", data: labels.map((k) => agrupado[k][`${metrica}Max`]), backgroundColor: "#4BC0C0" },
      { label: "Mínimo", data: labels.map((k) => agrupado[k][`${metrica}Min`]), backgroundColor: "#FF6384" },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top", labels: { font: { size: 10 } } } },
  };

  return (
    <div className="donas-container">

      <br />
      <div className="card-header-donas">
        <h2 className="card-title">
          {rango === "actual"
            ? "Estado actual de"
            : `Evolución de `}
        </h2>

      </div>
      {/*============================CONTROLES================================== */}

      <div className="controls-donas">
        <div className="control-group-donas">
          <label className="donas-label">Rango:</label>
          <select
            className="donas-select"
            value={rango}
            onChange={(e) => setRango(e.target.value)}
          >
            <option value="7d">Últimos 7 días</option>
            <option value="1m">Último mes</option>
          </select>
        </div>

        <div className="control-group-donas">
          <label className="donas-label">Orden:</label>
          <select
            className="donas-select"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="default">Por defecto</option>
            <option value="desc">Mayor a menor</option>
            <option value="asc">Menor a mayor</option>
          </select>
        </div>
      </div>
      <br />



      {/* Donas */}
      {/* <div className="donas-card-header">
        <h2 className="donas-card-title">Donas - {rango === "7d" ? "Por día de la semana" : "Por mes"}</h2>
      </div> */}
      {/*=====================================GRAFICO DE DONAS====================================== */}
      {/* <div className="donas-card">

        <div className="donas-card-content donas-flex">
          <div className="donas-item"><Doughnut data={prepararDona("temperatura")} options={chartOptions} height={250} /></div>
          <div className="donas-item"><Doughnut data={prepararDona("humedadSuelo")} options={chartOptions} height={250} /></div>
          <div className="donas-item"><Doughnut data={prepararDona("humedadAmbiental")} options={chartOptions} height={250} /></div>
        </div>
      </div> */}
      <div className="donas-card-header">
        <h2 className="donas-card-title">Barras - Promedio, Máximo y Mínimo</h2>
      </div>
      {/*=====================================GRAFICO DE BARRAS====================================== */}
      <div className="donas-card">

        <div className="donas-card-content donas-flex">
          <div className="donas-item"><Bar data={prepararBarras("temperatura")} options={chartOptions} height={300} /></div>
          <div className="donas-item"><Bar data={prepararBarras("humedadSuelo")} options={chartOptions} height={300} /></div>
          <div className="donas-item"><Bar data={prepararBarras("humedadAmbiental")} options={chartOptions} height={300} /></div>
        </div>
      </div>
    </div>
  );
}
