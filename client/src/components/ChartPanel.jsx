import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import InfoTooltip from './InfoTooltip';
import { useZThreshold } from '../context/ZThresholdContext.jsx';
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

export default function ChartPanel({ data, className }) {
  const chartRef = useRef(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const { zThreshold, setZThreshold } = useZThreshold();
  const sliderValue = zThreshold;

  // Reset zoom handler
  const handleResetZoom = () => {
    if (chartRef.current && chartRef.current.firstChild && chartRef.current.firstChild.chart) {
      chartRef.current.firstChild.chart.resetZoom();
    } else if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.resetZoom();
    }
  };

  // Download/export handlers
  const handleExportPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const chartWidth = pageWidth - 40;
    const chartHeight = (canvas.height * chartWidth) / canvas.width;
    pdf.setFontSize(16);
    pdf.text('📈 Anomaly Detection Report', 20, 20);
    pdf.setFontSize(12);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    pdf.text(`Z-Score Threshold: ${zThreshold}`, 20, 38);
    pdf.text(`Detected Anomalies: ${filteredRecords.filter(r => r.is_anomaly).length}`, 20, 46);
    pdf.addImage(imgData, 'PNG', 20, 55, chartWidth, chartHeight);
    pdf.save('anomaly_report.pdf');
  };

  const handleDownloadCSV = () => {
    if (!filteredRecords.length) return;
    const header = Object.keys(filteredRecords[0]);
    const csv = [
      header.join(','),
      ...filteredRecords.map(row =>
        header.map(key => JSON.stringify(row[key] ?? '')).join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'anomalies_export.csv';
    link.click();
  };

  const handleDownloadExcel = () => {
    if (!filteredRecords.length) return;
    const worksheet = XLSX.utils.json_to_sheet(filteredRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Anomalies');
    XLSX.writeFile(workbook, 'anomalies_export.xlsx');
  };

  // Render nothing if no data
  if (!data || data.length === 0) return null;

  return (
    <>
      <div className={`space-y-2 w-full p-[25px] ${className || ''}`}>
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <InfoTooltip text={
              'Zoom: Hold Ctrl (Windows/Linux) or Cmd (Mac) and scroll to zoom horizontally.\nPan: Drag chart left/right.\nClick "Reset Zoom" to reset.'
            } />
            <button
              type="button"
              onClick={handleResetZoom}
              className="ml-2 px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700"
            >
              Reset Zoom
            </button>
          </div>
          <div className="w-full md:w-[300px] flex flex-col">
            <label htmlFor="z-threshold-slider" className="text-xs text-gray-600 mb-1">
              Z-score Threshold
            </label>
            <div className="flex items-center gap-2">
              <input
                id="z-threshold-slider"
                type="range"
                min={0.5}
                max={5}
                step={0.1}
                value={sliderValue}
                onChange={e => setZThreshold(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-xs text-gray-700 w-8 text-right">{sliderValue.toFixed(1)}</span>
            </div>
          </div>
        </div>
        {/* Chart(s) */}
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            Anomaly Chart
            <InfoTooltip text="Visualizes time series values and detected anomalies. Red dots = points where Z-score exceeds threshold." />
          </h2>
        </div>
        {/* TODO: In the future, implement a toggle to merge multiple uploaded files
        and display their combined records in one chart and one data table. */}

        {/* Only show the first file's chart */}
        {data.length > 0 && (
          <div key={0} className="bg-white rounded shadow border h-[600px] w-full">
            <div className="h-[600px]" ref={chartRef}>
              <Line ref={chartRef} data={chartDataForFile(data[0], zThreshold)} options={optionsForFile(data[0], zThreshold)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Helper functions for chart data/options
function chartDataForFile(file, zThreshold) {
  const values = file.records.map(r => r.value);
  const timestamps = file.records.map(r => r.timestamp);
  const records = file.records;
  const sliderValue = zThreshold;
  const sorted = [...records].map(r => r.value).sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  return {
    labels: timestamps,
    datasets: [
      {
        label: 'Raw Value',
        data: values,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'Median',
        data: records.map(r => ({ x: r.timestamp, y: median })),
        type: 'line',
        borderColor: 'rgba(107, 114, 128, 0.6)',
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0,
      },
      {
        label: `+Z Threshold`,
        data: records.map(r => ({ x: r.timestamp, y: sliderValue })),
        type: 'line',
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [6, 6],
        pointRadius: 0,
        borderWidth: 1.5,
        yAxisID: 'z',
      },
      {
        label: `-Z Threshold`,
        data: records.map(r => ({ x: r.timestamp, y: -sliderValue })),
        type: 'line',
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [6, 6],
        pointRadius: 0,
        borderWidth: 1.5,
        yAxisID: 'z',
      },
      {
        label: 'Anomalies',
        data: records.filter(r => Math.abs(r.z_score) > sliderValue),
        parsing: {
          xAxisKey: 'timestamp',
          yAxisKey: 'value',
        },
        type: 'scatter',
        backgroundColor: 'rgb(220, 38, 38)',
        radius: 5,
        pointStyle: 'circle',
        borderWidth: 0,
        hoverRadius: 7,
      },
    ],
  };
}

function optionsForFile(file, zThreshold) {
  const sliderValue = zThreshold;
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: 'ctrl',
          },
          pinch: { enabled: true },
          mode: 'x',
        },
        limits: {
          x: { minRange: 5 },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        title: { display: true, text: 'Timestamp' },
      },
      y: {
        title: { display: true, text: 'Value' },
      },
      z: {
        position: 'right',
        display: true,
        min: -5,
        max: 5,
        title: { display: true, text: 'Z-score' },
        grid: { drawOnChartArea: false },
      },
    },
  };
}
