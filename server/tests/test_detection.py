from flask import json
import unittest
from app.detection import detect_anomalies

class TestAnomalyDetection(unittest.TestCase):

    def test_detect_anomalies_valid_data(self):
        data = [
            {"timestamp": "2023-01-01T00:00:00Z", "value": 10},
            {"timestamp": "2023-01-01T01:00:00Z", "value": 12},
            {"timestamp": "2023-01-01T02:00:00Z", "value": 15},
            {"timestamp": "2023-01-01T03:00:00Z", "value": 100},  # Anomaly
            {"timestamp": "2023-01-01T04:00:00Z", "value": 14},
        ]
        anomalies = detect_anomalies(data)
        self.assertEqual(len(anomalies), 1)
        self.assertEqual(anomalies[0]['timestamp'], "2023-01-01T03:00:00Z")

    def test_detect_anomalies_no_anomalies(self):
        data = [
            {"timestamp": "2023-01-01T00:00:00Z", "value": 10},
            {"timestamp": "2023-01-01T01:00:00Z", "value": 12},
            {"timestamp": "2023-01-01T02:00:00Z", "value": 11},
            {"timestamp": "2023-01-01T03:00:00Z", "value": 13},
            {"timestamp": "2023-01-01T04:00:00Z", "value": 14},
        ]
        anomalies = detect_anomalies(data)
        self.assertEqual(len(anomalies), 0)

    def test_detect_anomalies_empty_data(self):
        data = []
        anomalies = detect_anomalies(data)
        self.assertEqual(len(anomalies), 0)

if __name__ == '__main__':
    unittest.main()