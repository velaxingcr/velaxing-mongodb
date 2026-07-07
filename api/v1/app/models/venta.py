from bson.objectid import ObjectId
from app import mongo

class VentaModel:
    @staticmethod
    def obtener_todos():
        print("entro al modelo")
        ventas_cursor = mongo.db.ventas.find()
        ventas = []
        for venta in ventas_cursor:
            venta["_id"] = str(venta["_id"]) # Esto convierte el ObjectId en una cadena.
            ventas.append(venta)
        return ventas

    @staticmethod
    def obtener_por_id(id):
        
        try:
            venta = mongo.db.ventas.find_one({"_id": ObjectId(id)})
            if venta:
                venta["_id"] = str(venta["_id"])   # Esto convierte el ObjectId en una cadena.
            return venta
        except:
            return None

    @staticmethod
    def crear(venta):
        print("en el modelo")
        print(venta)
        try:
            result = mongo.db.ventas.insert_one(venta)
            return result.inserted_id
        except Exception as e:
            return None
        
    @staticmethod
    def actualizar(id, data):
        try:
            result = mongo.db.ventas.update_one({"_id": ObjectId(id)}, {"$set": data})
            return result.modified_count
        except:
            return -1
        
    @staticmethod
    def eliminar(id):
        try:
            result = mongo.db.ventas.delete_one({"_id": ObjectId(id)})
            return result.deleted_count
        except:
            return -1
        