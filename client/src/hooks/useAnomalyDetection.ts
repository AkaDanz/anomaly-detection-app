import { useState } from 'react';
import { uploadFile, fetchDetectionResults } from '../utils/api';

const useAnomalyDetection = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleFileUpload = async (file) => {
        setLoading(true);
        setError(null);
        try {
            await uploadFile(file);
            const detectionResults = await fetchDetectionResults();
            setResults(detectionResults);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        results,
        error,
        handleFileUpload,
    };
};

export default useAnomalyDetection;