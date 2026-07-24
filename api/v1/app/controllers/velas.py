from flask import Blueprint, request, jsonify
from app.models.vela import VelaModel
from app.utils.token import validar_token


velas_endpoints = Blueprint("velas_endpoints", __name__)


@velas_endpoints.before_request
def verificar_seguridad():
    """
    Permite la solicitud OPTIONS que envía el navegador
    antes de las solicitudes reales.

    Las demás solicitudes sí deben validar el token.
    """
    if request.method == "OPTIONS":
        return None

    return validar_token()


@velas_endpoints.route("/velas", methods=["GET"])
def obtenerVelas():
    idVela = request.args.get("id")

    if idVela:
        vela = VelaModel.obtener_por_id(idVela)

        if vela:
            return jsonify(vela), 200

        return jsonify({"error": "Vela no encontrada"}), 404

    velas = VelaModel.obtener_todos()

    return jsonify(velas), 200


@velas_endpoints.route("/velas", methods=["POST"])
def addVela():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Datos vacíos"}), 400

    campos_requeridos = [
        "nombre",
        "aroma",
        "tamano",
        "descripcion",
        "precio",
        "moneda",
        "stock"
    ]

    for campo in campos_requeridos:
        if campo not in data:
            return jsonify({
                "error": f"Falta el campo obligatorio: {campo}"
            }), 400

    idVela = VelaModel.crear(data)

    return jsonify({"id": str(idVela)}), 200


@velas_endpoints.route("/velas/<idVela>", methods=["PUT"])
def updateVela(idVela):
    data = request.get_json()

    if data is None:
        return jsonify({"error": "Datos vacíos"}), 400

    resultado = VelaModel.actualizar(idVela, data)

    if resultado == -1:
        return jsonify({"error": "Vela no actualizada"}), 404

    return jsonify({
        "Vela actualizada correctamente": idVela
    }), 200


@velas_endpoints.route("/velas/<idVela>", methods=["DELETE"])
def eliminarVela(idVela):
    resultado = VelaModel.eliminar(idVela)

    if resultado == -1:
        return jsonify({"error": "Vela no eliminada"}), 404

    return jsonify({
        "mensaje": (
            f"Vela con el id {idVela} "
            "ha sido eliminada correctamente."
        )
    }), 200