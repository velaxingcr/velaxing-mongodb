# Proyecto MongoDB - Velaxing

## Descripción

Este proyecto implementa una base de datos en MongoDB para **Velaxing**, un emprendimiento de velas aromáticas artesanales. La base de datos permite gestionar clientes, velas y ventas, demostrando las principales operaciones CRUD y consultas mediante agregaciones de MongoDB.

## Tecnologías utilizadas

* MongoDB Atlas
* MongoDB Compass
* Mongosh
* JavaScript
* Python
* Flask
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

---

## Documentación de la API

**URL base:** `http://127.0.0.1:5000/velaxing/api/v1`

---

## Velas

### Obtener todas las velas

* **Método:** GET
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/velas`
* **Descripción:** Retorna la lista completa de velas registradas en la base de datos.
* **Respuesta exitosa (200):**

```json
[
  {
    "_id": "6847a1c2f3e4b5d6e7f8a9b0",
    "nombre": "Serenity Lavanda",
    "aroma": "Lavanda",
    "tamano": "Mediana",
    "descripcion": "Aroma relajante ideal para espacios de descanso",
    "precio": 6500,
    "moneda": "CRC",
    "stock": 20
  }
]
```

---

### Obtener vela por ID

* **Método:** GET
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/velas?id=6847a1c2f3e4b5d6e7f8a9b0`
* **Parámetro de consulta:** `id` — ID de la vela a consultar.
* **Descripción:** Retorna los datos de una vela específica según su ID.
* **Respuesta exitosa (200):**

```json
{
  "_id": "6847a1c2f3e4b5d6e7f8a9b0",
  "nombre": "Serenity Lavanda",
  "aroma": "Lavanda",
  "tamano": "Mediana",
  "descripcion": "Aroma relajante ideal para espacios de descanso",
  "precio": 6500,
  "moneda": "CRC",
  "stock": 20
}
```

* **Respuesta de error (404):**

```json
{ "error": "Vela no encontrada" }
```

---

### Insertar una vela

* **Método:** POST
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/velas`
* **Descripción:** Crea una nueva vela en la base de datos.
* **Cuerpo de la solicitud (JSON):**

```json
{
  "nombre": "Flor de Cerezo",
  "aroma": "Cerezo",
  "tamano": "Grande",
  "descripcion": "Aroma dulce y floral ideal para salas",
  "precio": 8500,
  "moneda": "CRC",
  "stock": 15
}
```

* **Campos obligatorios:** `nombre`, `aroma`, `tamano`, `descripcion`, `precio`, `moneda`, `stock`
* **Respuesta exitosa (200):**

```json
{ "id": "6847a1c2f3e4b5d6e7f8a9b1" }
```

* **Respuesta de error (400):**

```json
{ "error": "Falta el campo obligatorio: precio" }
```

---

### Actualizar una vela

* **Método:** PUT
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/velas/6847a1c2f3e4b5d6e7f8a9b0`
* **Parámetro de ruta:** ID de la vela a actualizar.
* **Descripción:** Actualiza uno o más campos de una vela existente.
* **Cuerpo de la solicitud (JSON):**

```json
{
  "precio": 9000,
  "stock": 10
}
```

* **Respuesta exitosa (200):**

```json
{ "Vela actualizada correctamente": "6847a1c2f3e4b5d6e7f8a9b0" }
```

* **Respuesta de error (404):**

```json
{ "error": "Vela no actualizada" }
```

---

### Eliminar una vela

* **Método:** DELETE
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/velas/6847a1c2f3e4b5d6e7f8a9b0`
* **Parámetro de ruta:** ID de la vela a eliminar.
* **Descripción:** Elimina permanentemente una vela de la base de datos.
* **Respuesta exitosa (200):**

```json
{ "mensaje": "Vela con el id 6847a1c2f3e4b5d6e7f8a9b0 ha sido eliminada correctamente." }
```

* **Respuesta de error (404):**

```json
{ "error": "Vela no eliminada" }
```

---

## Clientes

### Obtener todos los clientes

* **Método:** GET
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/clientes`
* **Descripción:** Retorna la lista completa de clientes registrados en la base de datos.
* **Respuesta exitosa (200):**

