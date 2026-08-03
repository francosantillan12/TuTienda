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

    if (orden === "stock-desc") {

        productos.sort(function (a, b) {

            return Number(b.dataset.stock) - Number(a.dataset.stock);

        });

    }

    if (orden === "stock-asc") {

        productos.sort(function (a, b) {

            return Number(a.dataset.stock) - Number(b.dataset.stock);

        });

    }

    tbody.innerHTML = "";

    productos.forEach(function (producto) {

        tbody.appendChild(producto);

    });

});


