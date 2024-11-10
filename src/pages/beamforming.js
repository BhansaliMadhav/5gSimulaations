import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Constants
const BANDWIDTH = 100e6; // 100 MHz in Hz
const NOISE_FIGURE = 10 ** (-174 / 10); // -174 dBm/Hz thermal noise power at room temperature

// Utility function to convert capacity into readable units
function formatCapacity(capacity) {
  if (capacity < 1e3) return `${capacity.toFixed(2)} bps`;
  else if (capacity < 1e6) return `${(capacity / 1e3).toFixed(2)} kbps`;
  else if (capacity < 1e9) return `${(capacity / 1e6).toFixed(2)} mbps`;
  else return `${(capacity / 1e9).toFixed(2)} gbps`;
}

// Function to simulate beamforming techniques with user consideration
function simulateBeamforming(beamformingType, antennas, users, snr) {
  const snrLinear = Math.pow(10, snr / 10); // Convert SNR from dB to linear scale
  const noisePower = NOISE_FIGURE * BANDWIDTH; // Noise power based on bandwidth

  // Capacity calculation using the formula C = B * log2(1 + S/N)
  let capacity = BANDWIDTH * Math.log2(1 + snrLinear); // Basic capacity without beamforming

  if (beamformingType === "analog") {
    // Analog beamforming: Improved SINR with phase shifting
    capacity *= 1.15; // A simple factor to simulate SINR improvement
  } else if (beamformingType === "digital") {
    // Digital beamforming: Higher SINR due to per-antenna digital processing
    capacity *= 1.35; // Higher factor to simulate improvement
  } else if (beamformingType === "hybrid") {
    // Hybrid beamforming: A balance between analog and digital
    capacity *= 1.25; // Moderate improvement
  }

  // Capacity per user (C_user = C / users)
  const capacityPerUser = capacity / users;

  // Capacity is inversely affected by the number of users (divide total capacity by number of users)
  const effectiveCapacity = capacityPerUser / Math.sqrt(antennas); // Adjust based on antennas

  // Set a minimum threshold for capacity to avoid small values causing an empty graph
  return Math.max(effectiveCapacity, 1e3); // Set a lower threshold of 1000 bps
}

export default function BeamformingPage() {
  const [beamformingType, setBeamformingType] = useState("analog"); // Default to Analog Beamforming
  const [antennas, setAntennas] = useState(8); // Default to 8 antennas
  const [users, setUsers] = useState(10); // Default to 10 users
  const [snr, setSnr] = useState(10); // Default to SNR of 10 dB
  const [capacityData, setCapacityData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const antennasRange = Array.from({ length: antennas }, (_, i) => i + 1); // 1 to N antennas
    const capacityResults = antennasRange.map((antenna) =>
      simulateBeamforming(beamformingType, antenna, users, snr)
    );

    // Log the calculated capacity results to the console
    console.log(capacityResults); // Log the capacity data to debug

    // Set the chart data based on the capacity for the selected users and antennas
    const ctx = document.getElementById("beamformingChart").getContext("2d");
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: antennasRange,
        datasets: [
          {
            label: `${
              beamformingType.charAt(0).toUpperCase() + beamformingType.slice(1)
            } Beamforming Capacity vs Antennas`,
            data: capacityResults, // Use the calculated capacity for selected users
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
      options: {
        scales: {
          x: { title: { display: true, text: "Number of Antennas" } },
          y: {
            title: { display: true, text: "Capacity (bps)" },
            type: "logarithmic", // Using logarithmic scale
            ticks: {
              callback: function (value) {
                return formatCapacity(value); // Format y-axis labels
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [beamformingType, antennas, users, snr]);

  return (
    <div className="flex flex-col items-center p-5">
      <h2 className="text-2xl font-semibold mb-4">Beamforming Simulation</h2>

      {/* Chart */}
      <div className="w-7/10 mb-6">
        <canvas id="beamformingChart" className="w-full h-96"></canvas>
      </div>

      {/* Beamforming Selection */}
      <div className="mb-6">
        <label className="mr-4">Select Beamforming Technique:</label>
        <div className="flex space-x-4">
          <button
            onClick={() => setBeamformingType("analog")}
            className={`px-6 py-2 rounded-md transition-colors duration-300 transform ${
              beamformingType === "analog"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-300 focus:ring-2 focus:ring-blue-500"
            }`}
          >
            Analog
          </button>
          <button
            onClick={() => setBeamformingType("digital")}
            className={`px-6 py-2 rounded-md transition-colors duration-300 transform ${
              beamformingType === "digital"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-300 focus:ring-2 focus:ring-blue-500"
            }`}
          >
            Digital
          </button>
          <button
            onClick={() => setBeamformingType("hybrid")}
            className={`px-6 py-2 rounded-md transition-colors duration-300 transform ${
              beamformingType === "hybrid"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-300 focus:ring-2 focus:ring-blue-500"
            }`}
          >
            Hybrid
          </button>
        </div>
      </div>

      {/* Input Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="antennas" className="mb-2">
            Number of Antennas
          </label>
          <input
            type="number"
            id="antennas"
            min="1"
            value={antennas}
            onChange={(e) => setAntennas(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="users" className="mb-2">
            Number of Users
          </label>
          <input
            type="number"
            id="users"
            min="1"
            max="20"
            value={users}
            onChange={(e) => setUsers(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="snr" className="mb-2">
            Signal-to-Noise Ratio (SNR) in dB
          </label>
          <input
            type="number"
            id="snr"
            value={snr}
            onChange={(e) => setSnr(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border"
          />
        </div>
      </div>
    </div>
  );
}
