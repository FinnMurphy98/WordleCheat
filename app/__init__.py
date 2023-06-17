from flask import Flask, Blueprint
from config import Config
from app.main import main

def create_app(config_class=Config):
    """
    Creates an instance of the flask application according to a specified configuration. 
    """
    app = Flask(__name__)
    app.config.from_object(config_class) 
    app.register_blueprint(main)
    return app