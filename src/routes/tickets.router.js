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

export default router;

