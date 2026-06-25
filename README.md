# Proyecto MongoDB - Velaxing

## Descripción

Este proyecto implementa una base de datos en MongoDB para **Velaxing**, un emprendimiento de velas aromáticas artesanales. La base de datos permite gestionar clientes, velas y ventas, demostrando las principales operaciones CRUD y consultas mediante agregaciones de MongoDB.

## Tecnologías utilizadas

* MongoDB Atlas
* MongoDB Compass
* Mongosh
* JavaScript
* Git
* GitHub

## Base de datos

**Nombre de la base de datos**

```text
velaxingDB
```

## Colecciones

### Clientes

```json
{
  "nombre": "María López",
  "correo": "maria@gmail.com",
  "telefono": "88887777"
}
```

### Velas

```json
{
  "nombre": "Serenity Lavanda",
  "aroma": "Lavanda",
  "tamano": "Mediana",
  "descripcion": "Aroma relajante ideal para espacios de descanso",
  "precio": 6500,
  "moneda": "CRC",
  "stock": 20
}
```

### Ventas

```json
{
  "cliente": "María López",
  "vela": "Serenity Lavanda",
  "cantidad": 2,
  "fecha": "2026-06-20"
}
```

## Operaciones implementadas

### CRUD

* Insertar un documento (`insertOne`)
* Insertar múltiples documentos (`insertMany`)
* Actualizar un documento (`updateOne`)
* Eliminar un documento (`deleteOne`)

### Consultas

* Obtener la cantidad de velas vendidas por una fecha específica.
* Obtener las velas que tienen al menos una venta (`distinct`).
* Consultar las velas vendidas y el stock restante utilizando `$lookup`.
* Obtener el Top 5 de velas más vendidas mediante `aggregate`.

## Integrante

* Estefanía Quesada

## Nota

Este proyecto fue desarrollado con fines académicos y, al mismo tiempo, fue diseñado tomando como referencia el emprendimiento **Velaxing**, con el objetivo de crear una base de datos que pueda servir como punto de partida para un futuro sistema de gestión de clientes, inventario y ventas.
