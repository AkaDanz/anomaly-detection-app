import React, { useState } from 'react';
import UploadCard from './components/UploadCard';
import ChartPanel from './components/ChartPanel';
import RollingStatsChart from './components/RollingStatsChart';
import CumulativeAnomaliesChart from './components/CumulativeAnomaliesChart';
import ZScoreHistogram from './components/ZScoreHistogram';
import RollingStdDevChart from './components/RollingStdDevChart';
import DataTableAndExports from './components/DataTableAndExports';
import InfoTooltip from './components/InfoTooltip';
import AnomalyDensityChart from './components/AnomalyDensityChart';

const DEFAULT_Z = 2;

function addZScores(records) {
  const values = records.map(r => r.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = Math.sqrt(values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length);
  return records.map(r => ({
    ...r,
    z_score: std === 0 ? 0 : (r.value - mean) / std,
  }));
}

function App() {
  const [results, setResults] = useState([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const handleUpload = (rawResults) => {
    const enriched = rawResults.map(file => ({
      ...file,
      records: addZScores(file.records),
    }));
    setResults(enriched);
    setActiveFileIndex(0);
  };

  const records = results[activeFileIndex]?.records || [];

  // Export/download handlers (moved from ChartPanel)
  const handleExportPDF = async () => {
    // You may want to move the PDF export logic here from ChartPanel
  };
  const handleDownloadCSV = () => {
    // You may want to move the CSV export logic here from ChartPanel
  };
  const handleDownloadExcel = () => {
    // You may want to move the Excel export logic here from ChartPanel
  };

  return (
    <div className="space-y-6 w-full">
      {/* Fixed Header - full width */}
      <div className="backdrop-blur bg-blue-100/80 border-b border-blue-200 flex justify-between items-center shadow-lg rounded-t-none rounded-b px-4 w-full h-[120px]" style={{ position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 24px 0 rgba(30, 64, 175, 0.10)' }}>
        <h1 className="text-3xl font-extrabold text-gray-800 w-full text-left pl-[100px]">Anomaly Detector v2.2</h1>
        <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition">Demo</button>
      </div>
      {/* UploadCard */}
      <div className="w-full flex justify-center">
        <div className="w-full md:w-1/3">
          <UploadCard onUploadComplete={handleUpload} />
        </div>
      </div>
      <div className="my-6" />
      {/* Tab Bar for Multiple Files */}
      {results.length > 1 && (
        <div className="flex space-x-2 mb-4 px-[100px]">
          {results.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFileIndex(idx)}
              className={`px-4 py-1 text-sm rounded ${
                idx === activeFileIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {file.filename || `File ${idx + 1}`}
            </button>
          ))}
        </div>
      )}
      {/* Dashboard Content: Only show charts if a file is uploaded */}
      {results.length > 0 && (
        <>
          <ChartPanel data={results.length ? [results[activeFileIndex]] : []} className="mt-8 mb-12" />
          <div className="px-[50px] py-[50px] space-y-12">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded shadow border p-4 h-[300px] flex flex-col justify-between">
                <h3 className="text-md font-semibold text-gray-800 flex items-center">
                  Rolling Stats
                  <InfoTooltip text="Shows rolling mean and std deviation for the time series." />
                </h3>
                <div className="flex-1">
                  <RollingStatsChart records={records} />
                </div>
              </div>
              <div className="bg-white rounded shadow border p-4 h-[300px] flex flex-col justify-between">
                <h3 className="text-md font-semibold text-gray-800 flex items-center">
                  Cumulative Anomalies
                  <InfoTooltip text="Cumulative count of detected anomalies over time." />
                </h3>
                <div className="flex-1">
                  <CumulativeAnomaliesChart records={records} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded shadow border p-4 h-[300px] flex flex-col justify-between">
                <h3 className="text-md font-semibold text-gray-800 flex items-center">
                  Z-Score Histogram
                  <InfoTooltip text="Distribution of z-scores for all data points. Helps visualize normality and outliers." />
                </h3>
                <div className="flex-1">
                  <ZScoreHistogram records={records} />
                </div>
              </div>
              <div className="bg-white rounded shadow border p-4 h-[300px] flex flex-col justify-between">
                <h3 className="text-md font-semibold text-gray-800 flex items-center">
                  Anomaly Density
                  <InfoTooltip text="Number of anomalies detected per hour. Useful for spotting bursts or clusters of anomalies." />
                </h3>
                <div className="flex-1">
                  <AnomalyDensityChart records={records} />
                </div>
              </div>
              <div className="bg-white rounded shadow border p-4 h-[300px] flex flex-col justify-between">
                <h3 className="text-md font-semibold text-gray-800 flex items-center">
                  Rolling Std Dev
                  <InfoTooltip text="Rolling standard deviation (window=15). Shows local volatility in the data stream." />
                </h3>
                <div className="flex-1">
                  <RollingStdDevChart records={records} />
                </div>
              </div>
            </div>
          </div>
          {/* Data table and export/download buttons at the very bottom */}
          {records.length > 0 && (
            <DataTableAndExports
              records={records}
              onExportPDF={handleExportPDF}
              onDownloadCSV={handleDownloadCSV}
              onDownloadExcel={handleDownloadExcel}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
