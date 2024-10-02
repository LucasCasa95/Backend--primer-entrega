import { promises as fs } from "fs";


class CartManager{
    constructor(path){
        this.path = path
        this.carts = []
        this.ultiId = 0

        //Cargar los carritos almacenados en el archivo
        this.cargarCarritos()
    }

    //Crear dos metodos auxiliares para cargar y leer archivos
    async cargarCarritos(){
        try {
            const data = await fs.readFile(this.path, "utf-8")
            this.carts = JSON.parse(data)

            if(this.carts.length > 0){
                //Verifico que exista el elemento creado.
                this.ultiId = Math.max(...this.carts.map(cart => cart.id))
                //Utilizo el método map para crear un nuevo array que solo tenga el id del carrito y con Math.max obtengo el mayor
            }
        } catch (error) {
            console.log("Error al cargar los carritos al archivo", error)
            //Si no existe el archivo lo voy a crear
            await this.guardarCarrito()
        }
    }

    async guardarCarrito(){
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2))
    }

    //Crear el carrito
    async crearCarrito(){
        const nuevoCarrito = {
            id: ++this.ultiId,
            products: []
        }
        this.carts.push(nuevoCarrito)
        //Guardamos el array en el archivo
        await this.guardarCarrito()
        return nuevoCarrito
    }

    //Retorne carrito por id
    async getCartById(cartId){
        try {
            const carrito = this.carts.find(c => c.id ===cartId)
            if(!carrito){
                throw new Error("No existe un carrito con ese id")
            }
            return carrito
        } catch (error) {
            console.log("Error al obtener el carrito por id")
        }
    }

    //Agregar productos al carrito
    async addProductToCart(carritoId, productoId, quantity = 1) {
        const carrito = await this.getCartById(carritoId)
        const existProduct = carrito.products.find(p => p.product === productoId)
        if(existProduct){
            existProduct.quantity+= quantity
        }else{
            carrito.products.push({product: productoId, quantity})
        }
        await this.guardarCarrito()
        return carrito
    }
}


export default CartManager