import productService from "../services/product.service.js";

class ProductController {
    async getProducts(req, res) {
        try{    
            const result = await productService.getProducts(req.query);
            res.send({ 
                result: "success", 
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.prevLink = result.hasPrevPage ? `http://localhost:8080/?page=${result.prevPage}` : null,
                nextLink: result.nextLink = result.hasNextPage ? `http://localhost:8080/?page=${result.nextPage}` : null,
                isValid: result.docs.length > 0
            });
            console.log(result)       
        }catch (error){
            res.send("Error en consultar los productos")
            console.log(error);
            }
    }

    async getProductById(req, res) {
        const {pid} = req.params
        try {
            const product = await productService.getProductById(pid)
            if(!product) return res.status(404).send("Producto no encontrado")
                res.send(product)
        } catch (error) {
            res.status(500).send("Error interno del servidor")
        }
    }

    async createProduct(req, res) {
        try {
            const product = await productService.createProduct(req.body)
            res.status(201).send(product)
        } catch (error) {
            res.status(500).send("Error interno del servidor")
        }
    }

    async updateProduct(req, res) {
        const { pid } = req.params;
        const updatedData = req.body;

        try {
            const updatedProduct = await productService.updateProduct(pid, updatedData);
            if (!updatedProduct) {
                return res.status(404).send("Producto no encontrado o no se pudo actualizar");
            }
            res.send({ result: "success", product: updatedProduct });
        } catch (error) {
            res.status(500).send("Error al actualizar el producto");
            console.log("Error al actualizar el producto:", error);
        }
    }

    async deleteProduct(req, res) {
        const { pid } = req.params;

        try {
            const deletedProduct = await productService.deleteProduct(pid);
            if (!deletedProduct) {
                return res.status(404).send("Producto no encontrado o no se pudo eliminar");
            }
            res.send({ result: "success", message: "Producto eliminado correctamente" });
        } catch (error) {
            res.status(500).send("Error al eliminar el producto");
            console.log("Error al eliminar el producto:", error);
        }
    }
}

export default ProductController