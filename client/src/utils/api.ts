import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Adjust the URL as needed

export const uploadCSV = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error uploading CSV file: ' + error.message);
    }
};

export const getDetectionResults = async () => {
    try {
        const response = await axios.get(`${API_URL}/results`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching detection results: ' + error.message);
    }
};