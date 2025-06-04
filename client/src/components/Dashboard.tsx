import React from 'react';
import AnomalyChart from '../components/AnomalyChart';
import DataTable from '../components/DataTable';
import SettingsPanel from '../components/SettingsPanel';
import Loader from '../components/Loader';
import { useAnomalyDetection } from '../hooks/useAnomalyDetection';

const Dashboard: React.FC = () => {
    const { data, loading, settings } = useAnomalyDetection();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Anomaly Detection Dashboard</h1>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <AnomalyChart data={data} />
                    <DataTable data={data} />
                    <SettingsPanel settings={settings} />
                </>
            )}
        </div>
    );
};

export default Dashboard;