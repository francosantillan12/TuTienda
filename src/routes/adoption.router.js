import { Router } from "express";

const router = Router();

// Simulación en memoria (simple para testing)
let adopciones = [];

// GET → listar adopciones
router.get("/", (req, res) => {
  res.json(adopciones);
});

// POST → crear adopción
router.post("/", (req, res) => {
  const { usuario, producto } = req.body;

  if (!usuario || !producto) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const nuevaAdopcion = {
    id: Date.now(),
    usuario,
    producto
  };

  adopciones.push(nuevaAdopcion);

  res.status(201).json(nuevaAdopcion);
});

export default router;