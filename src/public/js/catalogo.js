const catalogo = document.getElementById("catalogo");
const idCarrito = catalogo.dataset.carrito;

/* ===================================
   ELEMENTOS
=================================== */

const buscador = document.getElementById("buscador-productos");
const filtroCategoria = document.getElementById("filtro-categoria");
const ordenarProductos = document.getElementById("ordenar-productos");

const tbody = document.querySelector(".tabla-productos tbody");

let productos = Array.from(document.querySelectorAll(".producto-fila"));


/* ===================================
   FORMATEAR FECHA DE VENCIMIENTO
=================================== */

productos.forEach(function (producto) {

    const celda = producto.querySelector(".producto-vencimiento");

    if (!celda) return;

    const texto = celda.textContent.trim();

    if (!texto || texto === "-") return;

    const coincidencia = texto.match(
        /(\d{2})\/(\d{2})\/(\d{4})/
    );

    if (!coincidencia) return;

    const dia = coincidencia[1];
    const mes = coincidencia[2];
    const año = coincidencia[3];

    celda.textContent =
        `${dia}/${mes}/${año.substring(2)}`;

});


/* ===================================
   AGREGAR A CAJA
=================================== */

const botones = document.querySelectorAll(".boton-agregar");

botones.forEach(function (boton) {

    boton.addEventListener("click", function () {

        if (!idCarrito) {

            alert("Tenés que iniciar sesión");

            return;

        }

        const fila = boton.closest("tr");

        const idProducto = fila.dataset.id;

        fetch(`/api/carts/${idCarrito}/products/${idProducto}`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            }

        })

        .then(function (res) {

            return res.json();

        })

        .then(function (data) {

            if (data.error) {

                alert(data.error);

                return;

            }

            alert("Producto agregado a la Caja");

        })

        .catch(function (error) {

            console.log(error);

            alert("No se pudo agregar");

        });

    });

});

/* ===================================
   BUSCADOR Y CATEGORÍA
=================================== */

function filtrarProductos() {

    const texto = buscador.value.toLowerCase().trim();

    const categoriaSeleccionada =
        filtroCategoria.value.toLowerCase();

    productos.forEach(function (producto) {

        const titulo =
            producto.dataset.titulo.toLowerCase();

        const categoria =
            producto.dataset.categoria.toLowerCase();

        const codigo =
            producto.dataset.codigo.toLowerCase();

        const coincideTexto =

            titulo.includes(texto) ||

            categoria.includes(texto) ||

            codigo.includes(texto);

        const coincideCategoria =

            categoriaSeleccionada === "" ||

            categoria === categoriaSeleccionada;

        producto.style.display =

            coincideTexto && coincideCategoria

                ? ""

                : "none";

    });

}

buscador.addEventListener("input", filtrarProductos);

filtroCategoria.addEventListener("change", filtrarProductos);

/* ===================================
   ORDENAR
=================================== */

ordenarProductos.addEventListener("change", function () {

    const orden = ordenarProductos.value;


    /* STOCK MAYOR A MENOR */

    if (orden === "stock-desc") {

        productos.sort(function (a, b) {

            return Number(b.dataset.stock) - Number(a.dataset.stock);

        });

    }


    /* STOCK MENOR A MAYOR */

    if (orden === "stock-asc") {

        productos.sort(function (a, b) {

            return Number(a.dataset.stock) - Number(b.dataset.stock);

        });

    }


    /* VENCIMIENTO MÁS PRÓXIMO */

    if (orden === "vencimiento-asc") {

        productos.sort(function (a, b) {

            const fechaA =
                a.dataset.fechaVencimiento
                    ? new Date(a.dataset.fechaVencimiento).getTime()
                    : Infinity;

            const fechaB =
                b.dataset.fechaVencimiento
                    ? new Date(b.dataset.fechaVencimiento).getTime()
                    : Infinity;

            return fechaA - fechaB;

        });

    }


    /* VENCIMIENTO MÁS LEJANO */

    if (orden === "vencimiento-desc") {

        productos.sort(function (a, b) {

            const fechaA =
                a.dataset.fechaVencimiento
                    ? new Date(a.dataset.fechaVencimiento).getTime()
                    : -Infinity;

            const fechaB =
                b.dataset.fechaVencimiento
                    ? new Date(b.dataset.fechaVencimiento).getTime()
                    : -Infinity;

            return fechaB - fechaA;

        });

    }


    /* VOLVER A DIBUJAR LA TABLA */

    tbody.innerHTML = "";

    productos.forEach(function (producto) {

        tbody.appendChild(producto);

    });

});