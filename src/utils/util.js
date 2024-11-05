import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid"
import ProductModel from "../dao/models/product.model.js"

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

//Generador de Id Aleatorio
const generateCode = () => { 
    const codigo = uuidv4();
    return codigo
    }

const calcularTotal = async (products) => {
    let total = 0;
    for (let item of products) {
        const productoCompleto = await ProductModel.findById(item.product); 
        if (productoCompleto) {
            total += productoCompleto.price * item.quantity;
        }
    }
    return total;
}


const eliminarProductosNoDisponibles = (cart, productosNoDisponibles) => {
    return cart.filter(item => 
        !productosNoDisponibles.includes(item.product.toString())
    )
}

export {createHash, isValidPassword, generateCode, calcularTotal, eliminarProductosNoDisponibles}; 