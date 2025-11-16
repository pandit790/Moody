from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import init_mongo
from .routes.base_routes import base_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    app.register_blueprint(base_bp)

    CORS(app)
    init_mongo(app)


    return app

