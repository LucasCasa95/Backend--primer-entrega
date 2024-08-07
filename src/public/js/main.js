//Instancia de Socket.io
const socket = io()

//Escuchar el evento "productos" y recibir ese array de datos:
socket.on("productos", (data) => {
    renderProductos(data)
})

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos")
    contenedorProductos.innerHTML = ""

    productos.forEach(item => {
        const card = document.createElement("div")
        card.innerHTML = `<p> ${item.id} </p>
                          <p> ${item.title} </p>
                          <p> ${item.price} </p>
                          <button> Eliminar </button>`
        
        contenedorProductos.appendChild(card)

        card.querySelector("button").addEventListener("click", ()=>{
            eliminarProducto(item.id)
        })
    });
}

//funcion para enviar el id al backend
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id)
}

//Vincular ese formulario en el idFormulario a alguna constante, tomar su value y enviarlo por websockets al backedn por medio de un evento