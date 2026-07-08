from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import os

mongo = PyMongo()

def create_app():

    app = Flask(__name__)
    # URI en formato string (correcto)
  
    uri = ''
    app.config["MONGO_URI"] = uri
    mongo.init_app(app)
    CORS(app, origins="*")

    from .controllers.clientes import clientes_endpoints
    from .controllers.velas import velas_endpoints
    from .controllers.ventas import ventas_endpoints

    app.register_blueprint(clientes_endpoints, url_prefix="/velaxing/api/v1")
    app.register_blueprint(velas_endpoints, url_prefix="/velaxing/api/v1")
    app.register_blueprint(ventas_endpoints, url_prefix="/velaxing/api/v1")
    

    return app
