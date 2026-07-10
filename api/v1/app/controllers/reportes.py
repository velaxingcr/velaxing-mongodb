from flask import Blueprint, jsonify
from app.models.vela import VelaModel
from app.utils.token import validar_token

reportes_endpoints = Blueprint('reportes_endpoints', __name__)


@reportes_endpoints.before_request
def verificar_seguridad():
    return validar_token()


# ==========================================
# Reporte 1: Velas que tienen al menos una venta
# ==========================================
@reportes_endpoints.route('/reportes/velas-con-ventas', methods=['GET'])
def obtenerVelasConVentas():

    reporte = VelaModel.obtener_velas_con_ventas()

    return jsonify(reporte), 200


# ==========================================
# Reporte 2: Velas vendidas y stock restante
# ==========================================
@reportes_endpoints.route('/reportes/velas-stock', methods=['GET'])
def obtenerVelasStock():

    reporte = VelaModel.obtener_velas_stock()

    return jsonify(reporte), 200


# ==========================================
# Reporte 3: Top 5 velas más vendidas
# ==========================================
@reportes_endpoints.route('/reportes/top-5-velas', methods=['GET'])
def obtenerTop5Velas():

    reporte = VelaModel.obtener_top5_velas()

    return jsonify(reporte), 200
