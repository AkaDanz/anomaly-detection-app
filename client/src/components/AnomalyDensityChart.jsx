import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { format, parseISO } from 'date-fns';
import { useZThreshold } from '../context/ZThresholdContext.jsx';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AnomalyDensityChart({ records }) {
  const { zThreshold } = useZThreshold();
  if (!records || records.length === 0) return null;

  // Filter anomalies
  const anomalies = records.filter(r => typeof r.z_score === 'number' && Math.abs(r.z_score) > zThreshold);

  // Bucket by hour
  const buckets = {};
  anomalies.forEach(r => {
    const hour = format(parseISO(r.timestamp), 'yyyy-MM-dd HH:00');
    buckets[hour] = (buckets[hour] || 0) + 1;
  });
  const labels = Object.keys(buckets).sort();
  const data = labels.map(l => buckets[l]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Anomalies per Hour',
        data,
        backgroundColor: 'rgb(220, 38, 38)', // Tailwind red-600
        borderRadius: 4,
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
        type: 'time',
        time: {
          unit: 'hour',
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
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
