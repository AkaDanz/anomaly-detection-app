from flask import Blueprint, request, jsonify
import pandas as pd
from .utils import process_data, detect_anomalies

detection_bp = Blueprint('detection', __name__)

@detection_bp.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        df = pd.read_csv(file)
        processed_data = process_data(df)
        anomalies = detect_anomalies(processed_data)
        return jsonify({'anomalies': anomalies}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500