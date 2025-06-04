import React from 'react';
import { Chart as ChartJS, LinearScale, CategoryScale, Tooltip, Legend, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(LinearScale, CategoryScale, Tooltip, Legend, BarElement);

function getBoxPlotData(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q2 = sorted[Math.floor(sorted.length * 0.5)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerWhisker = Math.max(Math.min(...sorted), q1 - 1.5 * iqr);
  const upperWhisker = Math.min(Math.max(...sorted), q3 + 1.5 * iqr);
  const outliers = sorted.filter(v => v < lowerWhisker || v > upperWhisker);

  return { q1, q2, q3, lowerWhisker, upperWhisker, outliers };
}

export default function BoxPlotChart({ records, zThreshold }) {
  if (!records || records.length === 0) return null;

  const values = records.map(r => r.value);
  const { q1, q2, q3, lowerWhisker, upperWhisker } = getBoxPlotData(values);

  const data = {
    labels: ['Value Distribution'],
    datasets: [
      {
        label: 'Box',
        data: [q3 - q1],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        base: q1,
        borderSkipped: false,
      },
      {
        label: 'Whisker',
        data: [upperWhisker - lowerWhisker],
        backgroundColor: 'rgba(148, 163, 184, 0.2)',
        base: lowerWhisker,
        borderSkipped: false,
      },
      {
        label: 'Median',
        data: [1],
        backgroundColor: '#ef4444',
        base: q2,
        borderSkipped: false,
        barThickness: 2,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Value' },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow border h-[300px]">
      <h3 className="text-md font-semibold text-gray-800 mb-2">Box Plot</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
