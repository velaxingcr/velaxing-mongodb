from flask import Blueprint, request, jsonify
from app.models.cliente import ClienteModel
from app.utils.token import token_requerido

clientes_endpoints = Blueprint('clientes_endpoints', __name__)


@clientes_endpoints.route('/clientes', methods=['GET'])
#@token_requerido
def obtenerClientes():

    idCliente = request.args.get('id')

    if idCliente:
        cliente = ClienteModel.obtener_por_id(idCliente)
        if cliente:
            return jsonify(cliente), 200
        return jsonify({"error": "Cliente no encontrado"}), 404

    clientes = ClienteModel.obtener_todos()
    return jsonify(clientes), 200


@clientes_endpoints.route('/clientes', methods=['POST'])
#@token_requerido
def addCliente():

    data = request.get_json()

    if not data:
        return jsonify({"error": "Datos vacíos"}), 400

    if "nombre" not in data or "correo" not in data or "telefono" not in data:
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    idCliente = ClienteModel.crear(data)

    return jsonify({"id": str(idCliente)}), 200


@clientes_endpoints.route('/clientes/<idCliente>', methods=['PUT'])
#@token_requerido
def updateCliente(idCliente):

    data = request.get_json()

    if data is None:
        return jsonify({"error": "Datos vacíos"}), 400

    resultado = ClienteModel.actualizar(idCliente, data)

    if resultado == -1:
        return jsonify({"error": "Cliente no actualizado"}), 404

    return jsonify({
        "Cliente actualizado correctamente": idCliente
    }), 200


@clientes_endpoints.route('/clientes/<idCliente>', methods=['DELETE'])
#@token_requerido
def eliminarCliente(idCliente):

    resultado = ClienteModel.eliminar(idCliente)

    if resultado == -1:
        return jsonify({"error": "Cliente no eliminado"}), 404

    return jsonify({
        "mensaje": f"Cliente con el id {idCliente} ha sido eliminado correctamente."
    }), 200