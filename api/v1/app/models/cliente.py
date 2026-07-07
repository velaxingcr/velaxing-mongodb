from bson.objectid import ObjectId
from app import mongo

class ClienteModel:
    @staticmethod
    def obtener_todos():
        print("entro al modelo")
        clientes_cursor = mongo.db.clientes.find()
        clientes = []
        for cliente in clientes_cursor:
            cliente["_id"] = str(cliente["_id"]) # Esto convierte el ObjectId en una cadena.
            clientes.append(cliente)
        return clientes

    @staticmethod
    def obtener_por_id(id):
        
        try:
            cliente = mongo.db.clientes.find_one({"_id": ObjectId(id)})
            if cliente:
                cliente["_id"] = str(cliente["_id"])   # Esto convierte el ObjectId en una cadena.
            return cliente
        except:
            return None

    @staticmethod
    def crear(cliente):
        print("en el modelo")
        print(cliente)
        try:
            result = mongo.db.clientes.insert_one(cliente)
            return result.inserted_id
        except Exception as e:
            return None
        
    @staticmethod
    def actualizar(id, data):
        try:
            result = mongo.db.clientes.update_one({"_id": ObjectId(id)}, {"$set": data})
            return result.modified_count
        except:
            return -1
        
    @staticmethod
    def eliminar(id):
        try:
            result = mongo.db.clientes.delete_one({"_id": ObjectId(id)})
            return result.deleted_count
        except:
            return -1
        