import { authJwt } from "../middlewares/authJwt.js";
import { soloAdmin } from "../middlewares/soloAdmin.js";

import { Router } from "express";
import UsersService from "../services/users.service.js";

const router = Router();
const usersService = new UsersService();

router.use(authJwt, soloAdmin);

// GET /api/users → listar usuarios (sin password)
router.get("/", function (req, res) {
  usersService.getAll()
    .then(function (usuarios) {
      res.send({
        status: "ok",
        usuarios: usuarios
      });
    })
    .catch(function (error) {
      console.log("Error GET /api/users:", error);
      res.status(error.statusCode || 500).send({ error: error.message || "Error del servidor" });
    });
});

// GET /api/users/:uid → traer un usuario
router.get("/:uid", function (req, res) {
  const { uid } = req.params;

  usersService.getById(uid)
    .then(function (usuario) {
      if (!usuario) {
        return res.status(404).send({ error: "Usuario no encontrado" });
      }

      res.send({
        status: "ok",
        usuario: usuario
      });
    })
    .catch(function (error) {
      console.log("Error GET /api/users/:uid:", error);
      res.status(error.statusCode || 500).send({ error: error.message || "Error del servidor" });
    });
});

// PUT /api/users/:uid → actualizar usuario (sin password)
router.put("/:uid", function (req, res) {
  const { uid } = req.params;

  usersService.update(uid, req.body)
    .then(function (usuarioActualizado) {
      if (!usuarioActualizado) {
        return res.status(404).send({ error: "Usuario no encontrado" });
      }

      res.send({
        status: "ok",
        usuario: usuarioActualizado
      });
    })
    .catch(function (error) {
      console.log("Error PUT /api/users/:uid:", error);
      res.status(error.statusCode || 500).send({ error: error.message || "Error del servidor" });
    });
});

// DELETE /api/users/:uid → eliminar usuario
router.delete("/:uid", function (req, res) {
  const { uid } = req.params;

  usersService.delete(uid)
    .then(function (usuarioEliminado) {
      if (!usuarioEliminado) {
        return res.status(404).send({ error: "Usuario no encontrado" });
      }

      res.send({
        status: "ok",
        message: "Usuario eliminado"
      });
    })
    .catch(function (error) {
      console.log("Error DELETE /api/users/:uid:", error);
      res.status(error.statusCode || 500).send({ error: error.message || "Error del servidor" });
    });
});

export default router;
