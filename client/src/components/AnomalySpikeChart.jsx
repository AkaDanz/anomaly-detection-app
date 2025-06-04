import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  TimeScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LineElement,
  PointElement,
  TimeScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function AnomalySpikeChart({ records, zThreshold }) {
  if (!records || records.length === 0) return null;

  const timestamps = records.map((r) => r.timestamp);
  const values = records.map((r) => r.value);

  // Create vertical spikes where z_score > zThreshold
  const spikeData = records.map((r, i) =>
    Math.abs(r.z_score) > zThreshold ? r.value : null
  );

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: 'Value',
        data: values,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointRadius: 0,
        fill: false,
        tension: 0.2,
      },
      {
        label: 'Anomalies',
        data: spikeData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.3)',
        pointRadius: 0,
        fill: false,
        stepped: false,
        borderWidth: 1.5,
        segment: {
          borderDash: (ctx) => (ctx.p0.skip || ctx.p1.skip ? undefined : [4, 4]),
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        type: 'time',
        title: { display: true, text: 'Timestamp' },
      },
      y: {
        beginAtZero: false,
        title: { display: true, text: 'Value' },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow border h-[300px]">
      <h3 className="text-md font-semibold text-gray-800 mb-2">Anomaly Spike Line</h3>
      <Line data={data} options={options} />
    </div>
  );
}
