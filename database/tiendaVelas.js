// CREAR BASE DE DATOS
use("velaxingDB");


// =========================
// COLECCION CLIENTES
// =========================

// Insertar un cliente
db.clientes.insertOne({
    nombre: "María López",
    correo: "maria@gmail.com",
    telefono: "88887777"
});

// Insertar varios clientes
db.clientes.insertMany([
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

// Actualizar cliente
db.clientes.updateOne(
    { nombre: "Carlos Pérez" },
    { $set: { telefono: "70000000" } }
);

// Eliminar cliente
db.clientes.deleteOne({
    nombre: "Ana Rodríguez"
});


// =========================
// COLECCION VELAS
// =========================

// Insertar una vela
db.velas.insertOne({
    nombre: "Serenity Lavanda",
    aroma: "Lavanda",
    tamano: "Mediana",
    descripcion: "Aroma relajante ideal para espacios de descanso",
    precio: 6500,
    moneda: "CRC",
    stock: 20
});

// Insertar varias velas
db.velas.insertMany([
    {
        nombre: "Dulce Vainilla",
        aroma: "Vainilla",
        tamano: "Pequeña",
        descripcion: "Fragancia cálida y acogedora",
        precio: 5500,
        moneda: "CRC",
        stock: 15
    },
    {
        nombre: "Canela & Especias",
        aroma: "Canela",
        tamano: "Grande",
        descripcion: "Aroma intenso inspirado en especias naturales",
        precio: 7000,
        moneda: "CRC",
        stock: 10
    }
]);

// Actualizar stock
db.velas.updateOne(
    { nombre: "Canela & Especias" },
    { $set: { stock: 8 } }
);

// Eliminar una vela
db.velas.deleteOne({
    nombre: "Dulce Vainilla"
});


// =========================
// COLECCION VENTAS
// =========================

// Insertar una venta
db.ventas.insertOne({
    cliente: "María López",
    vela: "Serenity Lavanda",
    cantidad: 2,
    fecha: new Date("2026-06-20")
});

// Insertar varias ventas
db.ventas.insertMany([
    {
        cliente: "Carlos Pérez",
        vela: "Canela & Especias",
        cantidad: 1,
        fecha: new Date("2026-06-20")
    },
    {
        cliente: "María López",
        vela: "Serenity Lavanda",
        cantidad: 3,
        fecha: new Date("2026-06-21")
    }
]);


// ====================================
// CONSULTAS
// ====================================


// Obtener la cantidad vendida por fecha específica
db.ventas.aggregate([
    {
        $match: {
            fecha: {
                $gte: new Date("2026-06-20"),
                $lt: new Date("2026-06-21")
            }
        }
    },
    {
        $group: {
            _id: "$vela",
            totalVendido: {
                $sum: "$cantidad"
            }
        }
    }
]);


// Obtener velas que tienen al menos una venta
db.ventas.distinct("vela");


// Obtener velas vendidas y stock restante
db.velas.aggregate([
    {
        $lookup: {
            from: "ventas",
            localField: "nombre",
            foreignField: "vela",
            as: "ventasRelacionadas"
        }
    },
    {
        $project: {
            nombre: 1,
            aroma: 1,
            tamano: 1,
            precio: 1,
            moneda: 1,
            stock: 1,
            cantidadVendida: {
                $sum: "$ventasRelacionadas.cantidad"
            }
        }
    }
]);


// Obtener las 5 velas más vendidas
db.ventas.aggregate([
    {
        $group: {
            _id: "$vela",
            totalVentas: {
                $sum: "$cantidad"
            }
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