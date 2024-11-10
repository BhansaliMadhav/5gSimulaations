import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Approximation for the error function (erf)
function erf(x) {
  // Constants used in the approximation
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741;
  const a4 = -1.453152027,
    a5 = 1.061405429;
  const p = 0.3275911;

  // Save the sign of x
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  // Calculate approximation
  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

// Q-function using the erf approximation
function qFunction(x) {
  return 0.5 * (1 - erf(x / Math.sqrt(2)));
}

// Exact BER calculation based on modulation scheme
function calculateBER(modulation, snr) {
  switch (modulation) {
    case "BPSK":
      return qFunction(Math.sqrt(2 * snr));
    case "QPSK":
      return qFunction(Math.sqrt(2 * snr));
    case "16-QAM":
      return (3 / 8) * qFunction(Math.sqrt((4 / 5) * snr));
    case "64-QAM":
      return (7 / 24) * qFunction(Math.sqrt((6 / 7) * snr));
    default:
      return null;
  }
}

export default function MCSPage() {
  const [modulation, setModulation] = useState("BPSK");
  const [snrValues, setSnrValues] = useState([]);
  const [berValues, setBerValues] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const snrRange = Array.from({ length: 20 }, (_, i) => i + 1); // SNR from 1 to 20 dB
    const berData = snrRange.map((snr) =>
      calculateBER(modulation, Math.pow(10, snr / 10))
    ); // Convert dB to linear scale for SNR

    setSnrValues(snrRange);
    setBerValues(berData);

    const ctx = document.getElementById("mcsChart").getContext("2d");
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: snrRange,
        datasets: [
          {
            label: `BER for ${modulation}`,
            data: berData,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
      options: {
        scales: {
          x: { title: { display: true, text: "SNR (dB)" } },
          y: {
            // type: "logarithmic",
            title: { display: true, text: "BER" },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [modulation]);

  return (
    <div className="flex flex-col items-center p-5">
      <h2 className="text-2xl font-semibold mb-4">
        Modulation and Coding Schemes (MCS)
      </h2>

      <div className="flex justify-center space-x-4 mb-6">
        {["BPSK", "QPSK", "16-QAM", "64-QAM"].map((mod) => (
          <button
            key={mod}
            className={`px-4 py-2 rounded-lg text-white ${
              modulation === mod ? "bg-blue-600" : "bg-gray-600"
            } hover:bg-blue-400`}
            onClick={() => setModulation(mod)}
          >
            {mod}
          </button>
        ))}
      </div>

      <div className="w-4/5 max-w-4xl mb-8">
        <canvas id="mcsChart"></canvas>
      </div>
    </div>
  );
}
