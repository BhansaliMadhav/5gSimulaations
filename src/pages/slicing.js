import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

// Service Types
const EMBB = "eMBB";
const URLLC = "URLLC";
const MMTC = "mMTC";

// Non-linear throughput models
const simulateThroughput = (load, service) => {
  const maxThroughput = 1000; // Maximum throughput value (Mbps)

  switch (service) {
    case EMBB:
      return Math.min(maxThroughput, 100 * Math.log10(load + 1)); // Saturates after a certain point
    case URLLC:
      return Math.min(maxThroughput, 50 * Math.pow(load, 0.7)); // Slower growth as traffic increases
    case MMTC:
      return Math.min(maxThroughput, 30 * Math.log10(load + 1)); // Lower throughput compared to eMBB
    default:
      return 0;
  }
};

// Latency models (in milliseconds)
const simulateLatency = (load, service) => {
  switch (service) {
    case EMBB:
      return 10 + load * 0.2; // Higher latency as load increases
    case URLLC:
      return Math.max(1, 2 + load * 0.1); // Low latency for URLLC
    case MMTC:
      return 15 + load * 0.5; // Higher latency for mMTC
    default:
      return 0;
  }
};

const NetworkSlicing = () => {
  const [serviceType, setServiceType] = useState(EMBB);
  const [numUsers, setNumUsers] = useState(10);
  const [load, setLoad] = useState(1);

  // Generate throughput and latency data for chart
  const generateData = () => {
    let labels = [];
    let throughputData = [];
    let latencyData = [];

    for (let i = 1; i <= numUsers; i++) {
      labels.push(`User ${i}`);
      throughputData.push(simulateThroughput(load * i, serviceType)); // Throughput data
      latencyData.push(simulateLatency(load * i, serviceType)); // Latency data
    }

    return {
      labels,
      datasets: [
        {
          label: `${serviceType} Throughput`,
          data: throughputData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
        },
        {
          label: `${serviceType} Latency`,
          data: latencyData,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.1,
        },
      ],
    };
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Network Slicing: ${serviceType} Throughput and Latency`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Number of Users",
        },
      },
      y: {
        title: {
          display: true,
          text: "Throughput (Mbps) / Latency (ms)",
        },
        beginAtZero: true,
      },
    },
  };

  // Calculate latency for the service and number of users
  const latency = simulateLatency(load * numUsers, serviceType);

  return (
    <div className="p-8">
      {/* Centered Page Heading */}
      <h1 className="text-2xl font-bold text-center mb-6">
        Network Slicing Simulation
      </h1>

      {/* Charts */}
      <div
        className="mb-4"
        style={{ width: "70%", margin: "0 auto", marginTop: "30px" }}
      >
        <Line data={generateData()} options={options} />
      </div>

      {/* Inputs for load and users (horizontally aligned) */}
      <div className="flex justify-center items-center space-x-8 mb-8">
        <div>
          <label htmlFor="numUsers" className="block text-lg mb-2">
            Number of Users
          </label>
          <input
            type="number"
            id="numUsers"
            value={numUsers}
            onChange={(e) => setNumUsers(Math.max(1, Number(e.target.value)))}
            className="p-2 border rounded-md"
            min={1}
          />
        </div>

        <div>
          <label htmlFor="load" className="block text-lg mb-2">
            Traffic Load
          </label>
          <input
            type="number"
            id="load"
            value={load}
            onChange={(e) => setLoad(Math.max(1, Number(e.target.value)))}
            className="p-2 border rounded-md"
            min={1}
          />
        </div>
      </div>

      {/* Latency Display */}
      <div className="text-lg font-semibold mt-6">
        <p>
          Calculated Latency for {numUsers} Users and {serviceType} Service:{" "}
          <span className="text-red-500">{latency.toFixed(2)} ms</span>
        </p>
      </div>

      {/* Service Type Buttons (Moved below the chart) */}
      <div className="mb-4">
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => setServiceType(EMBB)}
            className={`py-2 px-4 rounded-md ${
              serviceType === EMBB ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            eMBB
          </button>
          <button
            onClick={() => setServiceType(URLLC)}
            className={`py-2 px-4 rounded-md ${
              serviceType === URLLC ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            URLLC
          </button>
          <button
            onClick={() => setServiceType(MMTC)}
            className={`py-2 px-4 rounded-md ${
              serviceType === MMTC ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            mMTC
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkSlicing;
