import productDao from "../dao/product.dao.js"

class ProductRepository {
    async createProduct(productData) {
        return await productDao.save(productData)
    }

    async getProductById(id){
        return await productDao.findById(id)
    }

    async getProducts(query) {
        return await productDao.findOne(query)
    }

    async updateProduct(id, productData) {
        return await productDao.update(id, productData)
    }

    async deleteProduct(id) {
        return await productDao.delete(id)
    }

    async paginate(query,ops){
        return await productDao.paginate(query, ops)
    }
}

export default new ProductRepository ()