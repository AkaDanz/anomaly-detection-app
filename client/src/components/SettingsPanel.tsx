import React from 'react';

const SettingsPanel: React.FC = () => {
    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Anomaly Detection Threshold</label>
                <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Enter threshold" />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Data Source</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                    <option value="csv">CSV File</option>
                    <option value="api">API Endpoint</option>
                </select>
            </div>
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Save Settings</button>
        </div>
    );
};

export default SettingsPanel;