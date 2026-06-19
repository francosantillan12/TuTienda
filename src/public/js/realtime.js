// Cliente Socket.io: conexión básica
const socket = io();

socket.on("connect", function () {
  console.log("🟢 Conectado por websockets. ID:", socket.id);
});

console.log("✅ realtime.js cargado correctamente");

function activarClicksProductos() {

  const items = document.querySelectorAll(".producto-admin");

  items.forEach(function (item) {

    item.addEventListener("click", function () {

      const formEditar = document.getElementById("form-editar");

      if (!formEditar) return;

      formEditar.elements["id"].value = item.dataset.id;
      formEditar.elements["titulo"].value = item.dataset.titulo;
      formEditar.elements["precio"].value = item.dataset.precio;
      formEditar.elements["stock"].value = item.dataset.stock;

    });

  });

  const botonesEliminar = document.querySelectorAll(".btn-eliminar");

  botonesEliminar.forEach(function (boton) {

    boton.addEventListener("click", function (e) {

      e.stopPropagation();

      const id = boton.dataset.id;

      const confirmar = confirm(
        "¿Seguro que querés eliminar este producto?"
      );

      if (!confirmar) return;

      socket.emit("eliminarProducto", id);

    });

  });

}

let productosCache = [];

socket.on("productosActuales", function (productos) {
  console.log("🟡 Lista recibida:", productos);

  productosCache = productos;

  const lista = document.getElementById("lista");
  if (!lista) return;

  if (!productos || productos.length === 0) {
    lista.innerHTML = "<li>No hay productos cargados.</li>";
    return;
  }

  lista.innerHTML = productos
  .map(function (p) {
    return `<li class="producto-admin"
    data-id="${p._id}"
    data-titulo="${p.titulo}"
    data-precio="${p.precio}"
    data-stock="${p.stock}">
    <strong>${p.titulo || p.title || "(sin título)"}</strong>
  
    <br>💰 Precio: $${p.precio || p.price}
    <br>📦 Stock: ${p.stock ?? "-"}
    <br>🏷️ Código: ${p.codigo || "-"}
  
    <br><small>ID: ${p._id}</small>
    <br><br>
<button class="btn-eliminar" data-id="${p._id}">
  🗑️ Eliminar
</button>
  </li>`;
  
  })
  .join("");

  activarClicksProductos();

});


// ---- Crear producto (cliente -> servidor)
(function () {
  var formCrear = document.getElementById("form-crear");
  if (!formCrear) return;

  formCrear.addEventListener("submit", function (e) {
    e.preventDefault();

    var datos = {
      title: formCrear.titulo.value.trim(),
      price: Number(formCrear.precio.value),
      stock: Number(formCrear.stock.value),
      category: formCrear.categoria.value.trim(),
      description: formCrear.description.value.trim(),
      code: formCrear.codigo.value.trim(),
      imagen: formCrear.imagen.value.trim()
    };
    
    if (!datos.title || isNaN(datos.price) || isNaN(datos.stock)) {
      console.log("⚠️ Datos inválidos", datos);
      return;
    }
    

    console.log("📤 Enviando crearProducto:", datos);
    socket.emit("crearProducto", datos);
    formCrear.reset();
  });
})();

// ---- Editar producto (cliente -> servidor)
(function () {
  var formEditar = document.getElementById("form-editar");
  if (!formEditar) return;

  formEditar.addEventListener("submit", function (e) {
    e.preventDefault();

    var datos = {
      id: formEditar.elements["id"].value.trim(),
      titulo: formEditar.elements["titulo"].value.trim(),
      precio: Number(formEditar.elements["precio"].value),
      stock: Number(formEditar.elements["stock"].value)
    };

    console.log("📤 Enviando editarProducto:", datos);

    socket.emit("editarProducto", datos);

    formEditar.reset();
  });
})(); 
  // ---- Buscador de productos
(function () {

  const buscador = document.getElementById("buscador");

  if (!buscador) return;

  buscador.addEventListener("input", function () {

    const texto = buscador.value.toLowerCase();

    const lista = document.getElementById("lista");

    const productosFiltrados = productosCache.filter(function (p) {

      const titulo = (p.titulo || "").toLowerCase();
      const codigo = (p.codigo || "").toLowerCase();

      return titulo.includes(texto) || codigo.includes(texto);

    });

    lista.innerHTML = productosFiltrados
      .map(function (p) {
        return `<li class="producto-admin"
  data-id="${p._id}"
  data-precio="${p.precio}"
  data-stock="${p.stock}">

  <strong>${p.titulo || "(sin título)"}</strong>

  <br>💰 Precio: $${p.precio}
  <br>📦 Stock: ${p.stock}
  <br>🏷️ Código: ${p.codigo || "-"}

  <br><small>ID: ${p._id}</small>

</li>`;
      })
      .join("");

  activarClicksProductos();
  });

})();



