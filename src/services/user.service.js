import userRepository from "../repositories/user.repository.js"
import { createHash, isValidPassword} from "../utils/util.js"
import CartModel from "../dao/models/cart.model.js";

class UserServices {
    async registerUser(userData) {
        const existingUser = await userRepository.getUserByEmail(userData.email);
        if (existingUser) throw new Error("El usuario ya existe");
    
        // Crear un nuevo carrito
        const newCart = await CartModel.create({ products: [] }); // Crea un carrito vacío
    
        // Asocia el ID del carrito al usuario
        userData.cart = newCart._id;
    
        userData.password = createHash(userData.password);
        return await userRepository.createUser(userData);
    }
    

    async loginUser(email, password) {
        const user = await userRepository.getUserByEmail(email); 
        if(!user || !isValidPassword(password, user)) throw new Error("Credenciales incorrectas"); 
        return user; 
    }

    async getUserById(id) {
        return await userRepository.getUserById(id); 
    }

    //Pueden hacer los métodos para actualizar y borrar usuarios. 
}

export default new UserServices(); 