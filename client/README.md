# Anomaly Detection Web Application

This project is a professional anomaly detection web application built using React (with Vite), Flask, and TailwindCSS. It provides a user-friendly interface for detecting anomalies in time series data, visualizing results, and managing settings.

## Client-Side Overview

The client-side of the application is structured as follows:

- **Components**: Reusable UI components that make up the application.
  - `Navbar`: Navigation bar for the application.
  - `Sidebar`: Sidebar navigation for switching between views.
  - `Dashboard`: Main landing page displaying anomaly detection results.
  - `AnomalyChart`: Line chart visualizing time series data with anomalies.
  - `DataTable`: Displays parsed CSV data in a table format.
  - `SettingsPanel`: Configuration settings for anomaly detection.
  - `Loader`: Loading spinner for data fetching.

- **Pages**: Different views of the application.
  - `Home`: Introductory content for the application.
  - `Detection`: Handles the anomaly detection process.
  - `Settings`: Allows users to adjust application settings.

- **Hooks**: Custom hooks for encapsulating logic.
  - `useAnomalyDetection`: Logic for handling anomaly detection, including file uploads.

- **Utils**: Utility functions for API calls.
  - `api`: Functions for interacting with the Flask backend.

## Getting Started

To get started with the client-side application, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd anomaly-detection-app/client
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **Vite**: Build tool for fast development.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **Chart.js**: Library for rendering charts and graphs.
- **Flask**: Python web framework for the backend.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.