```json
[
  {
    "_id": "6847a1c2f3e4b5d6e7f8a9c0",
    "nombre": "María López",
    "correo": "maria@gmail.com",
    "telefono": "88887777"
  }
]
```

---

### Obtener cliente por ID

* **Método:** GET
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/clientes?id=6847a1c2f3e4b5d6e7f8a9c0`
* **Parámetro de consulta:** `id` — ID del cliente a consultar.
* **Descripción:** Retorna los datos de un cliente específico según su ID.
* **Respuesta exitosa (200):**

```json
{
  "_id": "6847a1c2f3e4b5d6e7f8a9c0",
  "nombre": "María López",
  "correo": "maria@gmail.com",
  "telefono": "88887777"
}
```

* **Respuesta de error (404):**

```json
{ "error": "Cliente no encontrado" }
```

---

### Insertar un cliente

* **Método:** POST
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/clientes`
* **Descripción:** Crea un nuevo cliente en la base de datos.
* **Cuerpo de la solicitud (JSON):**

```json
{
  "nombre": "Carlos Mora",
  "correo": "carlos@gmail.com",
  "telefono": "77776666"
}
```

* **Campos obligatorios:** `nombre`, `correo`, `telefono`
* **Respuesta exitosa (200):**

```json
{ "id": "6847a1c2f3e4b5d6e7f8a9c1" }
```

* **Respuesta de error (400):**

```json
{ "error": "Faltan campos obligatorios" }
```

---

### Actualizar un cliente

* **Método:** PUT
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/clientes/6847a1c2f3e4b5d6e7f8a9c0`
* **Parámetro de ruta:** ID del cliente a actualizar.
* **Descripción:** Actualiza uno o más campos de un cliente existente.
* **Cuerpo de la solicitud (JSON):**

```json
{
  "telefono": "66665555"
}
```

* **Respuesta exitosa (200):**

```json
{ "Cliente actualizado correctamente": "6847a1c2f3e4b5d6e7f8a9c0" }
```

* **Respuesta de error (404):**

```json
{ "error": "Cliente no actualizado" }
```

---

### Eliminar un cliente

* **Método:** DELETE
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/clientes/6847a1c2f3e4b5d6e7f8a9c0`
* **Parámetro de ruta:** ID del cliente a eliminar.
* **Descripción:** Elimina permanentemente un cliente de la base de datos.
* **Respuesta exitosa (200):**

```json
{ "mensaje": "Cliente con el id 6847a1c2f3e4b5d6e7f8a9c0 ha sido eliminado correctamente." }
```

* **Respuesta de error (404):**

```json
{ "error": "Cliente no eliminado" }
```

---

## Ventas

### Obtener todas las ventas

* **Método:** GET
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/ventas`
* **Descripción:** Retorna la lista completa de ventas registradas en la base de datos.
* **Respuesta exitosa (200):**

```json
[
  {
    "_id": "6847a1c2f3e4b5d6e7f8a9d0",
    "cliente": "María López",
    "vela": "Serenity Lavanda",
    "cantidad": 2,
    "fecha": "2026-06-20"
  }
]
```

---

### Obtener venta por ID

* **Método:** GET
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/ventas?id=6847a1c2f3e4b5d6e7f8a9d0`
* **Parámetro de consulta:** `id` — ID de la venta a consultar.
* **Descripción:** Retorna los datos de una venta específica según su ID.
* **Respuesta exitosa (200):**

```json
{
  "_id": "6847a1c2f3e4b5d6e7f8a9d0",
  "cliente": "María López",
  "vela": "Serenity Lavanda",
  "cantidad": 2,
  "fecha": "2026-06-20"
}
```

