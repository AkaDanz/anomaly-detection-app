# Anomaly Detection Web Application

This project is a professional anomaly detection web application built using React (Vite) for the frontend and Flask for the backend. It utilizes TailwindCSS for styling and Chart.js for data visualization.

## Project Structure

The project is organized into two main directories: `client` and `server`.

### Client

The `client` directory contains the React application, which is structured as follows:

- **src/components**: Contains reusable components such as Navbar, Sidebar, Dashboard, AnomalyChart, DataTable, SettingsPanel, and Loader.
- **src/pages**: Contains the main pages of the application, including Home, Detection, and Settings.
- **src/hooks**: Contains custom hooks, specifically `useAnomalyDetection` for handling anomaly detection logic.
- **src/utils**: Contains utility functions for making API calls to the Flask backend.
- **src/App.tsx**: The main application component that sets up routing.
- **src/main.tsx**: The entry point for the React application.
- **index.css**: Global styles including TailwindCSS imports.

### Server

The `server` directory contains the Flask backend, structured as follows:

- **app**: Contains the main application logic, including routes, detection logic, models, and utility functions.
- **tests**: Contains unit tests for the anomaly detection logic.
- **requirements.txt**: Lists the Python dependencies required for the Flask backend.
- **run.py**: The entry point for running the Flask application.

## Getting Started

### Prerequisites

- Node.js and npm for the client-side
- Python and pip for the server-side

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd anomaly-detection-app
   ```

2. Install client dependencies:
   ```
   cd client
   npm install
   ```

3. Install server dependencies:
   ```
   cd server
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the Flask server:
   ```
   cd server
   python run.py
   ```

2. Start the React client:
   ```
   cd client
   npm run dev
   ```

The application should now be running, and you can access it in your web browser.

## Features

- Upload CSV files for anomaly detection.
- Visualize results using interactive charts.
- Configure settings related to the detection process.
- Responsive design using TailwindCSS.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.