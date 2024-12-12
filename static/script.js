const formAgregar = document.getElementById("form-agregar");
const productosTbody = document.getElementById("productos");

function cargarProductos() {
  fetch("/api/productos")
    .then((response) => response.json())
    .then((productos) => {
      productosTbody.innerHTML = "";
      for (const [nombre, detalles] of Object.entries(productos)) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${nombre}</td>
          <td>${detalles.cantidad}</td>
          <td>$${detalles.precio.toFixed(2)}</td>
          <td>
            <button onclick="eliminarProducto('${nombre}')">Eliminar</button>
          </td>
        `;
        productosTbody.appendChild(fila);
      }
    });
}

formAgregar.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const precio = parseFloat(document.getElementById("precio").value);

  fetch("/api/productos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, cantidad, precio }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          alert(error.error);
          throw new Error(error.error);
        });
      }
      return response.json();
    })
    .then(() => {
      cargarProductos();
      formAgregar.reset();
    });
});

function eliminarProducto(nombre) {
  fetch(`/api/productos/${nombre}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => alert(error.error));
      }
      return response.json();
    })
    .then(() => cargarProductos());
}

document.addEventListener("DOMContentLoaded", cargarProductos);
