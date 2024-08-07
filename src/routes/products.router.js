const express = require("express")
const ProductManager = require("../manager/product-manager.js")
const manager = new ProductManager("./src/data/productos.json")
const router = express.Router()

//Listar todos los productos:

router.get("/", async (req, res) =>{
    //Ejemplo del limit: http://localhost:8080/api/products?limit=5
    const limit = parseInt(req.query.limit)
    try {
    const arrayProductos = await manager.getProducts()
    if (limit) {
        res.send(arrayProductos.slice(0, limit))
    }else{
        res.send(arrayProductos)
    }
    } catch (error) {
        res.status(500).send("Error interno del servidor")
    }
})

//Buscar producto por ID:
router.get("/:pid", async (req, res) =>{
    let id = req.params.pid
    try {
    const producto = await manager.getProductById(parseInt(id))
    if(!producto){
        res.send("Producto no encontrado")
    }else{
        res.send(producto)
    }
    } catch (error) {
        res.send("Error al buscar ese ID en los productos")
    }

})

//Agregar nuevo producto
router.post("/", async (req, res) =>{
    const nuevoProducto = req.body
    try {
        await manager.addProduct(nuevoProducto)
        res.status(201).send("Producto agregado exitosamente")
    } catch (error) {
        res.status(500).json({status: "error", message: error.message})
    }
})

//Actualizar producto por id
router.put("/:pid", async (req, res) => {
    const id =req.params.pid
    const productoActualizado = req.body
    try {
        await manager.updateProduct(parseInt(id), productoActualizado)
        res.send({status: "success", message: "Producto actualizado"})
    } catch (error) {
        res.status(404).send({status: "error", message: "Producto no encontrado"})
    }
})


//Borrar producto por id
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid
    //console.log(`ID recibido: ${id}`);
    try {
        const productoEliminado = await manager.deleteProduct(parseInt(id))
        //console.log(`Resultado de deleteProduct: ${productoEliminado}`);
        if(!productoEliminado){
            res.status(404).send({message:"Producto no encontrado"})
            return
        }else{
            res.send({message:"Producto eliminado exitosamente"})
        }
        } catch (error) {
            res.status(500).send({message:"Error al buscar ese ID en los productos"})
        }
})

module.exports = router