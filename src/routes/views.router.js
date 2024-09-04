const express = require("express")
const router = express.Router()
const ProductManager = require("../dao/db/product-manager-db.js")
const productManager = new ProductManager()
const CartManager = require("../dao/db/cart-manager-db.js")
const cartManager = new CartManager
const mongoose = require("mongoose")

//Ruta /products que me muestra el listado actual de mis productos. Utilizando express-handlebars.

router.get("/products", async (req, res) => {
    const productos = await productManager.getProducts()
    res.render("home", {productos})
})

//Punto dos. Mostrar los productos en tiempo real
//Con formulario para agregar y boton de eliminar

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts")
})

module.exports = router