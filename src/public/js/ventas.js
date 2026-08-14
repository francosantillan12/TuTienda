const botonesEliminar = document.querySelectorAll(".btn-eliminar-ticket");

botonesEliminar.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const confirmar = confirm("¿Eliminar este ticket?");

        if (!confirmar) {
            return;
        }

        fetch(`/api/tickets/${boton.dataset.id}`, {

            method: "DELETE"

        })

            .then(function (res) {

                return res.json();

            })

            .then(function (data) {

                if (data.status === "success") {

                    const fila = boton.closest("tr");

                    fila.remove();

                    actualizarEstadisticas();

                    alert("Ticket eliminado correctamente");

                } else {

                    alert("No se pudo eliminar el ticket");

                }

            })

            .catch(function (error) {

                console.log(error);

                alert("Error al eliminar el ticket");

            });

    });

});


function actualizarEstadisticas() {

    fetch("/api/tickets/estadisticas")

        .then(function (res) {

            return res.json();

        })

        .then(function (data) {

            if (data.status !== "success") {

                return;

            }

            document.getElementById("ventas-realizadas").textContent =
                data.ventasHoy;

            document.getElementById("total-vendido").textContent =
                "$ " + Number(data.totalVendidoHoy).toLocaleString("es-AR");

            document.getElementById("ticket-promedio").textContent =
                "$ " + Number(data.ticketPromedioHoy).toLocaleString("es-AR");

            document.getElementById("total-vendido-historico").textContent =
                "$ " + Number(data.totalVendido).toLocaleString("es-AR");

            document.getElementById("producto-mas-vendido-hoy").textContent =
                data.productoMasVendidoHoy || "Ninguna venta realizada";

            document.getElementById("cantidad-mas-vendido-hoy").textContent =
                data.cantidadProductoMasVendidoHoy || 0;

            document.getElementById("producto-mas-vendido").textContent =
                data.productoMasVendido || "Calculando...";

            document.getElementById("cantidad-mas-vendido").textContent =
                data.cantidadProductoMasVendido || 0;

        })

        .catch(function (error) {

            console.log("Error al actualizar estadísticas:", error);

        });

}

/* ===================================
   CONSULTAR VENTAS POR PERÍODO
=================================== */

const fechaDesde = document.getElementById("fecha-desde");
const fechaHasta = document.getElementById("fecha-hasta");
const btnConsultarVentas = document.getElementById("btn-consultar-ventas");
const totalVendidoPeriodo = document.getElementById("total-vendido-periodo");
const cantidadVentasPeriodo = document.getElementById("cantidad-ventas-periodo");

if (btnConsultarVentas) {

    btnConsultarVentas.addEventListener("click", function () {

        const desde = fechaDesde.value;
        const hasta = fechaHasta.value;

        if (!desde || !hasta) {

            alert("Seleccioná una fecha de inicio y una fecha de fin.");

            return;

        }

        if (desde > hasta) {

            alert("La fecha desde no puede ser posterior a la fecha hasta.");

            return;

        }

        fetch(`/api/tickets/por-periodo?desde=${desde}&hasta=${hasta}`)

            .then(function (res) {

                return res.json();

            })

            .then(function (data) {

                if (data.status !== "success") {

                    alert(data.error || "No se pudieron consultar las ventas.");

                    return;

                }

                totalVendidoPeriodo.textContent =
                    "$ " + Number(data.totalVendido).toLocaleString("es-AR");

                cantidadVentasPeriodo.textContent =
                    data.cantidadVentas === 1
                        ? "1 venta realizada"
                        : `${data.cantidadVentas} ventas realizadas`;

            })

            .catch(function (error) {

                console.log(error);

                alert("Error al consultar las ventas.");

            });

    });

}