import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";
import mongoose from "mongoose";

const router = express.Router();
const cartManager = new CartManager();


router.get('/', async (req, res) => {
    try {
        const carritos = await cartManager.getCarts();
        res.status(200).json(carritos);
 
    } catch (error) {
        res.status(500).send("Error al obtener los productos");
    }
});

//Ruta post que cree un carrito nuevo.

router.post("/", async (req, res) =>{
    try {
        const nuevoCarrito = await cartManager.crearCarrito()
        res.json(nuevoCarrito)
    } catch (error) {
        res.status(500).send("Error del servidor")
    }
})

//Listamos los productos de determinado carrito

router.get("/:cid", async (req, res) => {
    try {
        const carritoId = new mongoose.Types.ObjectId(req.params.cid)
        const carrito = await cartManager.getCartById(carritoId)
        res.json(carrito.products)
    } catch (error) {
        res.status(500).send("Error al obtener los productos del carrito")
    }
})

// Agregar productos al carrito
router.post("/:cid/product/:pid", async (req, res) =>{
    let carritoId = req.params.cid
    let productoId = req.params.pid
    let quantity = req.body.quantity || 1

    try {
        const actualizado = await cartManager.addProductToCart(carritoId, productoId, quantity)
        res.json(actualizado.products)
    } catch (error) {
        res.status(500).send("Error al agregar productos")
    }
})

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