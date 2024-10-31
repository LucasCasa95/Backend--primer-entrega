import productRepository from "../repositories/product.repository.js";

class ProductService{

    async addProduct(productData){
            return await productRepository.createProduct(productData);
        }
     
    async getProducts(queryParams){
        let query = {};
        let sort = {};
        let page = parseInt(queryParams.page) || 1;
        let limit = parseInt(queryParams.limit) || 10;
        const { category, sort: sortOrder, title } = queryParams;
    
        if (category) { query.category = category; }
    
        if (title) { query.title = new RegExp(title, 'i'); }
    
        if (sortOrder) { sort.price = sortOrder === 'asc' ? 1 : -1; }
    
        const options = {
            limit,
            sort,
            page,
            lean: true
        };

        try{
        const response = await productRepository.paginate(query, options)
        return response;
        }catch(error){
            console.log("Error al obtener los productos", error);
            return null
        }
    }

    async getProductById(id){
            //console.log("product ID desde producto service", id);
            const productFound= await productRepository.findById(id);
            if(productFound){
                return productFound
            }else{
                console.log("Producto No Encontrado por Id");
            }
    }

    async updateProduct(id, productData){
        
            const updateProd = await productRepository.findByIdAndUpdate(id, productData)
            if(!updateProd){
                console.log("No se encontro el producto");
                return null;
            } else {
                return updateProd
            }
        }

    async deleteProduct(id){
            
                const deleteProd = await productRepository.findByIdAndDelete(id)
                if(!deleteProd){
                    console.log("No se encontro el producto");
                    return null;
                } else {
                    return deleteProd
                }
            
        }
        
}

export default new ProductService()