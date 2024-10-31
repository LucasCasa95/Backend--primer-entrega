import cartService from "../services/cart.service.js";
import mongoose from "mongoose";

class CartController {
    async create(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.status(201).send(newCart);
        } catch (error) {
            res.status(500).send("Error al crear el carrito: " + error.message);
        }
    }

    async getCarts(req, res) {
        try {
            const cart = await cartService.getCarts();
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).send("Error al obtener los productos");
        }
    }

    async getCartById(req, res) {
        const { cid } = req.params;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("Carrito no encontrado");
            res.send(cart);
        } catch (error) {
            res.status(500).send("Error al leer el carrito: " + error.message);
        }
    }

    async addProductToCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("Carrito no encontrado");

            const existProduct = cart.products.find(item => item.productId.toString() === pid);
            if (existProduct) {
                existProduct.quantity += quantity;
            } else {
                cart.products.push({ productId: pid, quantity });
            }
            await cartService.updateCart(cid, cart);
            res.status(200).send("Producto agregado/actualizado con éxito");
        } catch (error) {
            res.status(500).send("Error al agregar productos: " + error.message);
        }
    }

    async updateCart(req, res) {
        try {
            const cartId = req.params.cid;
            const { products } = req.body;
            const updatedProducts = products.map(product => ({
                productId: new mongoose.Types.ObjectId(product.productId),
                quantity: product.quantity
            }));

            const updatedCart = await cartService.updateCart(cartId, { products: updatedProducts });

            if (updatedCart) {
                res.status(200).json(updatedCart);
            } else {
                res.status(404).send("Carrito no encontrado");
            }
        } catch (error) {
            res.status(500).send("Error al obtener el carrito: " + error.message);
        }
    }

    async deleteCartProduct(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;

            const product = await cartService.deleteCartProductById(cartId, productId);

            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).send("No se pudo borrar el producto");
            }
        } catch (error) {
            res.status(500).send("No se pudo borrar el producto, Error al obtener el carrito: " + error.message);
        }
    }

    async emptyCart(req, res) {
        try {
            const cartId = req.params.cid;
            const result = await cartService.emptyCartById(cartId);

            if (result) {
                res.status(200).send("El carrito ha sido vaciado");
            } else {
                res.status(404).send("No se pudo vaciar el carrito, Carrito no encontrado");
            }
        } catch (error) {
            res.status(500).send("No se pudo vaciar el carrito: " + error.message);
        }
    }
}

export default CartController;
