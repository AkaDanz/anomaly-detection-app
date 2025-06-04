import React from 'react';
import { Line } from 'react-chartjs-2';

const AnomalyChart = ({ data, anomalies }) => {
    const chartData = {
        labels: data.map(point => point.timestamp),
        datasets: [
            {
                label: 'Data',
                data: data.map(point => point.value),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Anomalies',
                data: anomalies.map(anomaly => anomaly.value),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                pointRadius: 5,
                pointHoverRadius: 7,
                type: 'scatter',
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute',
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="chart-container">
            <h2 className="text-lg font-semibold mb-4">Anomaly Detection Chart</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default AnomalyChart;