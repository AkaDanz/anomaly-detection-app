import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler
);

function calculateRollingStats(records, window = 7) {
  const mean = [];
  const std = [];

  for (let i = 0; i < records.length; i++) {
    const start = Math.max(0, i - window + 1);
    const windowSlice = records.slice(start, i + 1).map(r => r.value);
    const m = windowSlice.reduce((a, b) => a + b, 0) / windowSlice.length;
    const s = Math.sqrt(
      windowSlice.reduce((acc, val) => acc + Math.pow(val - m, 2), 0) / windowSlice.length
    );
    mean.push(m);
    std.push(s);
  }

  return { mean, std };
}

export default function RollingStatsChart({ records }) {
  if (!records || records.length === 0) return null;

  const timestamps = records.map(r => r.timestamp);
  const values = records.map(r => r.value);

  const { mean, std } = calculateRollingStats(records);

  const upperBound = mean.map((m, i) => m + std[i]);
  const lowerBound = mean.map((m, i) => m - std[i]);

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: 'Value',
        data: values,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'Rolling Mean',
        data: mean,
        borderColor: '#10b981',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: 'Rolling Std ±1σ',
        data: upperBound,
        borderColor: 'transparent',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: '+1',
        pointRadius: 0,
      },
      {
        label: '',
        data: lowerBound,
        borderColor: 'transparent',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: '-1',
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
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
