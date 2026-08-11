import CarritoModel from "../model/carrito.model.js";
import TicketModel from "../model/ticket.model.js";
import { enviarTicketPorMail } from "./mailing.service.js";

class CartsService {
  async purchase(cid, user) {

    // 🔐 Solo puede comprar su propio carrito
    if (String(user.cart) !== String(cid)) {

        throw new Error("FORBIDDEN");

    }

    const carrito = await CarritoModel
        .findById(cid)
        .populate("products.product");

    if (!carrito) {

        throw new Error("CART_NOT_FOUND");

    }

    const productosComprados = [];
    const productosSinStock = [];
    const itemsManuales = carrito.manualItems || [];

    let totalCompra = 0;


    // =========================================
    // 1. PRIMERO VERIFICAMOS TODO EL STOCK
    // =========================================

    for (const item of carrito.products) {

        const producto = item.product;
        const cantidad = item.quantity;

        if (!producto) continue;

        if (producto.stock < cantidad) {

            productosSinStock.push({

                product: producto._id,

                quantity: cantidad,

                title: producto.titulo || ""

            });

        }

    }


    // =========================================
    // 2. SI FALTA STOCK, NO SE HACE LA COMPRA
    // =========================================

    if (productosSinStock.length > 0) {

        return {

            status: "error",

            error:
                "No se puede finalizar la compra porque uno o más productos no tienen stock suficiente",

            productosSinStock

        };

    }


    // =========================================
    // 3. AHORA SÍ DESCONTAMOS STOCK
    // =========================================

    for (const item of carrito.products) {

        const producto = item.product;
        const cantidad = item.quantity;

        if (!producto) continue;


        producto.stock = producto.stock - cantidad;

        await producto.save();


        // Guardamos detalle para el ticket

        productosComprados.push({

            product: producto._id,

            quantity: cantidad,

            price: producto.precio || 0,

            title: producto.titulo || ""

        });


        totalCompra +=
            (producto.precio || 0) * cantidad;

    }


    // =========================================
    // 4. SUMAMOS LOS IMPORTES MANUALES
    // =========================================

    for (const item of itemsManuales) {

        totalCompra += Number(item.price) || 0;

    }


    // =========================================
    // 5. SI NO HAY NADA PARA COBRAR
    // =========================================

    if (
        productosComprados.length === 0 &&
        itemsManuales.length === 0
    ) {

        return {

            status: "error",

            error: "No hay productos para comprar"

        };

    }


    // =========================================
    // 6. CREAMOS EL TICKET
    // =========================================

    const code =
        `TCK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;


    const ticket = await TicketModel.create({

        code: code,

        amount: totalCompra,

        purchaser: user.email,

        products: productosComprados,

        manualItems: itemsManuales

    });


    // =========================================
    // 7. ENVIAMOS EL TICKET POR MAIL
    // =========================================

    try {

        await enviarTicketPorMail(
            ticket,
            user.email
        );

    } catch (mailError) {

        console.error(
            "Error enviando ticket por mail:",
            mailError
        );

    }


    // =========================================
    // 8. LIMPIAMOS EL CARRITO
    // =========================================

    carrito.products = productosSinStock;

    carrito.manualItems = [];

    await carrito.save();


    return {

        status: "success",

        message: "Compra realizada",

        ticket,

        productosSinStock

    };

}
}

export default CartsService;