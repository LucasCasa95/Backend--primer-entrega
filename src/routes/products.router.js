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

// //Actualizar producto por id
// router.put("/:pid", async (req, res) => {
//     const id = req.params.pid
//     const productoActualizado = req.body
//     try {
//         await manager.updateProduct(id, productoActualizado)
//         res.send({status: "success", message: "Producto actualizado"})
//     } catch (error) {
//         res.status(404).send({status: "error", message: "Producto no encontrado"})
//     }
// })


// //Borrar producto por id
// router.delete("/:pid", async (req, res) => {
//     const id = req.params.pid
//     //console.log(`ID recibido: ${id}`);
//     try {
//         const productoEliminado = await manager.deleteProduct(id)
//         //console.log(`Resultado de deleteProduct: ${productoEliminado}`);
//         if(!productoEliminado){
//             res.status(404).send({message:"Producto no encontrado"})
//             return
//         }else{
//             res.send({message:"Producto eliminado exitosamente"})
//         }
//         } catch (error) {
//             res.status(500).send({message:"Error al buscar ese ID en los productos"})
//         }
// })

export default router