import CartModel from "./models/cart.model.js";

class CartDao {
    async find() {
        return await CartModel.find(); // Retorna todos los carritos
    }
    
    async findById(id) {
        const cart = await CartModel.findById(id);
        if (!cart) {
            throw new Error("Carrito no encontrado"); // Lanzar error si no se encuentra el carrito
        }
        return cart;
    }

    async save(cartData) {
        const cart = new CartModel(cartData); // Crea un nuevo carrito
        return await cart.save(); // Guarda el carrito en la base de datos
    }

    async update(id, cartData) {
        const updatedCart = await CartModel.findByIdAndUpdate(id, cartData, { new: true }); // Actualiza y retorna el carrito actualizado
        if (!updatedCart) {
            throw new Error("Carrito no encontrado"); // Lanzar error si no se encuentra el carrito
        }
        return updatedCart;
    }

    async delete(id) {
        const deletedCart = await CartModel.findByIdAndDelete(id);
        if (!deletedCart) {
            throw new Error("Carrito no encontrado"); // Lanzar error si no se encuentra el carrito
        }
        return deletedCart;
    }
}

export default new CartDao();
