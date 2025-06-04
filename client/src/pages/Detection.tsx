import React from 'react';
import { useAnomalyDetection } from '../hooks/useAnomalyDetection';
import AnomalyChart from '../components/AnomalyChart';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';
import SettingsPanel from '../components/SettingsPanel';

const Detection: React.FC = () => {
    const {
        data,
        loading,
        handleFileUpload,
        settings,
        updateSettings,
    } = useAnomalyDetection();

    return (
        <div className="flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-4">Anomaly Detection</h1>
            <SettingsPanel settings={settings} updateSettings={updateSettings} />
            <input type="file" onChange={handleFileUpload} className="mb-4" />
            {loading ? (
                <Loader />
            ) : (
                <>
                    <AnomalyChart data={data} />
                    <DataTable data={data} />
                </>
            )}
        </div>
    );
};

export default Detection;