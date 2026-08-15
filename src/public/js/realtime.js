// Cliente Socket.io: conexión básica
const socket = io();

socket.on("connect", function () {
  console.log("🟢 Conectado por websockets. ID:", socket.id);
});

console.log("✅ realtime.js cargado correctamente");


// ===================================
// CLICS DE PRODUCTOS
// ===================================

function activarClicksProductos() {

  const items = document.querySelectorAll(".producto-admin");

  items.forEach(function (item) {

    item.addEventListener("click", function () {

      const formEditar = document.getElementById("form-editar");

      if (!formEditar) return;

      formEditar.elements["id"].value =
        item.dataset.id;

      formEditar.elements["titulo"].value =
        item.dataset.titulo;

      formEditar.elements["precio"].value =
        item.dataset.precio;

      formEditar.elements["stock"].value =
        item.dataset.stock;

      formEditar.elements["fechaVencimiento"].value =
        item.dataset.fechaVencimiento || "";

    });

  });


  // ===================================
  // ELIMINAR PRODUCTO
  // ===================================

  const botonesEliminar =
    document.querySelectorAll(".btn-eliminar");

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


// ===================================
// CACHE DE PRODUCTOS
// ===================================

let productosCache = [];


// ===================================
// RENDERIZAR PRODUCTOS
// ===================================

function renderizarProductos(productos) {

  const lista = document.getElementById("lista");

  if (!lista) return;


  if (!productos || productos.length === 0) {

    lista.innerHTML = `
      <li class="sin-productos">
        No hay productos cargados.
      </li>
    `;

    return;

  }


  lista.innerHTML = productos.map(function (p) {

    const titulo =
      p.titulo ||
      p.title ||
      "(sin título)";


    const precio =
      p.precio ??
      p.price ??
      0;


    const stock =
      p.stock ??
      "-";


    const vencimiento =
      p.fechaVencimiento
        ? new Date(
            p.fechaVencimiento
          ).toLocaleDateString("es-AR")
        : "-";


    const codigo =
      p.codigo ||
      p.code ||
      "-";


    return `

      <li
        class="producto-admin"

        data-id="${p._id}"

        data-titulo="${titulo}"

        data-precio="${precio}"

        data-stock="${stock}"

        data-fecha-vencimiento="${p.fechaVencimiento || ""}"
      >

        <div class="producto-col producto-nombre">

          <strong>
            ${titulo}
          </strong>

        </div>


        <div class="producto-col producto-precio">

          <span class="producto-label">
            💰 Precio
          </span>

          <strong>
            $${precio}
          </strong>

        </div>


        <div class="producto-col producto-stock">

          <span class="producto-label">
            📦 Stock
          </span>

          <strong>
            ${stock}
          </strong>

        </div>


        <div class="producto-col producto-vencimiento">

          <span class="producto-label">
            📅 Vencimiento
          </span>

          <span>
            ${vencimiento}
          </span>

        </div>


        <div class="producto-col producto-codigo">

          <span class="producto-label">
            🏷️ Código
          </span>

          <span>
            ${codigo}
          </span>

        </div>


        <div class="producto-col producto-id">

          <span class="producto-label">
            ID
          </span>

          <small>
            ${p._id}
          </small>

        </div>

        <div class="producto-col producto-accion">

  <button
    class="btn-eliminar"
    data-id="${p._id}"
    type="button"
    title="Eliminar producto"
  >
    🗑️ Eliminar
  </button>

</div>    
        

      </li>

    `;

  }).join("");


  activarClicksProductos();

}


// ===================================
// PRODUCTOS ACTUALES
// ===================================

socket.on("productosActuales", function (productos) {

  console.log("🟡 Lista recibida:", productos);

  productosCache = productos;

  renderizarProductos(productos);

});


// ===================================
// CREAR PRODUCTO
// ===================================

(function () {

  var formCrear =
    document.getElementById("form-crear");

  if (!formCrear) return;


  formCrear.addEventListener(
    "submit",
    function (e) {

      e.preventDefault();


      var datos = {

        title:
          formCrear.titulo.value.trim(),

        price:
          Number(formCrear.precio.value),

        stock:
          Number(formCrear.stock.value),

        category:
          formCrear.categoria.value
            .trim()
            .toLowerCase(),

        description:
          formCrear.description.value.trim(),

        code:
          formCrear.codigo.value.trim(),

        imagen:
          formCrear.imagen.value.trim(),

        fechaVencimiento:
          formCrear.fechaVencimiento.value

      };


      if (!datos.title) {

        alert(
          "Debés ingresar un nombre para el producto."
        );

        return;

      }


      if (!datos.category) {

        alert(
          "Debés ingresar una categoría."
        );

        return;

      }


      if (!datos.code) {

        alert(
          "Debés ingresar un código."
        );

        return;

      }


      if (
        isNaN(datos.price) ||
        datos.price <= 0
      ) {

        alert(
          "El precio debe ser mayor a 0."
        );

        return;

      }


      if (
        isNaN(datos.stock) ||
        datos.stock < 0
      ) {

        alert(
          "El stock no puede ser negativo."
        );

        return;

      }


      console.log(
        "📤 Enviando crearProducto:",
        datos
      );

      socket.emit(
        "crearProducto",
        datos
      );

      formCrear.reset();

    }
  );

})();


// ===================================
// EDITAR PRODUCTO
// ===================================

(function () {

  var formEditar =
    document.getElementById("form-editar");

  if (!formEditar) return;


  formEditar.addEventListener(
    "submit",
    function (e) {

      e.preventDefault();


      var datos = {

        id:
          formEditar.elements["id"]
            .value
            .trim(),

        titulo:
          formEditar.elements["titulo"]
            .value
            .trim(),

        precio:
          Number(
            formEditar.elements["precio"].value
          ),

        stock:
          Number(
            formEditar.elements["stock"].value
          ),

        fechaVencimiento:
          formEditar.elements[
            "fechaVencimiento"
          ].value

      };


      console.log(
        "📤 Enviando editarProducto:",
        datos
      );

      socket.emit(
        "editarProducto",
        datos
      );

      formEditar.reset();

    }
  );

})();


// ===================================
// BUSCADOR DE PRODUCTOS
// ===================================

(function () {

  const buscador =
    document.getElementById("buscador");

  if (!buscador) return;


  buscador.addEventListener(
    "input",
    function () {

      const texto =
        buscador.value
          .toLowerCase()
          .trim();


      const productosFiltrados =
        productosCache.filter(function (p) {

          const titulo =
            (
              p.titulo ||
              p.title ||
              ""
            ).toLowerCase();


          const codigo =
            (
              p.codigo ||
              p.code ||
              ""
            ).toLowerCase();


          return (
            titulo.includes(texto) ||
            codigo.includes(texto)
          );

        });


      renderizarProductos(
        productosFiltrados
      );

    }
  );

})();