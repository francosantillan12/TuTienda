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

                    alert("Ticket eliminado correctamente");

                    const fila = boton.closest("tr");

                    fila.remove();

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