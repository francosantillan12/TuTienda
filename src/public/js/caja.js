const caja = document.getElementById("caja");
const idCarrito = caja.dataset.carrito;

/* ===================================
   RECARGAR CAJA
=================================== */

function recargarCaja() {
    location.reload();
}

/* ===================================
   ACTUALIZAR CANTIDAD
=================================== */

function actualizarCantidad(idProducto, cantidad) {

    fetch(`/api/carts/${idCarrito}/products/${idProducto}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            quantity: cantidad
        })

    })

    .then(function (res) {

        return res.json();

    })

    .then(function () {

        recargarCaja();

    })

    .catch(function (error) {

        console.log(error);

        alert("No se pudo actualizar la cantidad.");

    });

}

/* ===================================
   ELIMINAR PRODUCTO
=================================== */

function eliminarProducto(idProducto) {

    fetch(`/api/carts/${idCarrito}/products/${idProducto}`, {

        method: "DELETE"

    })

    .then(function (res) {

        return res.json();

    })

    .then(function () {

        recargarCaja();

    })

    .catch(function (error) {

        console.log(error);

        alert("No se pudo eliminar el producto.");

    });

}

/* ===================================
   BOTÓN ELIMINAR
=================================== */

const botonesEliminar = document.querySelectorAll(".btn-eliminar");

botonesEliminar.forEach(function (boton) {

    boton.addEventListener("click", function () {

        eliminarProducto(boton.dataset.pid);

    });

});

/* ===================================
   CANCELAR VENTA
=================================== */

const btnVaciar = document.getElementById("btn-vaciar");

if (btnVaciar) {

    btnVaciar.addEventListener("click", function () {

        if (!confirm("¿Seguro que querés cancelar la venta?")) {

            return;

        }

        fetch(`/api/carts/${idCarrito}`, {

            method: "DELETE"

        })

        .then(function (res) {

            return res.json();

        })

        .then(function () {

            alert("Venta cancelada");

            recargarCaja();

        })

        .catch(function (error) {

            console.log(error);

            alert("No se pudo cancelar la venta");

        });

    });

}

/* ===================================
   COBRAR
=================================== */

const btnComprar = document.getElementById("btn-comprar");

if (btnComprar) {

    btnComprar.addEventListener("click", function () {

        if (!confirm("¿Confirmar la compra?")) {

            return;

        }

        fetch(`/api/carts/${idCarrito}/purchase`, {

            method: "POST"

        })

        .then(function (res) {

            return res.json();

        })

        .then(function (data) {

            if (data.status === "success") {

                window.location.href = `/ticket/${data.ticket._id}`;

            } else {

                alert(data.error || "No se pudo completar la compra");

            }

        })

        .catch(function (error) {

            console.log(error);

            alert("Error al finalizar la compra");

        });

    });

}

/* ===================================
   AUMENTAR CANTIDAD
=================================== */

const botonesSumar = document.querySelectorAll(".btn-sumar");

botonesSumar.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const cantidadActual = Number(boton.dataset.quantity);

        actualizarCantidad(

            boton.dataset.pid,

            cantidadActual + 1

        );

    });

});

/* ===================================
   DISMINUIR CANTIDAD
=================================== */

const botonesRestar = document.querySelectorAll(".btn-restar");

botonesRestar.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const cantidadActual = Number(boton.dataset.quantity);

        if (cantidadActual === 1) {

            eliminarProducto(boton.dataset.pid);

            return;

        }

        actualizarCantidad(

            boton.dataset.pid,

            cantidadActual - 1

        );

    });

});