import { Router } from "express";
import TicketModel from "../model/ticket.model.js";

const router = Router();

router.delete("/:tid", async function (req, res) {

    try {

        const { tid } = req.params;

        const ticket = await TicketModel.findByIdAndDelete(tid);

        if (!ticket) {

            return res.status(404).json({

                status: "error",

                message: "Ticket no encontrado"

            });

        }

        res.json({

            status: "success",

            message: "Ticket eliminado"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            status: "error",

            message: "Error al eliminar el ticket"

        });

    }

});

router.get("/estadisticas", async function (req, res) {

    try {

        const tickets = await TicketModel.find();

        const totalVendido = tickets.reduce(function (total, ticket) {

            return total + ticket.amount;

        }, 0);

        const ticketPromedio = tickets.length > 0
            ? Math.round(totalVendido / tickets.length)
            : 0;


        // =========================================
        // PRODUCTO MÁS VENDIDO HISTÓRICO
        // =========================================

        const ventasPorProducto = {};

        tickets.forEach(function (ticket) {

            ticket.products.forEach(function (item) {

                if (!ventasPorProducto[item.title]) {

                    ventasPorProducto[item.title] = 0;

                }

                ventasPorProducto[item.title] += item.quantity;

            });

        });


        let productoMasVendido = "";

        let cantidadProductoMasVendido = 0;


        for (const producto in ventasPorProducto) {

            if (ventasPorProducto[producto] > cantidadProductoMasVendido) {

                cantidadProductoMasVendido =
                    ventasPorProducto[producto];

                productoMasVendido = producto;

            }

        }


        // =========================================
        // PRODUCTO MÁS VENDIDO HOY
        // =========================================

        const hoy = new Date();

        const ticketsHoy = tickets.filter(function (ticket) {

            const fecha = new Date(ticket.purchase_datetime);

            return (
                fecha.getDate() === hoy.getDate() &&
                fecha.getMonth() === hoy.getMonth() &&
                fecha.getFullYear() === hoy.getFullYear()
            );

        });


        const ventasHoy = ticketsHoy.length;

        const totalVendidoHoy = ticketsHoy.reduce(function (total, ticket) {

            return total + ticket.amount;

        }, 0);

        const ticketPromedioHoy = ventasHoy > 0
            ? Math.round(totalVendidoHoy / ventasHoy)
            : 0;


        const ventasHoyPorProducto = {};

        ticketsHoy.forEach(function (ticket) {

            ticket.products.forEach(function (item) {

                if (!ventasHoyPorProducto[item.title]) {

                    ventasHoyPorProducto[item.title] = 0;

                }

                ventasHoyPorProducto[item.title] += item.quantity;

            });

        });


        let productoMasVendidoHoy = "";

        let cantidadProductoMasVendidoHoy = 0;


        for (const producto in ventasHoyPorProducto) {

            if (
                ventasHoyPorProducto[producto] >
                cantidadProductoMasVendidoHoy
            ) {

                cantidadProductoMasVendidoHoy =
                    ventasHoyPorProducto[producto];

                productoMasVendidoHoy = producto;

            }

        }


        res.json({

            status: "success",

            cantidadVentas: tickets.length,

            totalVendido,

            ticketPromedio,

            productoMasVendido,

            cantidadProductoMasVendido,

            productoMasVendidoHoy,

            cantidadProductoMasVendidoHoy,

            ventasHoy,

            totalVendidoHoy,

            ticketPromedioHoy

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            status: "error",

            message: "Error al obtener estadísticas"

        });

    }

});

export default router;

