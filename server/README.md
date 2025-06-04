# Anomaly Detection Web Application

This repository contains a professional anomaly detection web application built using React (Vite) for the frontend and Flask for the backend. The application leverages TailwindCSS for styling and Chart.js for data visualization.

## Project Structure

The project is organized into two main directories: `client` and `server`.

### Client

The `client` directory contains the React application, which includes:

- **Components**: Reusable UI components such as Navbar, Sidebar, Dashboard, AnomalyChart, DataTable, SettingsPanel, and Loader.
- **Pages**: Different pages of the application including Home, Detection, and Settings.
- **Hooks**: Custom hooks for managing state and side effects, specifically for anomaly detection.
- **Utils**: Utility functions for making API calls to the Flask backend.
- **Styles**: Global styles and TailwindCSS configuration.

### Server

The `server` directory contains the Flask backend, which includes:

- **App**: The main application logic, including routes, detection logic, models, and utility functions.
- **Tests**: Unit tests for the detection logic to ensure reliability and correctness.
- **Requirements**: A list of Python dependencies required to run the Flask application.

## Getting Started

### Prerequisites

- Node.js and npm for the client-side application.
- Python and pip for the server-side application.

### Installation

1. **Client-side**:
   - Navigate to the `client` directory.
   - Run `npm install` to install the necessary dependencies.
   - Run `npm run dev` to start the development server.

2. **Server-side**:
   - Navigate to the `server` directory.
   - Create a virtual environment and activate it.
   - Run `pip install -r requirements.txt` to install the required Python packages.
   - Run `python run.py` to start the Flask server.

### Usage

- Access the application in your web browser at `http://localhost:3000` for the client-side.
- The Flask API will be running at `http://localhost:5000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.