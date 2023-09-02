
class Producto {
  constructor(id, nombre, precio, cantidad, tipo, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
    this.tipo = tipo;
    this.imagen = imagen;
    this.agotado = false;
  };

  vender() {
    if (this.cantidad >= 1) {
      this.cantidad -= 1;
    } else {
      this.agotado = true;
      let agotado = `Que lastima! no tenemos más ${this.nombre} para ofrecerte. Por favor vuelve más tarde`
    };
  }

  reponer(cantidadAReponer) {
    this.cantidad = cantidadAReponer;
    this.agotado = false;
  }

};

const productos = () => {
  let productos = [];
  productos.push(new Producto(1, "Gin Beefeater", 7500, 20, "Gin Beefeater", "./images/bebidas/gin.png"));
  productos.push(new Producto(2, "Fernet Branca", 3500, 20, "Fernet Branca", "./images/bebidas/fernet.png"));
  productos.push(new Producto(3, "José Cuervo", 8000, 20, "José Cuervo", "./images/bebidas/tequila.png"));
  productos.push(new Producto(4, "Johnnie Walker - Blue Label", 12500, 20, "Johnnie Walker - Blue Label", "./images/bebidas/wisky-jw-blue.png"));
  productos.push(new Producto(5, "Johnnie Walker - Red Label", 9500, 20, "Johnnie Walker - Red Label", "./images/bebidas/wisky-jw-red.png"));
  productos.push(new Producto(6, "Vodka Absolut", 7000, 20, "Vodka Absolut", "./images/bebidas/vodka.png"));
  return productos;
};

let listaDeProductos = productos();
let pagProductos = document.getElementById("productos")
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let container = document.getElementById("container");
let pagCarritoDeCompras = document.getElementById("carritoDeCompras");
let contadorCarrito = document.getElementById("contadorCarrito");
contadorCarrito.innerHTML = "0";


const card = (item) => {
  let nombre = item.nombre.split(" ").join("");
  let div = document.createElement("div");
  div.setAttribute("id", `${nombre}-${item.id}`);
  div.className = "card-producto";
  div.innerHTML = `
    <img src="${item.imagen}" alt="${item.nombre}">
    <h2>${item.nombre}</h2>
    <p>Precio: $${item.precio}</p>
    <div>
      <input type="number" name="cantidadCompra-${nombre}-${item.id}" id="cantidadCompra-${nombre}-${item.id}" min="1" max="10" value="1">
      <button type="button" id="btn-${nombre}-${item.id}"> + </button>
    </div>
  `;
  container.append(div);
  let botonAgregarCarrito = document.getElementById(`btn-${nombre}-${item.id}`);
  let cantidadCompra = document.getElementById(`cantidadCompra-${nombre}-${item.id}`)
  const agregadoAlCarrito = () => {
    for (let i = 1; i <= cantidadCompra.value; i++) {
      carrito.push(item)
      localStorage.setItem("carrito", JSON.stringify(carrito))
      contadorCarrito.innerHTML = carrito.length;
    }
  }
  botonAgregarCarrito.addEventListener("click", agregadoAlCarrito);
}

const mostrarTodosLosProductos = (productos) => {
  container.innerHTML = "";
  let titulo = document.createElement("h1")
  titulo.innerHTML = "";
  container.append(titulo);
  productos.forEach((item) => {
    card(item);
  });
}

const filtroDeProductos = (productos) => {
  let botonBuscador = document.getElementById("botonBuscador");
  let inputBuscador = document.getElementById("inputBuscador");


  const filtrar = () => {
    container.innerHTML = ""

    let filtro = productos.filter(item =>
      Object.values(item).some(value => typeof value === "string" && value.toLowerCase().includes(inputBuscador.value.toLowerCase()))
    );
    if (filtro.length > 0) {
      filtro.forEach((item) => {
        card(item);
      });
    } else {
      let div = document.createElement("div");
      div.className = "noProducto";
      div.innerHTML = `<h2>Oops! El producto ${inputBuscador.value} no se encuentra disponible.</h2>`;
      container.append(div);
    }
  }

  botonBuscador.addEventListener("click", filtrar)
  inputBuscador.addEventListener("keyup", () => {
    if (event.key === "Enter") {
      filtrar();
    }
  })
}

const carritoCompras = () => {
  container.innerHTML = "";
  let titulo = document.createElement("h1")
  titulo.innerHTML = "Carrito De Compras";
  container.append(titulo);
  let productosEnCarrito = {};
  let total = 0;

  const mostrarProductoEnCarrito = (item) => {
    if (!productosEnCarrito[item.id]) {
      productosEnCarrito[item.id] = {
        producto: item,
        cantidad: 1,
        subtotal: item.precio,
      };
    } else {
      productosEnCarrito[item.id].cantidad++;
      productosEnCarrito[item.id].subtotal += item.precio;
    }
  };

  carrito.forEach((item) => {
    mostrarProductoEnCarrito(item);
  });

  for (let id in productosEnCarrito) {
    let productoEnCarrito = productosEnCarrito[id];
    let div = document.createElement("div");
    div.className = "card-carrito";
    div.innerHTML = `
      <img src="${productoEnCarrito.producto.imagen}" alt="${productoEnCarrito.producto.nombre}">
      <h2>${productoEnCarrito.producto.nombre}</h2>
      <p>Cantidad: ${productoEnCarrito.cantidad}</p>
      <p>Subtotal: $${productoEnCarrito.subtotal}</p>
    `;
    container.append(div);
    total += productoEnCarrito.subtotal;
  }

  if (carrito.length > 0) {
    let divTotal = document.createElement("div");
    divTotal.className = "total-carrito";
    divTotal.innerHTML = `
    <h2>Total: $${total}</h2>
  `;
    container.append(divTotal);

    let divBotonesCarrito = document.createElement("div");
    divBotonesCarrito.className = "btn-carrito";
    divBotonesCarrito.innerHTML = `
  <button class="finalizarCompra" id="btn-finalizarCompra">Finalizar la compra</button>
  <button class="eliminarCarrito" id="btn-eliminarCarrito">Eliminar Carrito</button>`
    container.append(divBotonesCarrito);

    let finalizarCompra = document.getElementById("btn-finalizarCompra");
    let eliminarCarrito = document.getElementById("btn-eliminarCarrito")

    finalizarCompra.addEventListener("click", () => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Gracias por su compra. En breve recibira con mail con la confirmacion',
        showConfirmButton: true,
        timer: 5000,
        color: 'rgb(193, 176, 162)',
        customClass: {
          confirmButton: 'btn-confirmacion',
        }
      })
    });

    eliminarCarrito.addEventListener("click", () => {
      Swal.fire({
        title: '',
        text: "¿Seguro que deseas vaciar el carrito?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(193, 176, 162)',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, vaciar carrito '
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("carrito")
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Su carrito ha sido vaciado con exito.',
            timer: 5000,
            showConfirmButton: true,
            color: 'rgb(193, 176, 162)',
            customClass: {
              confirmButton: 'btn-confirmacion',
            }
          })
          location.reload()
        }
      })
    })
  } else {
    container.innerHTML = `
        <h1>Carrito de compras</h1>`;
  }
}

const iniciarPagina = () => {
  pagProductos.addEventListener("click", () =>  mostrarTodosLosProductos(listaDeProductos));
  filtroDeProductos(listaDeProductos);
  pagCarritoDeCompras.addEventListener("click", carritoCompras)

}

iniciarPagina();