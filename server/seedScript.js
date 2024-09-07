import mongoose from "mongoose"
import 'dotenv/config'
import { Catagory, Product } from "./src/models/index.js"
import { categories, products } from "./SeedData.js"

async function seedDatabase(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        await Product.deleteMany({})
        await Catagory.deleteMany({})

        const catagoryDocs = await Catagory.insertMany(categories)
        const categoryMap = catagoryDocs.reduce((map,catagory)=>{
            map[catagory.name] = catagory._id
            return map
        },{})

        const productWithCatagoryIds = products.map((product)=>({
            ...product,
            catagory: categoryMap[product.catagory]
        }))

        await Product.insertMany(productWithCatagoryIds)
        console.log("Done")
    } catch (error) {
        console.log(error)
    } finally {
        mongoose.connection.close()
    }
}

seedDatabase()