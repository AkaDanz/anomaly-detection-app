from flask import Blueprint, request, jsonify
from .detection import process_file

routes = Blueprint('routes', __name__)

@routes.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        result = process_file(file)
        return jsonify(result), 200

@routes.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200