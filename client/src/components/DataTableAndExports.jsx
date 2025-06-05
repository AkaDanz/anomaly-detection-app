import React, { useState } from 'react';
import TableView from './TableView';

export default function DataTableAndExports({ records, onExportPDF, onDownloadCSV, onDownloadExcel }) {
  return (
    <div className="w-full flex justify-center px-8 pb-12 pt-8">
      <div className="bg-white rounded shadow border p-8 w-full max-w-6xl">
        <TableView records={records} />
        <div className="w-full flex justify-end mt-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onExportPDF}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              📄 Export PDF Report
            </button>
            <button
              onClick={onDownloadCSV}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              📑 Download CSV
            </button>
            <button
              onClick={onDownloadExcel}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              📊 Download Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
