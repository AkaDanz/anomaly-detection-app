from flask import Blueprint, request, jsonify
import pandas as pd
from werkzeug.utils import secure_filename

routes = Blueprint('routes', __name__)

def detect_columns(df, candidates):
    for col in df.columns:
        if col.lower() in candidates:
            return col
    return None

@routes.route('/upload', methods=['POST'])
def upload():
    files = request.files.getlist('files')
    results = []
    for file in files:
        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[-1].lower()
        try:
            # Read file based on extension
            if ext == 'csv':
                df = pd.read_csv(file)
            elif ext in ('xlsx', 'xls'):
                df = pd.read_excel(file)
            else:
                results.append({'filename': filename, 'error': 'Unsupported file type'})
                continue
            # Detect timestamp and value columns
            timestamp_candidates = {'timestamp', 'time', 'date'}
            value_candidates = {'value', 'amount', 'sales', 'metric'}
            ts_col = detect_columns(df, timestamp_candidates)
            val_col = detect_columns(df, value_candidates)
            if not ts_col or not val_col:
                results.append({'filename': filename, 'error': 'Could not detect timestamp or value column'})
                continue
            df = df.rename(columns={ts_col: 'timestamp', val_col: 'value'})
            # Dummy anomaly detection
            mean = df['value'].mean()
            std = df['value'].std()
            df['is_anomaly'] = (df['value'] > mean + 2 * std)
            # Format records
            records = df[['timestamp', 'value', 'is_anomaly']].to_dict(orient='records')
            results.append({'filename': filename, 'records': records})
        except Exception as e:
            results.append({'filename': filename, 'error': str(e)})
    return jsonify(results), 200

@routes.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200