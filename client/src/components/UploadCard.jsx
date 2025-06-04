import React, { useState } from 'react';

export default function UploadCard({ onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [normalization, setNormalization] = useState('none');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const supportedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    const supportedExts = ['.csv', '.xlsx', '.xls'];
    const selected = Array.from(e.target.files);
    const valid = selected.filter(file => {
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      return supportedTypes.includes(file.type) || supportedExts.includes(ext);
    });
    if (valid.length === 0) {
      setError('No valid .csv, .xlsx, or .xls files selected.');
      setFiles([]);
    } else {
      setError(null);
      setFiles(valid);
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please select at least one file.');
      return;
    }
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('normalization', normalization);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      onUploadComplete(data);
    } catch (err) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Upload Files</h2>

      <input
        type="file"
        multiple
        accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      <div className="space-y-1">
        <label htmlFor="normalization" className="block text-sm font-medium text-gray-700">
          Normalization Method
        </label>
        <select
          id="normalization"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={normalization}
          onChange={(e) => setNormalization(e.target.value)}
        >
          <option value="none">None</option>
          <option value="zscore">Z-score</option>
          <option value="minmax">Min-Max</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}
