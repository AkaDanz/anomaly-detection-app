import React, { useState } from 'react';

export default function InfoTooltip({ children, text }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <span
        className="cursor-help text-blue-500 ml-1"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        tabIndex={0}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        aria-label="Info"
      >
        ℹ️
      </span>
      {show && (
        <div className="absolute z-50 left-full top-1/2 -translate-y-1/2 ml-2 w-max max-w-xs bg-white text-xs text-gray-800 rounded shadow-lg border border-blue-200 px-3 py-2 whitespace-pre-line pointer-events-none animate-fade-in">
          {text}
        </div>
      )}
    </span>
  );
}