* **Respuesta de error (404):**

```json
{ "error": "Venta no encontrada" }
```

---

### Insertar una venta

* **Método:** POST
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/ventas`
* **Descripción:** Registra una nueva venta en la base de datos.
* **Cuerpo de la solicitud (JSON):**

```json
{
  "cliente": "Carlos Mora",
  "vela": "Flor de Cerezo",
  "cantidad": 3,
  "fecha": "2026-07-09"
}
```

* **Campos obligatorios:** `cliente`, `vela`, `cantidad`, `fecha`
* **Respuesta exitosa (200):**

```json
{ "id": "6847a1c2f3e4b5d6e7f8a9d1" }
```

* **Respuesta de error (400):**

```json
{ "error": "Falta el campo obligatorio: fecha" }
```

---

### Actualizar una venta

* **Método:** PUT
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/ventas/6847a1c2f3e4b5d6e7f8a9d0`
* **Parámetro de ruta:** ID de la venta a actualizar.
* **Descripción:** Actualiza uno o más campos de una venta existente.
* **Cuerpo de la solicitud (JSON):**

```json
{
  "cantidad": 5
}
```

* **Respuesta exitosa (200):**

```json
{ "Venta actualizada correctamente": "6847a1c2f3e4b5d6e7f8a9d0" }
```

* **Respuesta de error (404):**

```json
{ "error": "Venta no actualizada" }
```

---

### Eliminar una venta

* **Método:** DELETE
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/ventas/6847a1c2f3e4b5d6e7f8a9d0`
* **Parámetro de ruta:** ID de la venta a eliminar.
* **Descripción:** Elimina permanentemente una venta de la base de datos.
* **Respuesta exitosa (200):**

```json
{ "mensaje": "Venta con el id 6847a1c2f3e4b5d6e7f8a9d0 ha sido eliminada correctamente." }
```

* **Respuesta de error (404):**

```json
{ "error": "Venta no eliminada" }
```

---

## Reportes

### Velas con al menos una venta

* **Método:** GET
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/reportes/velas-con-ventas`
* **Descripción:** Retorna la lista de nombres de velas que tienen al menos una venta registrada, usando `distinct` sobre la colección de ventas.
* **Respuesta exitosa (200):**

```json
[
  "Serenity Lavanda",
  "Flor de Cerezo"
]
```

---

### Velas vendidas y stock restante

* **Método:** GET
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/reportes/velas-stock`
* **Descripción:** Retorna cada vela con la cantidad total vendida y su stock actual, utilizando `$lookup` y `$project` en una agregación de MongoDB.
* **Respuesta exitosa (200):**

```json
[
  {
    "nombre": "Serenity Lavanda",
    "aroma": "Lavanda",
    "tamano": "Mediana",
    "precio": 6500,
    "moneda": "CRC",
    "stock": 18,
    "cantidadVendida": 2
  }
]
```

---

### Top 5 velas más vendidas

* **Método:** GET
* **URL:** `http://127.0.0.1:5000/velaxing/api/v1/reportes/top-5-velas`
* **Descripción:** Retorna las 5 velas con mayor cantidad total vendida, ordenadas de mayor a menor, usando `$group`, `$sort` y `$limit` en una agregación de MongoDB.
* **Respuesta exitosa (200):**

```json
[
  { "_id": "Serenity Lavanda", "totalVentas": 15 },
  { "_id": "Flor de Cerezo", "totalVentas": 10 }
]
```

---

## Integrantes

* Estefanía Quesada
* Meilyn Flores

## Nota

Este proyecto fue desarrollado con fines académicos y, al mismo tiempo, fue diseñado tomando como referencia el emprendimiento **Velaxing**, con el objetivo de crear una base de datos que pueda servir como punto de partida para un futuro sistema de gestión de clientes, inventario y ventas.
