import cartRepository from "../repositories/cart.repository.js";

class CartService{

    async createCart(){
            return await cartRepository.createCart({products:[]})
        }

    async getCarts() {
        try {
            const cart = await cartRepository.getCarts();
            return cart;
        } catch (error) {
            console.log("error al buscar los carritos", error);
            throw error;
            }

            }

    async getCartById (cid) {
        try {
            const cart = await cartRepository.getCartById(cid)
                if(!cart){
                    console.log("Carrito No Encontrado");
                    return null;
                }else{
                    return cart;
                }
        } catch (error) {
            console.log("Error al obtener el carrito por id")
            }
            }
        
    async addProductToCart(cid, pid, quantity=1){
        try {
            const cart = await cartRepository.getCartById(cid);
            const existProduct = cart.products.find(item => item.productId.toString() === pid)
            if(existProduct){
                existProduct.quantity += quantity
            } else{
                cart.products.push({productId: pid, quantity})
            }
            cart.markModified("products");
            await cartRepository.updateCart(cid,cart);
            return cart;
            } catch (error) {
                console.log("Error al agregar producto")
                throw error
            }
        }

    async updateCart(cartId, updateProduct){
        try {
            const updatedCart = await cartRepository.updateCart(cartId, updateProduct);
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
            const cart = await cartRepository.getCartById(cartId);
            if(!cart){
                console.log("Carrito no encontrado")
                return false
            }
    
            // Verifica si el producto existe en el carrito
            const productIndex = cart.products.findIndex(item => item.productId.toString() === productoId);
    
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                await cartRepository.updateCartProducts(cartId, cart.products);
                console.log("Producto eliminado del carrito");
            } else {
                console.log("El producto no se encontró en el carrito");
                return null
            }
    
            return cart;
    
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            return false;
        }
    }
    
    async emptyCartById(cartId) {
        try {
            const cart = await cartRepository.getCartById(cartId);
            
            if (cart) {
                if (cart.products.length > 0) {
                    // Vaciar los productos a través del repositorio
                    await cartRepository.updateCartProducts(cartId, []);
                    console.log("El carrito ha sido vaciado");
                } else {
                    console.log("El carrito ya estaba vacío");
                }
                return true;
            } else {
                console.log("El carrito no fue encontrado");
                return false;
            }
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            return false;
        }
    }

}

export default new CartService()

// import CartRepository from "../repositories/cart.repository.js"


 //export const cartService = new cartRepository()
