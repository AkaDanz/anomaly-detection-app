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

export default function CumulativeAnomaliesChart({ records }) {
  if (!records || records.length === 0) return null;

  const timestamps = [];
  const cumulative = [];

  let count = 0;
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    timestamps.push(r.timestamp);
    if (r.is_anomaly) count += 1;
    cumulative.push(count);
  }

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: 'Cumulative Anomalies',
        data: cumulative,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 2,
        stepped: true,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        title: {
          display: true,
          text: 'Timestamp',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cumulative Count',
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow border h-[300px]">
      <h3 className="text-md font-semibold text-gray-800 mb-2">Cumulative Anomaly Count</h3>
      <Line data={data} options={options} />
    </div>
  );
}
