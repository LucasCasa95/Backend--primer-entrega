import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";
import mongoose from "mongoose";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

import {soloAdmin, soloUser} from "../middleware/auth.js"
import passport from "passport"

//Ruta /products que me muestra el listado actual de mis productos. Utilizando express-handlebars.

router.get("/products", passport.authenticate("current", {session:false}), soloUser, async (req, res) => {
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


router.get("/login", (req, res) => {
    res.render("login"); 
})

router.get("/register", (req, res) => {
    res.render("register"); 
})

router.get("/realtimeproducts", passport.authenticate("current", {session:false}), soloAdmin, (req, res) => {
    res.render("realtimeproducts")
})

export default router;