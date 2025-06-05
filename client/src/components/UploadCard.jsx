import React, { useState } from 'react';
import InfoTooltip from './InfoTooltip';

export default function UploadCard({ onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [normalization, setNormalization] = useState('none');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const supportedTypes = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  const supportedExts = ['.csv', '.xlsx', '.xls'];

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    processFiles(selected);
  };

  function processFiles(selected) {
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
  }

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = Array.from(e.dataTransfer.files);
      processFiles(dropped);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
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
    <div
      className={`bg-white border border-gray-200 shadow rounded-lg p-6 space-y-4 transition-colors duration-200 ${
        isDragActive ? 'ring-2 ring-blue-400 bg-blue-50/60 border-blue-400' : ''
      } w-[130%] max-w-none`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="text-lg font-semibold text-gray-800">Upload files or folders</h2>
      <div className="flex flex-col gap-4 w-full">
        {/* Upload area */}
        <div className="w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-8 cursor-pointer transition-colors duration-200"
          onClick={() => document.getElementById('file-input').click()}
        >
          <span className={`text-gray-500 ${isDragActive ? 'text-blue-600' : ''}`}>{isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}</span>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div className="space-y-1 w-full">
          <label htmlFor="normalization" className="block text-sm font-medium text-gray-700 w-full">
            Normalization Method
            <InfoTooltip text="Choose how to scale your data before anomaly detection. Z-score normalizes around mean; Min-Max scales between 0–1." />
          </label>
          <select
            id="normalization"
            className="mt-1 block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-40"
            value={normalization}
            onChange={(e) => setNormalization(e.target.value)}
          >
            <option value="none">None</option>
            <option value="zscore">Z-score</option>
            <option value="minmax">Min-Max</option>
          </select>
        </div>
        <div className="flex w-full justify-end">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
      {files.length > 0 && (
        <div className="text-xs text-gray-600">
          {files.length} file{files.length > 1 ? 's' : ''} selected: {files.map(f => f.name).join(', ')}
        </div>
      )}
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}
