import cartDao from "../dao/cart.dao.js"

class CartRepository {
    async createCart(cartData) {
        return await cartDao.save(cartData)
    }

    async getCarts() {
        return await cartDao.find()
    }

    async getCartById(id) {
        return cartDao.findById(id)
    }

    async updateCart(id, cartData) {
        return await cartDao.update(id, cartData)
    }

    async updateCartProducts(id, products) {
        return await cartDao.update(id, { products });
    }
    

    async deleteCart(id) {
        return await cartDao.delete(id)
    }
}


export default new CartRepository ()