import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="bg-gray-800 text-white w-64 h-full">
            <h2 className="text-xl font-bold p-4">Anomaly Detection</h2>
            <ul className="mt-4">
                <li className="p-2 hover:bg-gray-700 cursor-pointer">Dashboard</li>
                <li className="p-2 hover:bg-gray-700 cursor-pointer">Detection</li>
                <li className="p-2 hover:bg-gray-700 cursor-pointer">Settings</li>
            </ul>
        </div>
    );
};

export default Sidebar;