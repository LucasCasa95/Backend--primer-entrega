import express from "express";
const router = express.Router();
import mongoose from "mongoose";
//Importamos el controlador
import CartController from "../controllers/cart.controller.js"
const controller = new CartController()


// router.get('/', async (req, res) => {
//     try {
//         const carritos = await cartManager.getCarts();
//         res.status(200).json(carritos);
 
//     } catch (error) {
//         res.status(500).send("Error al obtener los productos");
//     }
// });

//Ruta post que cree un carrito nuevo.

router.post("/", controller.create)
//Listamos los productos de determinado carrito
router.get("/:cid",controller.getCart)
// Agregar productos al carrito
router.post("/:cid/product/:pid",controller.addProductToCart)

// Actualizar carrito con array de productos
router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { products } = req.body;
        const updatedProducts = products.map(product => ({
            productId: new mongoose.Types.ObjectId(product.productId),
            quantity: product.quantity
        }));
        
        const producto = await cartManager.updateCart(cartId,   { $set: { products: updatedProducts } } );
        console.log(updatedProducts);

        if (producto) {
            console.log(producto);
            res.status(200).json(producto);
        } else {
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al obtener el carrito");
    }
});


//Borrar los productos por id
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
     
        const producto = await cartManager.deleteCartProductById(cartId, productId);

        if (producto) {
            console.log(producto);
            res.status(200).json(producto);
        } else {
            res.status(404).send("No se pudo borrar el producto");
        }
    } catch (error) {
        res.status(500).send("No se pudo borrar el producto, Error al obtener el carrito");
    }
});

    // Vaciar carrito 
      router.delete('/:cid', async (req, res) => {
        try {
            const cartId = req.params.cid;
            const producto = await cartManager.emptyCartById(cartId);

            if (producto) {
                console.log(producto);
                res.status(200).json(producto);
            } else {
                res.status(404).send("No se pudo vaciar el carrito, Carrito no encontrado");
            }
        } catch (error) {
            res.status(500).send("No se pudo vaciar el carrito");
        }
    });





export default router