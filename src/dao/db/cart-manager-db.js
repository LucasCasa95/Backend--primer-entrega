const CartModel = require("../models/cart.model.js")

class CartManager{
    //Crear el carrito
    async crearCarrito(){
        try {
            const nuevoCarrito = new CartModel({products: []})
            await nuevoCarrito.save()
            return nuevoCarrito
        } catch (error) {
            console.log("Error al crear un carrito")
            return null
        }
    }

    //Retorne todos los carritos
    async getCarts() {
        try {
            
            const carrito = await CartModel.find().populate('products.productId');
            return carrito;
        } catch (error) {
            console.log("error al buscar los carritos");
            return null;
        }
   
    }

    //Retorne carrito por id
    async getCartById(cartId){
        try {
            const carrito = await CartModel.findById(cartId).populate("products.producId")
            if(!carrito) {
                console.log("No existe ese carrito que buscas")
                return null
            }
            return carrito
        } catch (error) {
            console.log("Error al obtener el carrito por id")
        }
    }

    //Agregar productos al carrito
    async addProductToCart(carritoId, productoId, quantity = 1) {
        try {
            const carrito = await this.getCartById(carritoId)
            const existeProducto = carrito.products.find(item => item.productId.toString() === productoId)

            if(existeProducto) {
                existeProducto.quantity += quantity
            }else{
                carrito.products.push({productId: productoId, quantity})
            }
            //Vamos a marcar la propiedad "products" como modificada antes de guardar
            carrito.markModified("products")
            await carrito.save()
            return carrito
        } catch (error) {
            console.log("Error al agregar producto")
            throw error
        }
    }

    async updateCart(cartId, updateProduct) {
        try {
            // Opción { new: true } para devolver el documento actualizado
            const updatedCart = await CartModel.findByIdAndUpdate(cartId, updateProduct, { new: true });
            
            if (!updatedCart) {
                console.log("No se encontró un carrito con ese ID");
                return null;
            }
    
            console.log("Carrito actualizado con éxito");
            return updatedCart;
            
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            return null;
        }
    }

    async deleteCartProductById(cartId, productoId) {
        try {
            // Busco el carrito por su ID
            const cart = await CartModel.findById(cartId);
    
            // Verifica si el producto existe en el carrito
            const productIndex = cart.products.findIndex(item => item.productId.toString() === productoId);
    
            if (productIndex !== -1) {
                // Si el producto existe, lo eliminamos del array de productos
                cart.products.splice(productIndex, 1);
                await cart.save(); // Guardamos el carrito actualizado en la base de datos
                console.log("Producto eliminado del carrito");
            } else {
                console.log("El producto no se encontró en el carrito");
            }
    
            return cart;
    
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            return null;
        }
    }
    
    async emptyCartById(cartId) {
        try {
            // Busco el carrito por su ID
            const cart = await CartModel.findById(cartId);
    
            if (cart && cart.products.length > 0) {
                // Vaciar el array de productos
                cart.products = [];
                
                // Guardar el carrito actualizado en la base de datos
                await cart.save();
                console.log("El carrito ha sido vaciado");
            } else {
                console.log("El carrito no fue econtrado");
            }
    
            return cart;
    
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            return null;
        }
    }
}


module.exports = CartManager