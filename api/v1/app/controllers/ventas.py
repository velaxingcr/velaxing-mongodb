from flask import Blueprint, request, jsonify
from app.models.venta import VentaModel
from app.utils.token import validar_token


ventas_endpoints = Blueprint("ventas_endpoints", __name__)


@ventas_endpoints.before_request
def verificar_seguridad():
    """
    Permite la solicitud OPTIONS que envía el navegador
    antes de la petición real.

    Las demás solicitudes sí deben validar el token.
    """
    if request.method == "OPTIONS":
        return None

    return validar_token()


@ventas_endpoints.route("/ventas", methods=["GET"])
def obtenerVentas():
    idVenta = request.args.get("id")

    if idVenta:
        venta = VentaModel.obtener_por_id(idVenta)

        if venta:
            return jsonify(venta), 200

        return jsonify({"error": "Venta no encontrada"}), 404

    ventas = VentaModel.obtener_todos()

    return jsonify(ventas), 200


@ventas_endpoints.route("/ventas", methods=["POST"])
def addVenta():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Datos vacíos"}), 400

    campos_requeridos = [
        "cliente",
        "vela",
        "cantidad",
        "fecha"
    ]

    for campo in campos_requeridos:
        if campo not in data:
            return jsonify({
                "error": f"Falta el campo obligatorio: {campo}"
            }), 400

    idVenta = VentaModel.crear(data)

    return jsonify({"id": str(idVenta)}), 200


@ventas_endpoints.route("/ventas/<idVenta>", methods=["PUT"])
def updateVenta(idVenta):
    data = request.get_json()

    if data is None:
        return jsonify({"error": "Datos vacíos"}), 400

    resultado = VentaModel.actualizar(idVenta, data)

    if resultado == -1:
        return jsonify({"error": "Venta no actualizada"}), 404

    return jsonify({
        "Venta actualizada correctamente": idVenta
    }), 200


@ventas_endpoints.route("/ventas/<idVenta>", methods=["DELETE"])
def eliminarVenta(idVenta):
    resultado = VentaModel.eliminar(idVenta)

    if resultado == -1:
        return jsonify({"error": "Venta no eliminada"}), 404

    return jsonify({
        "mensaje": (
            f"Venta con el id {idVenta} "
            "ha sido eliminada correctamente."
        )
    }), 200