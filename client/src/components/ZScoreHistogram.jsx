import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function ZScoreHistogram({ records, zThreshold }) {
  if (!records || records.length === 0) return null;

  // Bin settings
  const binWidth = 0.5;
  const minZ = -5;
  const maxZ = 5;
  const numBins = Math.floor((maxZ - minZ) / binWidth);
  const bins = Array(numBins).fill(0);
  const labels = [];

  for (let i = 0; i < numBins; i++) {
    const lower = minZ + i * binWidth;
    const upper = lower + binWidth;
    labels.push(`${lower.toFixed(1)} to ${upper.toFixed(1)}`);
  }

  // Count z-scores into bins
  records.forEach(({ z_score }) => {
    if (z_score < minZ || z_score >= maxZ) return;
    const index = Math.floor((z_score - minZ) / binWidth);
    bins[index]++;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Z-score Distribution',
        data: bins,
        backgroundColor: labels.map((label, i) => {
          const lower = minZ + i * binWidth;
          const upper = lower + binWidth;
          return Math.abs(lower) >= zThreshold || Math.abs(upper) >= zThreshold
            ? 'rgba(239, 68, 68, 0.7)' // red
            : 'rgba(59, 130, 246, 0.6)'; // blue
        }),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'Z-Score Range' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Count' },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow border h-[300px]">
      <h3 className="text-md font-semibold text-gray-800 mb-2">Z-Score Histogram</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
