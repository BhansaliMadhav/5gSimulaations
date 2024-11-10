import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function MassiveMIMO() {
  const [users, setUsers] = useState(2);
  const spectralChartRef = useRef(null);
  const capacityChartRef = useRef(null);

  const calculatePerformance = (antennas, users) => {
    const snr = 25; // Higher SNR for 5G in dB
    const bandwidth = 100e6; // 100 MHz in Hz for 5G

    // Improved spectral efficiency calculation with higher SNR for 5G
    const spectralEfficiency = Math.log2(1 + snr * (antennas / users));

    // Calculate capacity using 5G bandwidth
    const capacity = spectralEfficiency * bandwidth;
    return { spectralEfficiency, capacity };
  };

  useEffect(() => {
    const antennaOptions = [8, 16, 32, 64];
    const spectralData = antennaOptions.map(
      (numAntennas) =>
        calculatePerformance(numAntennas, users).spectralEfficiency
    );
    const capacityData = antennaOptions.map(
      (numAntennas) => calculatePerformance(numAntennas, users).capacity / 1e6
    ); // Convert capacity to Mbps

    // Initialize Spectral Efficiency Chart
    const spectralCtx = document
      .getElementById("spectralChart")
      .getContext("2d");
    if (spectralChartRef.current) spectralChartRef.current.destroy();

    spectralChartRef.current = new Chart(spectralCtx, {
      type: "bar",
      data: {
        labels: antennaOptions,
        datasets: [
          {
            label: `Spectral Efficiency for ${users} Users`,
            data: spectralData,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Spectral Efficiency (bps/Hz)" },
          },
          x: { title: { display: true, text: "Number of Antennas" } },
        },
      },
    });

    // Initialize Capacity Chart
    const capacityCtx = document
      .getElementById("capacityChart")
      .getContext("2d");
    if (capacityChartRef.current) capacityChartRef.current.destroy();

    capacityChartRef.current = new Chart(capacityCtx, {
      type: "bar",
      data: {
        labels: antennaOptions,
        datasets: [
          {
            label: `Capacity for ${users} Users`,
            data: capacityData,
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Capacity (Mbps)" },
          },
          x: { title: { display: true, text: "Number of Antennas" } },
        },
      },
    });

    return () => {
      if (spectralChartRef.current) spectralChartRef.current.destroy();
      if (capacityChartRef.current) capacityChartRef.current.destroy();
    };
  }, [users]);

  return (
    <div className="flex flex-col items-center p-5">
      <div className="flex flex-row justify-center items-start space-x-8 mb-12 w-full max-w-6xl">
        <div className="w-[55%]">
          <h4 className="text-lg font-semibold text-center mb-4">
            Spectral Efficiency
          </h4>
          <canvas id="spectralChart"></canvas>
        </div>

        <div className="w-[55%]">
          <h4 className="text-lg font-semibold text-center mb-4">
            Capacity (in Mbps)
          </h4>
          <canvas id="capacityChart"></canvas>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center mb-6 w-full">
        <h3 className="text-xl font-semibold mb-4">Choose Number of Users</h3>
        <div className="flex space-x-4">
          {[2, 4, 8, 16].map((numUsers) => (
            <button
              key={numUsers}
              className={`px-4 py-2 rounded-lg text-white ${
                users === numUsers ? "bg-green-500" : "bg-gray-500"
              } hover:bg-green-400 focus:outline-none`}
              onClick={() => setUsers(numUsers)}
            >
              {numUsers} Users
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
