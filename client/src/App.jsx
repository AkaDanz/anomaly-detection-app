import React, { useState } from 'react';
import UploadCard from './components/UploadCard';
import ChartPanel from './components/ChartPanel';

function App() {
  const [results, setResults] = useState([]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <UploadCard onUploadComplete={setResults} />
      <ChartPanel data={results} />
      {/* Later you'll display these results in ChartPanel / TableView */}
      <pre className="bg-gray-100 p-4 rounded text-xs">
        {JSON.stringify(results, null, 2)}
      </pre>
    </div>
  );
}

export default App;
