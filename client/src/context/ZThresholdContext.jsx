import { createContext, useContext, useState } from 'react';

const ZThresholdContext = createContext();

export function ZThresholdProvider({ children }) {
  const [zThreshold, setZThreshold] = useState(2);
  return (
    <ZThresholdContext.Provider value={{ zThreshold, setZThreshold }}>
      {children}
    </ZThresholdContext.Provider>
  );
}

export function useZThreshold() {
  return useContext(ZThresholdContext);
}
