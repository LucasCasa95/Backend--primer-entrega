import {cartService} from "../services/index.js"

class CartController {
    async create(req, res) {
        try {
            const newCart = await cartService.createCart()
            res.status(201).send(newCart)
        } catch (error) {
            res.status(500).send("Error al crear el carrito")
        }
    }
    async getCart(req, res) {
        const {cid} = req.params
        try {
            const cart = await cartService.getCartById(cid)
            if(!cart) return res.status(404).send("Carrito no encontrado")
                res.send(cart)
        } catch (error) {
            res.status(500).send("Error al leer el carrito")
        }
    }
    async addProductToCart(req, res) {
        const {cid, pid} = req.params
        const {quantity} = req.body
        try {
            const cart = await cartService.getCartById(cid)
            if(!cart) return res.status(404).send("Carrito no encontrado")
            const existProduct = cart.products.find(item => item.productId.toString() === pid)
            if(existProduct) {
                existProduct.quantity += quantity
            }else {
                cart.products.push({productId: pid, quantity})
            }
            await cartService.updateCart(cid, cart)
            res.send(cart)
        } catch (error) {
            res.status(500).send("Error al agregar productos")
        }
    }
    //Agregar Actualizar y Eliminar
}

export default CartController