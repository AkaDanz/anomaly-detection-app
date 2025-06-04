import React from 'react';
import SettingsPanel from '../components/SettingsPanel';

const Settings: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <SettingsPanel />
        </div>
    );
};

export default Settings;