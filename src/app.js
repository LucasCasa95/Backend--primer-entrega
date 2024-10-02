import express from "express";
import exphbs from "express-handlebars";
import { Server as socket } from "socket.io";
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import userRouter from "./routes/user.router.js"
import userViews from "./routes/userviews.router.js"
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js"
import "./database.js";

const app = express();
const PUERTO = 8080;


//Middleware:
app.use(express.json())
app.use(express.urlencoded({extended: true})); 
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(passport.initialize()); 
initializePassport()
//Le decimos al servidor que vamos a trabajar con JSON

//Configuramos Express-Handlebar
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas:
app.use("/api/products", productRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)
app.use("/", userViews)
app.use("/api/sessions", userRouter)

const httpServer = app.listen(PUERTO, () =>{
    console.log(`Escuchando en el http://localhost:${PUERTO}`)
})

import ProductManager from "./dao/db/product-manager-db.js"
const manager = new ProductManager()

const io = new socket(httpServer)

io.on("connection", async (socket) =>{
    //Se envia el array de productos a la vista realtimeproducts
    socket.emit("productos", await manager.getProducts())
    //Con un evento y el metodo "on" se escucha desde el main.js y se muestra en pantalla
    socket.on("createProduct",  async (data) => {
        //console.log("Recibiendo producto:", data)
        await manager.addProduct(data);
        //console.log("producto agregado con exito")
        io.emit("productos",  await manager.getProducts()); 
    });

    //Se recibe el evento "eliminarProducto" desde el cliente y se borra con el metodo deleteProduct
    socket.on("eliminarProducto", async (id) => {
        await manager.deleteProduct(id)
        //Despues de eliminarlo se le envian los productos actualizados al cliente
        io.emit("productos", await manager.getProducts())
    })
})