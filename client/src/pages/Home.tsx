import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Anomaly Detection App</h1>
            <p className="text-lg text-center">
                This application helps you detect anomalies in your data using advanced algorithms.
                Navigate through the app to upload your data, visualize results, and adjust settings.
            </p>
        </div>
    );
};

export default Home;