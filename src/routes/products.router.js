import express from "express";
const router = express.Router();

//Importamos el controlador:
import ProductController from "../controllers/product.controller.js";
const controller = new ProductController()


//Listar todos los productos:
router.get("/", controller.getProducts)
//Buscar producto por ID:
router.get("/:pid", controller.getProductById)
//Agregar nuevo producto
router.post("/", controller.createProduct)
//Actualizar productos
router.put("/:pid", controller.updateProduct)
//Eliminar productos
router.delete("/:pid", controller.deleteProduct)



export default router