from flask import request, jsonify
from datetime import datetime
from app import mongo

def validar_token():

    auth = request.headers.get("Authorization")

    if not auth or not auth.startswith("Bearer "):
        return jsonify({"error": "token requerido"}), 401

    token = auth.split(" ")[1]

    documento_token = mongo.db.tokens.find_one({"token": token})

    if not documento_token:
        return jsonify({"error": "token no valido"}), 401

    if datetime.now() > documento_token["expiracion"]:
        return jsonify({"error": "token expirado"}), 401

    return None
