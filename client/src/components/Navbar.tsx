import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between">
                <div className="text-white text-lg font-bold">Anomaly Detection App</div>
                <div className="space-x-4">
                    <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                    <Link to="/detection" className="text-gray-300 hover:text-white">Detection</Link>
                    <Link to="/settings" className="text-gray-300 hover:text-white">Settings</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;