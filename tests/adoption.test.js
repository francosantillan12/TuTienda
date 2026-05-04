import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";

describe("Adoption Router", () => {
  beforeAll(async () => {
    await mongoose.connection.asPromise();
  });
//post con datos incompletos
  it("GET /api/adoption → debe devolver un array", async () => {
    const response = await request(app).get("/api/adoption");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
//post para crear una adopcion
  it("POST /api/adoption → debe crear una adopción", async () => {
    const nuevaAdopcion = {
      usuario: "fran",
      producto: "harina de trigo"
    };
  
    const response = await request(app)
      .post("/api/adoption")
      .send(nuevaAdopcion);
  
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.usuario).toBe("fran");
    expect(response.body.producto).toBe("harina de trigo");
  });

//get para obtener una adopcion
it("POST /api/adoption → debe devolver 400 si faltan datos", async () => {
  const response = await request(app)
    .post("/api/adoption")
    .send({});

  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty("error", "Datos incompletos");
});

//flujo completo de adopcion
it("flujo completo → crear adopción y luego obtenerla", async () => {
  const nuevaAdopcion = {
    usuario: "testUser",
    producto: "productoTest"
  };

  // crear
  await request(app)
    .post("/api/adoption")
    .send(nuevaAdopcion);

  // obtener
  const response = await request(app).get("/api/adoption");

  expect(response.statusCode).toBe(200);

  const existe = response.body.some(
    (a) =>
      a.usuario === "testUser" &&
      a.producto === "productoTest"
  );

  expect(existe).toBe(true);
});
//cierra la conexion con mongoose al final de los tests
  afterAll(async () => {
    await mongoose.connection.close();
  });
});