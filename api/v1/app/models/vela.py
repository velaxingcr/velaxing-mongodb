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
        