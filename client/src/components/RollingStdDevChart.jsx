import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, Legend);

function calcRollingStd(records, window = 15) {
  const std = [];
  for (let i = 0; i < records.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = records.slice(start, i + 1).map(r => r.value);
    const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
    const s = Math.sqrt(slice.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / slice.length);
    std.push(s);
  }
  return std;
}

export default function RollingStdDevChart({ records }) {
  if (!records || records.length === 0) return null;
  const timestamps = records.map(r => r.timestamp);
  const std = calcRollingStd(records, 15);

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: 'Rolling Std Dev (15 samples)',
        data: std,
        borderColor: 'rgb(251, 146, 60)', // Tailwind orange-400
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        pointRadius: 0,
        tension: 0.4,
        borderWidth: 2,
        fill: true,
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
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM d',
            hour: 'HH:mm',
          },
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 6,
          maxRotation: 0,
          minRotation: 0,
          font: { size: 10 },
        },
        grid: {
          drawOnChartArea: true,
        },
      },
      y: {},
    },
  };

  return <Line data={data} options={options} />;
}
