import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Constants for propagation models
const OKUMURA_HATA = "urban";
const INDOOR = "indoor";

// Okumura-Hata model parameters for urban environment
function okunmuraHataModel(frequency, bsHeight, mobileHeight, distance) {
  const aMobile = 3.2 * Math.pow(Math.log10(11.75 * mobileHeight), 2) - 4.97; // Correction factor for mobile height
  const pathLoss =
    69.55 +
    26.16 * Math.log10(frequency) -
    13.82 * Math.log10(bsHeight) -
    aMobile +
    (44.9 - 6.55 * Math.log10(bsHeight)) * Math.log10(distance);
  return pathLoss;
}

// Indoor propagation model for small office environment
function indoorModel(frequency, distance) {
  const pathLoss =
    40 * Math.log10(distance) + 20 * Math.log10(frequency) - 147.55;
  return pathLoss;
}

export default function MmWavePage() {
  const [environment, setEnvironment] = useState(OKUMURA_HATA); // Default to Urban environment
  const [frequency, setFrequency] = useState(100); // Default frequency for mmWave (28 GHz)
  const [distance, setDistance] = useState(1); // Default distance (1 km)
  const [bsHeight, setBsHeight] = useState(30); // Default Base Station height (30 meters)
  const [mobileHeight, setMobileHeight] = useState(1.5); // Default mobile height (1.5 meters)
  const [pathLossData, setPathLossData] = useState([]);
  const chartRef = useRef(null);

  // Calculate path loss for the selected environment
  useEffect(() => {
    const distances = Array.from({ length: 20 }, (_, i) => i + 1); // Simulate for distances from 1 to 20 km
    const losses = distances.map((d) => {
      if (environment === OKUMURA_HATA) {
        return okunmuraHataModel(frequency, bsHeight, mobileHeight, d);
      } else {
        return indoorModel(frequency, d);
      }
    });

    // Update the chart with new data
    const ctx = document.getElementById("mmWaveChart").getContext("2d");
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: distances,
        datasets: [
          {
            label: `Path Loss (${
              environment === OKUMURA_HATA ? "Urban" : "Indoor"
            }) Environment`,
            data: losses,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Distance (km)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Path Loss (dB)",
            },
            ticks: {
              beginAtZero: true,
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [environment, frequency, distance, bsHeight, mobileHeight]);

  return (
    <div className="flex flex-col items-center p-5">
      <h2 className="text-2xl font-semibold mb-4">
        mmWave Propagation Simulation
      </h2>

      {/* Chart */}
      <div className="w-7/10 mb-6">
        <canvas id="mmWaveChart" className="w-full h-96"></canvas>
      </div>

      {/* Environment Selection */}
      <div className="mb-6">
        <label className="mr-4">Select Environment Type:</label>
        <div className="flex space-x-4">
          <button
            onClick={() => setEnvironment(OKUMURA_HATA)}
            className={`px-6 py-2 rounded-md transition-colors duration-300 transform ${
              environment === OKUMURA_HATA
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-300 focus:ring-2 focus:ring-blue-500"
            }`}
          >
            Urban (Okumura-Hata)
          </button>
          <button
            onClick={() => setEnvironment(INDOOR)}
            className={`px-6 py-2 rounded-md transition-colors duration-300 transform ${
              environment === INDOOR
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-300 focus:ring-2 focus:ring-blue-500"
            }`}
          >
            Indoor
          </button>
        </div>
      </div>

      {/* Input Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="frequency" className="mb-2">
            Frequency (MHz)
          </label>
          <input
            type="number"
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="bsHeight" className="mb-2">
            Base Station Height (m)
          </label>
          <input
            type="number"
            id="bsHeight"
            value={bsHeight}
            onChange={(e) => setBsHeight(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="mobileHeight" className="mb-2">
            Mobile Height (m)
          </label>
          <input
            type="number"
            id="mobileHeight"
            value={mobileHeight}
            onChange={(e) => setMobileHeight(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border"
          />
        </div>
      </div>
    </div>
  );
}
