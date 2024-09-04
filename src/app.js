const express = require("express")
const exphbs = require("express-handlebars");
const socket = require("socket.io")
const productRouter = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")
const viewsRouter = require("./routes/views.router.js")
const app = express()
const PUERTO = 8080
require("./database.js")

//Middleware:
app.use(express.json())
app.use(express.urlencoded({extended: true})); 
app.use(express.static("./src/public")); 
//Le decimos al servidor que vamos a trabajar con JSON

//Configuramos Express-Handlebar
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas:
app.use("/api/products", productRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)

const httpServer = app.listen(PUERTO, () =>{
    console.log(`Escuchando en el http://localhost:${PUERTO}`)
})

const ProductManager = require("./dao/db/product-manager-db.js")
const manager = new ProductManager()

const io = socket(httpServer)

io.on("connection", async (socket) =>{
    //Se envia el array de productos a la vista realtimeproducts
    socket.emit("productos", await manager.getProducts())
    //Con un evento y el metodo "on" se escucha desde el main.js y se muestra en pantalla
    socket.on("createProduct",  async (data) => {
        //console.log("Recibiendo producto:", data)
        await manager.addProduct(data);
        io.emit("productos",  await manager.getProducts()); 
    });

    //Se recibe el evento "eliminarProducto" desde el cliente y se borra con el metodo deleteProduct
    socket.on("eliminarProducto", async (id) => {
        await manager.deleteProduct(id)
        //Despues de eliminarlo se le envian los productos actualizados al cliente
        io.emit("productos", await manager.getProducts())
    })
})