const express = require("express")
const router = express.Router()
const ProductManager = require("../dao/db/product-manager-db.js")
const productManager = new ProductManager()
const CartManager = require("../dao/db/cart-manager-db.js")
const cartManager = new CartManager
const mongoose = require("mongoose")

//Ruta /products que me muestra el listado actual de mis productos. Utilizando express-handlebars.

router.get("/products", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10
        const sort = req.query.sort
        const category = req.query.category
        const status = req.query.status
        const page = parseInt(req.query.page) || 1

        const filters = {
            sort,
            category,
            status,
            page,
            limit
        }
        const arrayProductos = await productManager.getProducts(filters)
        const newArrayProductos = arrayProductos.docs.map(product => {
            const {...rest} = product.toObject()
            return rest})

            res.render("home", {
                productos: newArrayProductos,
                hasPrevPage: arrayProductos.hasPrevPage,
                hasNextPage: arrayProductos.hasNextPage, 
                prevPage: arrayProductos.prevPage, 
                nextPage: arrayProductos.nextPage, 
                currentPage: arrayProductos.page, 
                totalPages: arrayProductos.totalPages
            })
    } catch (error) {
        res.status(500).send(`Error al obtener los productos`)
    }
})

//Punto dos. Mostrar los productos en tiempo real
//Con formulario para agregar y boton de eliminar

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts")
})

module.exports = router