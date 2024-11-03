import cartDao from "../dao/cart.dao.js";

class CartRepository {
    async createCart(cartData) {
        return await cartDao.save(cartData); // Crea un nuevo carrito
    }

    async getCarts() {
        return await cartDao.find(); // Obtiene todos los carritos
    }

    async getCartById(id) {
        return await cartDao.findById(id); // Obtiene el carrito por ID
    }

    async updateCart(id, cartData) {
        return await cartDao.update(id, cartData); // Actualiza el carrito
    }

    async updateCartProducts(id, products) {
        return await cartDao.update(id, { products }); // Actualiza los productos del carrito
    }
    
    async deleteCart(id) {
        return await cartDao.delete(id); // Elimina el carrito
    }
}

export default new CartRepository();
