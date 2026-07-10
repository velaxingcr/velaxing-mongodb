from bson.objectid import ObjectId
from app import mongo

class VelaModel:
    @staticmethod
    def obtener_todos():
        print("entro al modelo")
        velas_cursor = mongo.db.velas.find()
        velas = []
        for vela in velas_cursor:
            vela["_id"] = str(vela["_id"]) # Esto convierte el ObjectId en una cadena.
            velas.append(vela)
        return velas

    @staticmethod
    def obtener_por_id(id):
        
        try:
            vela = mongo.db.velas.find_one({"_id": ObjectId(id)})
            if vela:
                vela["_id"] = str(vela["_id"])   # Esto convierte el ObjectId en una cadena.
            return vela
        except:
            return None

    @staticmethod
    def crear(vela):
        print("en el modelo")
        print(vela)
        try:
            result = mongo.db.velas.insert_one(vela)
            return result.inserted_id
        except Exception as e:
            return None
        
    @staticmethod
    def actualizar(id, data):
        try:
            result = mongo.db.velas.update_one({"_id": ObjectId(id)}, {"$set": data})
            return result.modified_count
        except:
            return -1
        
    @staticmethod
    def eliminar(id):
        try:
            result = mongo.db.velas.delete_one({"_id": ObjectId(id)})
            return result.deleted_count
        except:
            return -1

    @staticmethod
    def obtener_velas_con_ventas():
        try:
            resultado = mongo.db.ventas.distinct("vela")
            return resultado
        except Exception:
            return []    
            
    @staticmethod
    def obtener_velas_stock():
        try:
            resultado = mongo.db.velas.aggregate([
                {
                    "$lookup": {
                        "from": "ventas",
                        "localField": "nombre",
                        "foreignField": "vela",
                        "as": "ventasRelacionadas"
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "nombre": 1,
                        "aroma": 1,
                        "tamano": 1,
                        "precio": 1,
                        "moneda": 1,
                        "stock": 1,
                        "cantidadVendida": {
                            "$sum": "$ventasRelacionadas.cantidad"
                        }
                    }
                }
            ])

            return list(resultado)

        except Exception:
            return []
        
    @staticmethod
    def obtener_top5_velas():
        try:
            resultado = mongo.db.ventas.aggregate([
                {
                    "$group": {
                        "_id": "$vela",
                        "totalVentas": {
                            "$sum": "$cantidad"
                        }
                    }
                },
                {
                    "$sort": {
                        "totalVentas": -1
                    }
                },
                {
                    "$limit": 5
                }
            ])

            return list(resultado)

        except Exception:
            return []