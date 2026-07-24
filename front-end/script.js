"use strict";

/* =========================================================
   CONFIGURACIÓN DE LA API
========================================================= */

const API_URL = "http://127.0.0.1:5000/velaxing/api/v1";

/*
    Este token debe coincidir con uno válido almacenado
    en la colección "tokens" de MongoDB.
*/
const TOKEN = "abc123456"; 

const HEADERS = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`
};


/* =========================================================
   INICIO DE LA APLICACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    configurarBotones();
    cargarClientes();
});


/* =========================================================
   NAVEGACIÓN ENTRE SECCIONES
========================================================= */

function mostrarSeccion(nombreSeccion) {
    const secciones = document.querySelectorAll(".contenido");

    secciones.forEach((seccion) => {
        seccion.classList.add("d-none");
    });

    const seccionSeleccionada = document.getElementById(nombreSeccion);

    if (seccionSeleccionada) {
        seccionSeleccionada.classList.remove("d-none");
    }

    actualizarPestanaActiva(nombreSeccion);

    switch (nombreSeccion) {
        case "clientes":
            cargarClientes();
            break;

        case "velas":
            cargarVelas();
            break;

        case "ventas":
            cargarVentas();
            break;

        case "reportes":
            cargarReportes();
            break;

        default:
            console.warn("Sección desconocida:", nombreSeccion);
    }
}


function actualizarPestanaActiva(nombreSeccion) {
    const botones = document.querySelectorAll("#menuPrincipal .nav-link");

    botones.forEach((boton) => {
        boton.classList.remove("active");

        const accion = boton.getAttribute("onclick");

        if (accion && accion.includes(`'${nombreSeccion}'`)) {
            boton.classList.add("active");
        }
    });
}


/* =========================================================
   CONFIGURACIÓN DE BOTONES
========================================================= */

function configurarBotones() {
    const botonAgregarCliente = document.querySelector(
        "#clientes .btn-success"
    );

    const botonAgregarVela = document.querySelector(
        "#velas .btn-success"
    );

    const botonRegistrarVenta = document.querySelector(
        "#ventas .btn-primary"
    );

    if (botonAgregarCliente) {
        botonAgregarCliente.addEventListener("click", crearCliente);
    }

    if (botonAgregarVela) {
        botonAgregarVela.addEventListener("click", crearVela);
    }

    if (botonRegistrarVenta) {
        botonRegistrarVenta.addEventListener("click", crearVenta);
    }
}


/* =========================================================
   FUNCIÓN GENERAL PARA PETICIONES AJAX
========================================================= */

async function hacerPeticion(url, opciones = {}) {
    try {
        const respuesta = await fetch(url, {
            ...opciones,
            headers: {
                ...HEADERS,
                ...(opciones.headers || {})
            }
        });

        let datos = null;

        const tipoContenido = respuesta.headers.get("content-type");

        if (tipoContenido && tipoContenido.includes("application/json")) {
            datos = await respuesta.json();
        }

        if (!respuesta.ok) {
            const mensaje =
                datos?.error ||
                datos?.mensaje ||
                `Error HTTP ${respuesta.status}`;

            throw new Error(mensaje);
        }

        return datos;
    } catch (error) {
        console.error("Error en la petición:", error);

        mostrarAlerta(
            `No fue posible completar la operación: ${error.message}`,
            "danger"
        );

        throw error;
    }
}


/* =========================================================
   CLIENTES
========================================================= */

async function cargarClientes() {
    const tabla = document.getElementById("tablaClientes");

    tabla.innerHTML = filaCargando(4);

    try {
        const clientes = await hacerPeticion(`${API_URL}/clientes`);

        if (!Array.isArray(clientes) || clientes.length === 0) {
            tabla.innerHTML = filaSinDatos(
                4,
                "No hay clientes registrados."
            );
            return;
        }

        tabla.innerHTML = clientes
            .map(
                (cliente) => `
                    <tr>
                        <td>${escaparHTML(cliente.nombre)}</td>
                        <td>${escaparHTML(cliente.correo)}</td>
                        <td>${escaparHTML(cliente.telefono)}</td>
                        <td>
                            <button
                                class="btn btn-sm btn-warning me-1"
                                onclick="editarCliente(
                                    '${cliente._id}',
                                    '${escaparAtributo(cliente.nombre)}',
                                    '${escaparAtributo(cliente.correo)}',
                                    '${escaparAtributo(cliente.telefono)}'
                                )"
                            >
                                Editar
                            </button>

                            <button
                                class="btn btn-sm btn-danger"
                                onclick="eliminarCliente('${cliente._id}')"
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `
            )
            .join("");
    } catch {
        tabla.innerHTML = filaError(
            4,
            "No se pudieron cargar los clientes."
        );
    }
}


async function crearCliente() {
    const nombre = pedirDato("Nombre del cliente:");

    if (nombre === null) return;

    const correo = pedirDato("Correo electrónico:");

    if (correo === null) return;

    const telefono = pedirDato("Número de teléfono:");

    if (telefono === null) return;

    const nuevoCliente = {
        nombre,
        correo,
        telefono
    };

    try {
        await hacerPeticion(`${API_URL}/clientes`, {
            method: "POST",
            body: JSON.stringify(nuevoCliente)
        });

        mostrarAlerta("Cliente registrado correctamente.", "success");
        cargarClientes();
    } catch {
        // El mensaje ya fue mostrado por hacerPeticion.
    }
}


async function editarCliente(id, nombreActual, correoActual, telefonoActual) {
    const nombre = pedirDato(
        "Nombre del cliente:",
        nombreActual
    );

    if (nombre === null) return;

    const correo = pedirDato(
        "Correo electrónico:",
        correoActual
    );

    if (correo === null) return;

    const telefono = pedirDato(
        "Número de teléfono:",
        telefonoActual
    );

    if (telefono === null) return;

    const clienteActualizado = {
        nombre,
        correo,
        telefono
    };

    try {
        await hacerPeticion(`${API_URL}/clientes/${id}`, {
            method: "PUT",
            body: JSON.stringify(clienteActualizado)
        });

        mostrarAlerta("Cliente actualizado correctamente.", "success");
        cargarClientes();
    } catch {
        // El mensaje ya fue mostrado por hacerPeticion.
    }
}


async function eliminarCliente(id) {
    const confirmar = window.confirm(
        "¿Está segura de que desea eliminar este cliente?"
    );

    if (!confirmar) return;

    try {
        await hacerPeticion(`${API_URL}/clientes/${id}`, {
            method: "DELETE"
        });

        mostrarAlerta("Cliente eliminado correctamente.", "success");
        cargarClientes();
    } catch {
        // El mensaje ya fue mostrado por hacerPeticion.
    }
}


/* =========================================================
   VELAS
========================================================= */

async function cargarVelas() {
    const tabla = document.getElementById("tablaVelas");

    tabla.innerHTML = filaCargando(6);

    try {
        const velas = await hacerPeticion(`${API_URL}/velas`);

        if (!Array.isArray(velas) || velas.length === 0) {
            tabla.innerHTML = filaSinDatos(
                6,
                "No hay velas registradas."
            );
            return;
        }

        tabla.innerHTML = velas
            .map(
                (vela) => `
                    <tr>
                        <td>${escaparHTML(vela.nombre)}</td>
                        <td>${escaparHTML(vela.aroma)}</td>
                        <td>${escaparHTML(vela.tamano)}</td>
                        <td>${formatearMoneda(vela.precio)}</td>
                        <td>${escaparHTML(vela.stock)}</td>
                        <td>
                            <button
                                class="btn btn-sm btn-warning me-1"
                                onclick='editarVela(
                                    ${JSON.stringify(vela)}
                                )'
                            >
                                Editar
                            </button>

                            <button
                                class="btn btn-sm btn-danger"
                                onclick="eliminarVela('${vela._id}')"
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `
            )
            .join("");
    } catch {
        tabla.innerHTML = filaError(
            6,
            "No se pudieron cargar las velas."
        );
    }
}


async function crearVela() {
    const datos = solicitarDatosVela();

    if (!datos) return;

    try {
        await hacerPeticion(`${API_URL}/velas`, {
            method: "POST",
            body: JSON.stringify(datos)
        });

        mostrarAlerta("Vela registrada correctamente.", "success");
        cargarVelas();
    } catch {
        // El mensaje ya fue mostrado por hacerPeticion.
    }
}


async function editarVela(vela) {
    const datos = solicitarDatosVela(vela);

    if (!datos) return;

    try {
        await hacerPeticion(`${API_URL}/velas/${vela._id}`, {
            method: "PUT",
            body: JSON.stringify(datos)
        });

        mostrarAlerta("Vela actualizada correctamente.", "success");
        cargarVelas();
    } catch {
        // El mensaje ya fue mostrado por hacerPeticion.
    }
}


function solicitarDatosVela(vela = {}) {
    const nombre = pedirDato(
        "Nombre de la vela:",
        vela.nombre || ""
    );

    if (nombre === null) return null;

    const aroma = pedirDato(
        "Aroma:",
        vela.aroma || ""
    );

    if (aroma === null) return null;

    const tamano = pedirDato(
        "Tamaño:",
        vela.tamano || ""
    );

    if (tamano === null) return null;

    const descripcion = pedirDato(
        "Descripción:",
        vela.descripcion || ""
    );

    if (descripcion === null) return null;

    const precioTexto = pedirDato(
        "Precio en colones:",
        vela.precio ?? ""
    );

    if (precioTexto === null) return null;

    const precio = Number(precioTexto);

    if (!Number.isFinite(precio) || precio < 0) {
        mostrarAlerta("El precio debe ser un número válido.", "warning");
        return null;
    }

    const stockTexto = pedirDato(
        "Cantidad disponible en stock:",
        vela.stock ?? ""
    );

    if (stockTexto === null) return null;

    const stock = Number(stockTexto);

    if (!Number.isInteger(stock) || stock < 0) {
        mostrarAlerta(
            "El stock debe ser un número entero válido.",
            "warning"
        );
        return null;
    }

    return {
        nombre,
        aroma,
        tamano,
        descripcion,
        precio,
        moneda: vela.moneda || "CRC",
        stock
    };
}


async function eliminarVela(id) {
    const confirmar = window.confirm(
        "¿Está segura de que desea eliminar esta vela?"
    );

    if (!confirmar) return;

    try {
        await hacerPeticion(`${API_URL}/velas/${id}`, {
            method: "DELETE"
        });

        mostrarAlerta("Vela eliminada correctamente.", "success");
        cargarVelas();
    } catch {
        // El mensaje ya fue mostrado por hacerPeticion.
    }
}


/* =========================================================
   VENTAS
========================================================= */

async function cargarVentas() {
    const tabla = document.getElementById("tablaVentas");

    tabla.innerHTML = filaCargando(5);

    try {
        const ventas = await hacerPeticion(`${API_URL}/ventas`);

        if (!Array.isArray(ventas) || ventas.length === 0) {
            tabla.innerHTML = filaSinDatos(
                5,
                "No hay ventas registradas."
            );
            return;
        }

        tabla.innerHTML = ventas
            .map(
                (venta) => `
                    <tr>
                        <td>${escaparHTML(venta.cliente)}</td>
                        <td>${escaparHTML(venta.vela)}</td>
                        <td>${escaparHTML(venta.cantidad)}</td>
                        <td>${formatearFecha(venta.fecha)}</td>
                        <td>
                            <button
                                class="btn btn-sm btn-warning me-1"
                                onclick='editarVenta(
                                    ${JSON.stringify(venta)}
                                )'
                            >
                                Editar
                            </button>

                            <button
                                class="btn btn-sm btn-danger"
                                onclick="eliminarVenta('${venta._id}')"
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `
            )
            .join("");
    } catch {
        tabla.innerHTML = filaError(
            5,
            "No se pudieron cargar las ventas."
        );
    }
}


async function crearVenta() {
    const datos = solicitarDatosVenta();

    if (!datos) return;

    try {
        await hacerPeticion(`${API_URL}/ventas`, {
            method: "POST",
            body: JSON.stringify(datos)
        });

        mostrarAlerta("Venta registrada correctamente.", "success");
        cargarVentas();
    } catch {
        // El mensaje ya fue mostrado por hacerPeticion.
    }
}


async function editarVenta(venta) {
    const datos = solicitarDatosVenta(venta);

    if (!datos) return;

    try {
        await hacerPeticion(`${API_URL}/ventas/${venta._id}`, {
            method: "PUT",
            body: JSON.stringify(datos)
        });

        mostrarAlerta("Venta actualizada correctamente.", "success");
        cargarVentas();
    } catch {
        // El mensaje ya fue mostrado por hacerPeticion.
    }
}


function solicitarDatosVenta(venta = {}) {
    const cliente = pedirDato(
        "Nombre del cliente:",
        venta.cliente || ""
    );

    if (cliente === null) return null;

    const vela = pedirDato(
        "Nombre de la vela:",
        venta.vela || ""
    );

    if (vela === null) return null;

    const cantidadTexto = pedirDato(
        "Cantidad vendida:",
        venta.cantidad ?? ""
    );

    if (cantidadTexto === null) return null;

    const cantidad = Number(cantidadTexto);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        mostrarAlerta(
            "La cantidad debe ser un número entero mayor que cero.",
            "warning"
        );
        return null;
    }

    const fecha = pedirDato(
        "Fecha de la venta en formato AAAA-MM-DD:",
        normalizarFechaParaFormulario(venta.fecha)
    );

    if (fecha === null) return null;

    if (!validarFecha(fecha)) {
        mostrarAlerta(
            "La fecha debe usar el formato AAAA-MM-DD.",
            "warning"
        );
        return null;
    }

    return {
        cliente,
        vela,
        cantidad,
        fecha
    };
}


async function eliminarVenta(id) {
    const confirmar = window.confirm(
        "¿Está segura de que desea eliminar esta venta?"
    );

    if (!confirmar) return;

    try {
        await hacerPeticion(`${API_URL}/ventas/${id}`, {
            method: "DELETE"
        });

        mostrarAlerta("Venta eliminada correctamente.", "success");
        cargarVentas();
    } catch {
        // El mensaje ya fue mostrado por hacerPeticion.
    }
}


/* =========================================================
   REPORTES
========================================================= */

async function cargarReportes() {
    await Promise.allSettled([
        cargarVelasConVentas(),
        cargarReporteStock(),
        cargarTopCincoVelas()
    ]);
}


async function cargarVelasConVentas() {
    const tabla = document.getElementById("reporteVelasVentas");

    tabla.innerHTML = filaCargando(1);

    try {
        const velas = await hacerPeticion(
            `${API_URL}/reportes/velas-con-ventas`
        );

        if (!Array.isArray(velas) || velas.length === 0) {
            tabla.innerHTML = filaSinDatos(
                1,
                "No hay ventas registradas."
            );
            return;
        }

        tabla.innerHTML = velas
            .map(
                (nombre, indice) => `
                    <tr>
                        <td>
                            <span class="badge bg-info text-dark me-2">
                                ${indice + 1}
                            </span>
                            ${escaparHTML(nombre)}
                        </td>
                    </tr>
                `
            )
            .join("");
    } catch {
        tabla.innerHTML = filaError(
            1,
            "No se pudo cargar el reporte."
        );
    }
}


async function cargarReporteStock() {
    const tabla = document.getElementById("reporteStock");

    tabla.innerHTML = filaCargando(1);

    try {
        const datos = await hacerPeticion(
            `${API_URL}/reportes/velas-stock`
        );

        if (!Array.isArray(datos) || datos.length === 0) {
            tabla.innerHTML = filaSinDatos(
                1,
                "No hay información disponible."
            );
            return;
        }

        tabla.innerHTML = datos
            .map(
                (vela) => `
                    <tr>
                        <td>
                            <strong>${escaparHTML(vela.nombre)}</strong>
                            <br>
                            <small class="text-muted">
                                Vendidas: ${escaparHTML(
                                    vela.cantidadVendida ?? 0
                                )}
                                · Stock: ${escaparHTML(vela.stock ?? 0)}
                            </small>
                        </td>
                    </tr>
                `
            )
            .join("");
    } catch {
        tabla.innerHTML = filaError(
            1,
            "No se pudo cargar el reporte."
        );
    }
}


async function cargarTopCincoVelas() {
    const tabla = document.getElementById("reporteTop5");

    tabla.innerHTML = filaCargando(1);

    try {
        const datos = await hacerPeticion(
            `${API_URL}/reportes/top-5-velas`
        );

        if (!Array.isArray(datos) || datos.length === 0) {
            tabla.innerHTML = filaSinDatos(
                1,
                "No hay información disponible."
            );
            return;
        }

        tabla.innerHTML = datos
            .map(
                (vela, indice) => `
                    <tr>
                        <td>
                            <strong>
                                ${indice + 1}. ${escaparHTML(vela._id)}
                            </strong>
                            <br>
                            <small class="text-muted">
                                Cantidad vendida:
                                ${escaparHTML(vela.totalVentas)}
                            </small>
                        </td>
                    </tr>
                `
            )
            .join("");
    } catch {
        tabla.innerHTML = filaError(
            1,
            "No se pudo cargar el reporte."
        );
    }
}


/* =========================================================
   UTILIDADES
========================================================= */

function pedirDato(mensaje, valorActual = "") {
    const resultado = window.prompt(mensaje, valorActual);

    if (resultado === null) {
        return null;
    }

    const valorLimpio = resultado.trim();

    if (valorLimpio === "") {
        mostrarAlerta("El campo no puede quedar vacío.", "warning");
        return null;
    }

    return valorLimpio;
}


function mostrarAlerta(mensaje, tipo = "info") {
    const alertaAnterior = document.getElementById("alertaAplicacion");

    if (alertaAnterior) {
        alertaAnterior.remove();
    }

    const alerta = document.createElement("div");

    alerta.id = "alertaAplicacion";
    alerta.className =
        `alert alert-${tipo} alert-dismissible fade show position-fixed ` +
        "top-0 start-50 translate-middle-x mt-3 shadow";

    alerta.style.zIndex = "2000";
    alerta.style.minWidth = "320px";

    alerta.innerHTML = `
        ${escaparHTML(mensaje)}
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Cerrar"
        ></button>
    `;

    document.body.appendChild(alerta);

    window.setTimeout(() => {
        if (alerta.isConnected) {
            alerta.remove();
        }
    }, 4000);
}


function filaCargando(columnas) {
    return `
        <tr>
            <td colspan="${columnas}" class="text-center py-4">
                <div
                    class="spinner-border spinner-border-sm"
                    role="status"
                ></div>
                <span class="ms-2">Cargando información...</span>
            </td>
        </tr>
    `;
}


function filaSinDatos(columnas, mensaje) {
    return `
        <tr>
            <td colspan="${columnas}" class="text-center text-muted py-4">
                ${escaparHTML(mensaje)}
            </td>
        </tr>
    `;
}


function filaError(columnas, mensaje) {
    return `
        <tr>
            <td colspan="${columnas}" class="text-center text-danger py-4">
                ${escaparHTML(mensaje)}
            </td>
        </tr>
    `;
}


function formatearMoneda(valor) {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return "₡0";
    }

    return new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        maximumFractionDigits: 0
    }).format(numero);
}


function formatearFecha(fecha) {
    if (!fecha) {
        return "";
    }

    let valorFecha = fecha;

    // Caso 1: MongoDB devuelve { "$date": "2026-07-20T00:00:00.000Z" }
    if (
        typeof fecha === "object" &&
        fecha !== null &&
        fecha.$date
    ) {
        valorFecha = fecha.$date;
    }

    // Caso 2: PyMongo puede devolver { "$date": { "$numberLong": "..." } }
    if (
        typeof valorFecha === "object" &&
        valorFecha !== null &&
        valorFecha.$numberLong
    ) {
        valorFecha = Number(valorFecha.$numberLong);
    }

    const texto = String(valorFecha);

    // Fecha simple: 2026-07-24
    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
        const [anio, mes, dia] = texto.split("-");
        return `${dia}/${mes}/${anio}`;
    }

    const fechaConvertida = new Date(valorFecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
        return "Fecha no válida";
    }

    return fechaConvertida.toLocaleDateString("es-CR", {
        timeZone: "UTC"
    });
}


function normalizarFechaParaFormulario(fecha) {
    if (!fecha) {
        return new Date().toISOString().split("T")[0];
    }

    let valorFecha = fecha;

    if (
        typeof fecha === "object" &&
        fecha !== null &&
        fecha.$date
    ) {
        valorFecha = fecha.$date;
    }

    if (
        typeof valorFecha === "object" &&
        valorFecha !== null &&
        valorFecha.$numberLong
    ) {
        valorFecha = Number(valorFecha.$numberLong);
    }

    const texto = String(valorFecha);

    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
        return texto;
    }

    const fechaConvertida = new Date(valorFecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
        return "";
    }

    return fechaConvertida.toISOString().split("T")[0];
}


function validarFecha(fecha) {
    return /^\d{4}-\d{2}-\d{2}$/.test(fecha);
}


function escaparHTML(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function escaparAtributo(valor) {
    return String(valor ?? "")
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'")
        .replaceAll('"', "&quot;")
        .replaceAll("\n", " ");
}