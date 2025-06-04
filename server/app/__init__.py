from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173"])
    
    # Load configurations
    app.config.from_mapping(
        SECRET_KEY='your_secret_key',
        DATABASE='your_database_path'
    )

    # Register blueprints
    from .routes import routes
    app.register_blueprint(routes)

    return app