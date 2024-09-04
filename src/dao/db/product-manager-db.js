const ProductModel = require("../models/product.model.js")

class ProductManager{
    async addProduct({title, description, price, thumbnail, code, stock}){
        try {
            if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log("Todos los campos son obligatorios")
            return
        }
        //Cambiamos la validación
        const existeProducto = await ProductModel.findOne({code: code})
        if(existeProducto) {
            console.log("El codigo debe ser unico")
            return
        }
        const nuevoProducto = new ProductModel ({
            title,
            description,
            price,
            thumbnail: thumbnail || [],
            code,
            stock,
            status: true
        })
        await nuevoProducto.save()
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    // async getProducts(filters){
    //     try {
    //         if (!filters || typeof filters !== 'object') {
    //             throw new Error("Los filtros no son válidos.");
    //         }
    //         const filter = {}
    //         const options= {page:1, limit: 6, sort: {}}

    //         if (filters.sort) {
    //             options.sort.price = filters.sort === "desc" ? -1: 1
    //         }

    //         if(filters.page) {
    //             options.page = parseInt(filters.page, 10)
    //         }

    //         if (filters.limit) {
    //             options.limit = parseInt(filters.limit, 10)
    //         }

    //         const arrayProductos = await ProductModel.paginate(filter, options)
    //         return arrayProductos
    //     } catch (error) {
    //         console.log("Error al obtener los productos", error)
    //     }

    // }

    async getProducts(){
            const arrayProductos = await ProductModel.find().lean()
            return arrayProductos
        } catch (error) {
            console.log("Error al obtener los productos", error)
        }

    

    async getProductById(id){
        try {
            const producto = await ProductModel.findById(id).lean()
            if(!producto) {
                console.log("producto no encontrado")
                return null
            }
            return producto
        } catch (error) {
            console.log("Error al buscar por id", error)
        }

    }

//Metodo para actualizar un producto:
    async updateProduct(id, productoActualizado){
        try {
            const updateado = await ProductModel.findByIdAndUpdate(id, productoActualizado)
            if(!updateado) {
                console.log("No se encuentra el producto")
                return null
            }
            return updateado
        } catch (error) {
            console.log("Tenemos un error al actualizar los productos")
        }
    }

    //Metodo para eliminar un producto
    async deleteProduct(id){
        try {
            const eliminado = await ProductModel.findByIdAndDelete(id)
            if(!eliminado) {
                console.log("No existe el producto que quiere eliminar")
                return null
            }
            console.log("Porducto eliminado correctamente")
        } catch (error) {
            console.log("Tenemos un error al eliminar los productos")
            throw error
        }
    }
    }


    module.exports = ProductManager