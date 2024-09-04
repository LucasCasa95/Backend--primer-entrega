const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://lucascasa95:coderhouse@cluster0.ifezu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("Conexión exitosa"))
.catch((error) => console.log("Tenemos un error", error))
