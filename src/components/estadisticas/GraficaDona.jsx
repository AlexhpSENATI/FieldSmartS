import React, { useContext, useState } from "react";
import { EstadisticasContext } from "../../context/EstadisticasContext";
import "../../styles/EstadisticaDona.css";
import { Bar } from "react-chartjs-2";
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

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

const BAR_COLORS = {
  promedio: "rgba(241, 196, 15, 0.8)",    
  maximo: "rgba(46, 204, 113, 0.8)",       
  minimo: "rgba(231, 76, 60, 0.8)"       
};




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

  if (!datos || datos.length === 0) {
    return (
      <div className="stats-loading">
        {/* <div className="stats-spinner"></div> */}
        {/* <p className="stats-loading-text"></p> */}
      </div>
    );
  }

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
      let clave = rango === "7d"
        ? WEEK_DAYS[fecha.getDay()]
        : MONTHS[fecha.getMonth()];

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

  if (orden !== "default") {
    labels = [...labels].sort((a, b) => {
      const valA = agrupado[a].temperatura;
      const valB = agrupado[b].temperatura;
      return orden === "desc" ? valB - valA : valA - valB;
    });
  }

  const prepararBarras = (metrica) => ({
    labels,
    datasets: [
      {
        label: "Promedio",
        data: labels.map((k) => agrupado[k][metrica]),
        backgroundColor: BAR_COLORS.promedio,
        borderColor: "#f39c12",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Máximo",
        data: labels.map((k) => agrupado[k][`${metrica}Max`]),
        backgroundColor: BAR_COLORS.maximo,
        borderColor: "#27ae60",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Mínimo",
        data: labels.map((k) => agrupado[k][`${metrica}Min`]),
        backgroundColor: BAR_COLORS.minimo,
        borderColor: "#c0392b",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ecf0f1",
          font: {
            size: 11,
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(236, 240, 241, 0.1)"
        },
        ticks: {
          color: "rgba(236, 240, 241, 0.7)",
          font: {
            size: 9
          },
          maxTicksLimit: 5
        }
      },
      x: {
        grid: {
          color: "rgba(236, 240, 241, 0.1)"
        },
        ticks: {
          color: "rgba(236, 240, 241, 0.7)",
          font: {
            size: 9
          }
        }
      }
    }
  };

  return (
    <div className="stats-container">
      {/* TITULO */}
      <div className='dona-title'>
        <h1>Barras de Promedio, Máximo y Mínimo </h1>
      </div>
      {/* FILTRAR POR ORDEN DE DATOS  */}
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
      {/* GRAFICA DE BARRAS DE TEMPERATURA, HUMEDAD AMBIENTAL Y HUMEDAD DE SUELO */}
      <div className="stats-main-card">
        <div className="stats-horizontal-container">
          {/* TEMPERATURA */}
          <div className="stats-chart-box">
            <h3 className="stats-chart-title">Temperatura (°C)</h3>
            <div className="stats-chart-container">
              <Bar
                data={prepararBarras("temperatura")}
                options={chartOptions}
              />
            </div>
          </div>
          {/* HUMEDAD AMBIENTAL */}
          <div className="stats-chart-box">
            <h3 className="stats-chart-title">Humedad Ambiental (%)</h3>
            <div className="stats-chart-container">
              <Bar
                data={prepararBarras("humedadAmbiental")}
                options={chartOptions}
              />
            </div>
          </div>
          {/* HUMEDAD DE SUELO */}
          <div className="stats-chart-box">
            <h3 className="stats-chart-title">Humedad del Suelo (%)</h3>
            <div className="stats-chart-container">
              <Bar
                data={prepararBarras("humedadSuelo")}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}