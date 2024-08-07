const fs = require("fs").promises

class ProductManager{
    static ultimoId = 0
    constructor(path) {
        this.products = []
        this.path = path
    }

    async addProduct({title, description, price, thumbnail, code, stock}){
        try {
            const arrayProductos = await this.leerArchivo()
            if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log("Todos los campos son obligatorios")
            return
        }
        if(arrayProductos.some(prod => prod.code == code)){
            console.log("El codigo debe ser unico")
            return
        }
        if (arrayProductos.length > 0) {
            ProductManager.ultimoId = Math.max(...arrayProductos.map(p => p.id));
        }
        const nuevoProducto = {
            id: ++ProductManager.ultimoId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        arrayProductos.push(nuevoProducto)
        //Ultimo paso, lo metemos en un archivo
        await this.guardarArchivo(arrayProductos)
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    async getProducts(){
        try {
            const arrayProductos = await this.leerArchivo()
            return arrayProductos
        } catch (error) {
            console.log("Error al leer el archivo", error)
        }

    }

    async getProductById(id){
        try {
            const arrayProductos = await this.leerArchivo()
            const buscado = arrayProductos.find(prod => prod.id === id);
        if (!buscado) {
            console.log("Producto no encontrado");
            return null
        } else {
            console.log("Producto encontrado");
            return buscado
        }
        } catch (error) {
            console.log("Error al buscar por id", error)
        }

    }

//Metodo para actualizar un producto:
    async updateProduct(id, productoActualizado){
        try {
            const arrayProductos = await this.leerArchivo()
            const index = arrayProductos.findIndex( prod => prod.id === id)
            if(index !== -1){
                arrayProductos[index] = {...arrayProductos[index], ...productoActualizado}
                await this.guardarArchivo(arrayProductos)
                console.log("Producto actualizado")
            }else{
                console.log("No se encontro el producto")
            }
        } catch (error) {
            console.log("Tenemos un error al actualizar los productos")
        }
    }

    //Metodo para eliminar un producto
    async deleteProduct(id){
        try {
            const arrayProductos = await this.leerArchivo()
            const index = arrayProductos.findIndex( prod => prod.id === id)
            if(index !== -1){
                arrayProductos.splice(index, 1)
                await this.guardarArchivo(arrayProductos)
                console.log("Producto eliminado")
                return true
            }else{
                console.log("No se encontro el producto")
                return false
            }
        } catch (error) {
            console.log("Tenemos un error al eliminar los productos")
            throw error
        }
    }

        //Metodos auxiliares
    async leerArchivo(){
        const respuesta = await fs.readFile(this.path, "utf-8")
        const arrayProductos = JSON.parse(respuesta)
        return arrayProductos
    }
    async guardarArchivo (arrayProductos){
        await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2))
    }
    }


    module.exports = ProductManager