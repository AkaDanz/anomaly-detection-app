import React, { useState } from 'react';
import UploadCard from './components/UploadCard';
import ChartPanel from './components/ChartPanel';
import RollingStatsChart from './components/RollingStatsChart';
import CumulativeAnomaliesChart from './components/CumulativeAnomaliesChart';
import ZScoreHistogram from './components/ZScoreHistogram';
import BoxPlotChart from './components/BoxPlotChart';
import AnomalySpikeChart from './components/AnomalySpikeChart';
import TableView from './components/TableView';

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
  const [zThreshold, setZThreshold] = useState(DEFAULT_Z);

  const handleUpload = (rawResults) => {
    const enriched = rawResults.map(file => ({
      ...file,
      records: addZScores(file.records),
    }));
    setResults(enriched);
  };

  const records = results[0]?.records || [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md flex justify-center">
        <UploadCard onUploadComplete={handleUpload} />
      </div>
      {results.length > 0 && (
        <div className="w-full max-w-4xl mt-10 space-y-10">
          <ChartPanel data={results} zThreshold={zThreshold} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RollingStatsChart records={records} zThreshold={zThreshold} />
            <CumulativeAnomaliesChart records={records} zThreshold={zThreshold} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ZScoreHistogram records={records} zThreshold={zThreshold} />
            <BoxPlotChart records={records} zThreshold={zThreshold} />
            <AnomalySpikeChart records={records} zThreshold={zThreshold} />
          </div>
          <TableView records={records} zThreshold={zThreshold} />
        </div>
      )}
    </div>
  );
}

export default App;
