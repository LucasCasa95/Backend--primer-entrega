const socket = io();

// Escuchar el evento "productos" y recibir ese array de datos
socket.on("productos", (data) => {
    renderProductos(data);
});

// Función para renderizar productos
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.innerHTML = `<p>${item._id}</p>
                          <p>${item.title}</p>
                          <p>${item.price}</p>
                          <button>Eliminar</button>`;
        
        contenedorProductos.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item._id);
        });
    });
};

// Función para enviar el id al backend
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
};

// Escuchar el evento de envío del formulario
document.getElementById("addForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Previene que el formulario se envíe y recargue la página

    // Obtener valores de los campos del formulario
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const price = parseFloat(document.getElementById('price').value); // Asegúrate de que sea un número
    const stock = parseInt(document.getElementById('stock').value); // Asegúrate de que sea un número
    const category = document.getElementById('category').value
    const thumbnail = document.getElementById('thumbnail').value || "sin imagen"

    const product = {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail, 
    };

    // Emitir el evento para crear el producto
    socket.emit("createProduct", product);
    document.getElementById("addForm").reset(); // Reiniciar el formulario
});

//Vincular ese formulario en el idFormulario a alguna constante, tomar su value y enviarlo por websockets al backend por medio de un evento