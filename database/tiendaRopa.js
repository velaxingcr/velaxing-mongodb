// CREAR BASE DE DATOS
use("tiendaRopaDB");


// =========================
// COLECCION USUARIOS
// =========================

// Insertar un usuario
db.usuarios.insertOne({
    nombre: "María López",
    correo: "maria@gmail.com",
    telefono: "88887777"
});

// Insertar varios usuarios
db.usuarios.insertMany([
    {
        nombre: "Carlos Pérez",
        correo: "carlos@gmail.com",
        telefono: "88881111"
    },
    {
        nombre: "Ana Rodríguez",
        correo: "ana@gmail.com",
        telefono: "88882222"
    }
]);

// Actualizar usuario
db.usuarios.updateOne(
    { nombre: "Carlos Pérez" },
    { $set: { telefono: "70000000" } }
);

// Eliminar usuario
db.usuarios.deleteOne({
    nombre: "Ana Rodríguez"
});


// =========================
// COLECCION MARCAS
// =========================

db.marcas.insertOne({
    nombre: "Nike",
    pais: "Estados Unidos"
});

db.marcas.insertMany([
    {
        nombre: "Adidas",
        pais: "Alemania"
    },
    {
        nombre: "Puma",
        pais: "Alemania"
    }
]);

db.marcas.updateOne(
    { nombre: "Puma" },
    { $set: { pais: "Francia" } }
);

db.marcas.deleteOne({
    nombre: "Adidas"
});


// =========================
// COLECCION PRENDAS
// =========================

db.prendas.insertOne({
    nombre: "Camiseta deportiva",
    marca: "Nike",
    precio: 15000,
    stock: 20
});

db.prendas.insertMany([
    {
        nombre: "Pantalón deportivo",
        marca: "Nike",
        precio: 25000,
        stock: 15
    },
    {
        nombre: "Jacket",
        marca: "Puma",
        precio: 35000,
        stock: 10
    }
]);

db.prendas.updateOne(
    { nombre: "Jacket" },
    { $set: { stock: 8 } }
);

db.prendas.deleteOne({
    nombre: "Pantalón deportivo"
});


// =========================
// COLECCION VENTAS
// =========================

db.ventas.insertOne({
    cliente: "María López",
    prenda: "Camiseta deportiva",
    marca: "Nike",
    cantidad: 2,
    fecha: "2026-05-20"
});

db.ventas.insertMany([
    {
        cliente: "Carlos Pérez",
        prenda: "Jacket",
        marca: "Puma",
        cantidad: 1,
        fecha: "2026-05-20"
    },
    {
        cliente: "María López",
        prenda: "Camiseta deportiva",
        marca: "Nike",
        cantidad: 3,
        fecha: "2026-05-21"
    }
]);


// ====================================
// CONSULTAS
// ====================================


// Obtener la cantidad vendida por fecha
db.ventas.aggregate([
    {
        $match: {
            fecha: "2026-05-20"
        }
    },
    {
        $group: {
            _id: "$prenda",
            totalVendido: { $sum: "$cantidad" }
        }
    }
]);


// Obtener marcas con al menos una venta
db.ventas.distinct("marca");


// Obtener prendas vendidas y stock restante
db.prendas.aggregate([
    {
        $lookup: {
            from: "ventas",
            localField: "nombre",
            foreignField: "prenda",
            as: "ventasRelacionadas"
        }
    },
    {
        $project: {
            nombre: 1,
            stock: 1,
            cantidadVendida: {
                $sum: "$ventasRelacionadas.cantidad"
            }
        }
    }
]);


// Obtener top 5 marcas más vendidas
db.ventas.aggregate([
    {
        $group: {
            _id: "$marca",
            totalVentas: { $sum: "$cantidad" }
        }
    },
    {
        $sort: {
            totalVentas: -1
        }
    },
    {
        $limit: 5
    }
]);