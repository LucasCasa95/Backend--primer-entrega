const express = require("express")
const productRouter = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")
const app = express()
const PUERTO = 8080

//Middleware:
app.use(express.json())
//Le decimos al servidor que vamos a trabajar con JSON

//Rutas:
app.use("/api/products", productRouter)
app.use("/api/carts", cartsRouter)

app.listen(PUERTO, () =>{
    console.log(`Escuchando en el http://localhost:${PUERTO}`)
})