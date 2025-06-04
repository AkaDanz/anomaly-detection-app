import React, { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';

export default function TableView({ records, zThreshold }) {
  const [sortKey, setSortKey] = useState('z_score');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);

  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage]);

  if (!records || records.length === 0) return null;

  // Sort by key
  const sortedRecords = useMemo(() => {
    const sorted = [...records].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
    // Prioritize anomalies
    return sorted.sort((a, b) => {
      const aAnomaly = typeof a.z_score === 'number' && Math.abs(a.z_score) > zThreshold;
      const bAnomaly = typeof b.z_score === 'number' && Math.abs(b.z_score) > zThreshold;
      return bAnomaly - aAnomaly;
    });
  }, [records, sortKey, sortAsc, zThreshold]);

  const headers = ['timestamp', 'value', 'z_score'];

  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedRecords = sortedRecords.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedRecords.length / entriesPerPage);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white p-4 mt-8 rounded shadow border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold text-gray-800">Data Table</h3>
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="entries">Show</label>
          <select
            id="entries"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>entries</span>
        </div>
      </div>
      <div className="overflow-x-auto max-h-[500px] overflow-y-scroll">
        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr>
              {headers.map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-2 cursor-pointer text-left font-medium text-gray-700 hover:underline"
                >
                  {key} {sortKey === key && (sortAsc ? '↑' : '↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((row, i) => {
              const isAnomaly = typeof row.z_score === 'number' && Math.abs(row.z_score) > zThreshold;
              return (
                <tr
                  key={i + startIndex}
                  className={classNames('border-t', {
                    'bg-red-50': isAnomaly,
                  })}
                >
                  {headers.map((key) => (
                    <td key={key} className="px-4 py-2 text-gray-800">
                      {typeof row[key] === 'number'
                        ? row[key].toFixed(3)
                        : row[key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          className="px-3 py-1 rounded border text-sm bg-gray-100 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded border text-sm bg-gray-100 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
