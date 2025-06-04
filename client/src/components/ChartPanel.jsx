import React, { useRef, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  zoomPlugin
);

export default function ChartPanel({ data }) {
  const chartRef = useRef(null);
  const [zThreshold, setZThreshold] = useState(2);

  if (!data || data.length === 0) return null;

  // Support multiple files (each with records)
  return (
    <div className="space-y-8">
      {data.map((file, fileIdx) => {
        // Compute mean/std for this file
        const values = file.records.map(r => r.value);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
        const processedData = file.records.map((record) => {
          const zScore = std === 0 ? 0 : (record.value - mean) / std;
          return {
            ...record,
            is_anomaly: Math.abs(zScore) > zThreshold,
          };
        });
        const chartData = {
          labels: processedData.map((d) => d.timestamp),
          datasets: [
            {
              label: 'Value',
              data: processedData.map((d) => d.value),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.4,
              pointRadius: 3,
              pointHoverRadius: 6,
            },
            {
              label: 'Anomalies',
              data: processedData.map((d) => (d.is_anomaly ? d.value : null)),
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              pointBackgroundColor: 'rgba(255, 99, 132, 1)',
              pointBorderColor: 'rgba(255, 99, 132, 1)',
              pointRadius: 5,
              pointHoverRadius: 8,
              type: 'scatter',
              showLine: false,
            },
          ],
        };
        const options = {
          responsive: true,
          interaction: {
            mode: 'nearest',
            axis: 'x',
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
            zoom: {
              pan: {
                enabled: true,
                mode: 'x',
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: 'x',
              },
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                tooltipFormat: 'Pp',
              },
              title: {
                display: true,
                text: 'Timestamp',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Value',
              },
            },
          },
        };
        const handleResetZoom = () => {
          if (chartRef.current) {
            // react-chartjs-2 v5: chartRef.current is a ChartJS instance
            if (chartRef.current.resetZoom) chartRef.current.resetZoom();
            // v4: chartRef.current.chartInstance.resetZoom();
          }
        };
        return (
          <div key={fileIdx} className="p-4 bg-white rounded shadow">
            <div className="mb-4">
              <label htmlFor={`zThreshold-${fileIdx}`} className="block text-sm font-medium text-gray-700">
                Z-Score Threshold: {zThreshold}
              </label>
              <input
                id={`zThreshold-${fileIdx}`}
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={zThreshold}
                onChange={(e) => setZThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <Line ref={chartRef} data={chartData} options={options} />
            <button
              onClick={handleResetZoom}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reset Zoom
            </button>
          </div>
        );
      })}
    </div>
  );
}
