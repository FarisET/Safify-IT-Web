import React, { createContext, useState, useContext } from 'react';

const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
    const [scanState, setScanState] = useState({
        isLoading: false,
        data: [],
    });

    return (
        <ScanContext.Provider value={{ scanState, setScanState }}>
            {children}
        </ScanContext.Provider>
    );
};

export const useScan = () => useContext(ScanContext);
