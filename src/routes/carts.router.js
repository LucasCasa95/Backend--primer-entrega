import express from "express";
const router = express.Router();
import mongoose from "mongoose";
//Importamos el controlador
import CartController from "../controllers/cart.controller.js"
const controller = new CartController()

//Ruta que muestra todos los carritos
router.get('/', controller.getCarts);
//Listamos los productos de determinado carrito
router.get("/:cid", controller.getCartById)

//Ruta post que cree un carrito nuevo.
router.post("/", controller.create)
// Agregar productos al carrito
router.post("/:cid/product/:pid", controller.addProductToCart)

//Actualizar carrito
router.put('/:cid', controller.updateCart);

//Borrar los productos por id
router.delete('/:cid/products/:pid', controller.deleteCartProduct);
// Vaciar carrito 
router.delete('/:cid', controller.emptyCart);





export default router