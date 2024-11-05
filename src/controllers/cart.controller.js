import cartService from "../services/cart.service.js";
import productService from "../services/product.service.js";
import UsuarioModel from "../dao/models/user.model.js";
import TicketModel from "../dao/models/ticket.model.js";
import { generateCode, calcularTotal} from "../utils/util.js";
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
        const quantityToAdd = quantity || 1;
    
        try {
            const actualizado = await cartService.addProductToCart(cid, pid, quantityToAdd);
            res.json(actualizado.products);
        } catch (error) {
            console.error("Error en addProductToCart Controller:", error.message);
            res.status(500).send("Error al agregar productos: " + error.message);
        }
    }
    

    async updateCart(req, res) {
        try {
            const cartId = req.params.cid;
            const { products } = req.body;
    
            // Obtén el carrito existente
            const existingCart = await cartService.getCartById(cartId);
            if (!existingCart) {
                return res.status(404).send("Carrito no encontrado");
            }
    
            // Mapa de productos existentes en el carrito por productId
            const existingProductsMap = existingCart.products.reduce((acc, product) => {
                acc[product.productId.toString()] = product;
                return acc;
            }, {});
    
            // Actualiza o añade los productos
            products.forEach(product => {
                const productId = product.productId.toString();
                if (existingProductsMap[productId]) {
                    // Si el producto ya existe, reemplaza la cantidad
                    existingProductsMap[productId].quantity = product.quantity;
                } else {
                    existingCart.products.push({
                        productId: productId,
                        quantity: product.quantity
                    });
                }
            });
    
            // Actualiza el carrito en la base de datos
            await cartService.updateCart(cartId, existingCart);
            res.status(200).json(existingCart);
        } catch (error) {
            res.status(500).send("Error al actualizar el carrito: " + error.message);
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

    async finalizarCompra(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartService.getCartById(cartId);
            
            // Verifica si el carrito fue encontrado
            if (!cart) {
                return res.status(404).send("Carrito no encontrado");
            }
    
            const products = cart.products; // Aquí ya sabemos que cart no es undefined
            const productosNoDisponibles = [];
    
            for (const item of products) {
                const productoId = item.productId;
                const product = await productService.getProductById(productoId);
    
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    productosNoDisponibles.push(productoId);
                }
            }
    
            const userWithCart = await UsuarioModel.findOne({ cart: cartId });
            if (userWithCart) {
                console.log("Usuario encontrado:", userWithCart.email);
            } else {
                console.log("No se encontró usuario con ese carrito.");
            }
    
            const ticket = new TicketModel({
                code: generateCode(),
                purchase_datetime: new Date(),
                amount: await calcularTotal(cart.products),
                purchaser: userWithCart.email
            });
    
            await ticket.save();
    
            // Aquí se filtran los productos que no están disponibles
            cart.products = cart.products.filter(item =>
                productosNoDisponibles.some(productoId => productoId.equals(item.productId))
            );
    
            await cart.save();
    
            res.send({
                cliente: userWithCart.first_name,
                email: userWithCart.email,
                numTicket: ticket.code,
                noDisponible: productosNoDisponibles,
                cartFinal: cart.products
            });
        } catch (error) {
            console.error("Error al procesar la compra", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    
}

export default CartController;
