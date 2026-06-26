import { Router } from "express";
import ProductoModel from "../model/producto.model.js";
import CarritoModel from "../model/carrito.model.js";
import TicketModel from "../model/ticket.model.js";

const router = Router();

/* =========================================================
   INICIO
========================================================= */

router.get("/", function (req, res) {
  res.render("home", {
    layout: "main",
    tituloPagina: "Inicio"
  });
});

/* =========================================================
   ADMINISTRACIÓN
========================================================= */

router.get("/realtimeproducts", function (req, res) {
  res.render("realtimeproducts", {
    layout: "main",
    tituloPagina: "Administración de productos"
  });
});

/* =========================================================
   CATÁLOGO
========================================================= */

router.get("/products", async (req, res) => {
  try {

    const productosDB = await ProductoModel.find({});
    const categorias = (await ProductoModel.distinct("categoria")).sort();

    const productos = productosDB.map((producto) =>
      producto.toObject()
    );

    res.render("products", {
      layout: "main",
      tituloPagina: "Catálogo",
      productos,
      categorias
    });

  } catch (error) {
    console.error("Error al renderizar /products:", error);
    res.status(500).send("Error al cargar el catálogo");
  }
});

/* =========================================================
   CAJA
========================================================= */

router.get("/carts/:cid", async (req, res) => {
  try {

    const { cid } = req.params;

    const carrito = await CarritoModel.findById(cid)
      .populate("products.product");

    if (!carrito) {
      return res.status(404).send("Carrito no encontrado");
    }

    const carritoPlano = carrito.toObject();

    const total = carrito.products.reduce(function (acumulador, item) {
      return acumulador + (item.product.precio * item.quantity);
    }, 0);

    res.render("carts", {
      layout: "main",
      tituloPagina: "Caja",
      carrito: carritoPlano,
      total
    });

  } catch (error) {
    console.error("Error al renderizar /carts/:cid:", error);
    res.status(500).send("Error al cargar el carrito");
  }
});

/* =========================================================
   TICKET
========================================================= */

router.get("/ticket/:tid", async (req, res) => {
  try {

    const { tid } = req.params;

    const ticket = await TicketModel.findById(tid);

    if (!ticket) {
      return res.status(404).send("Ticket no encontrado");
    }

    res.render("ticket", {
      layout: "main",
      tituloPagina: "Comprobante de compra",
      ticket: ticket.toObject()
    });

  } catch (error) {
    console.error("Error al renderizar ticket:", error);
    res.status(500).send("Error al cargar el ticket");
  }
});

/* =========================================================
   SESIONES
========================================================= */

router.get("/login", function (req, res) {
  res.render("login", {
    layout: "main",
    tituloPagina: "Login"
  });
});

router.get("/register", function (req, res) {
  res.render("register", {
    layout: "main",
    tituloPagina: "Registro"
  });
});

router.get("/reset-password/:token", function (req, res) {
  res.render("resetPassword", {
    layout: "main",
    tituloPagina: "Reset Password",
    token: req.params.token
  });
});

export default router;