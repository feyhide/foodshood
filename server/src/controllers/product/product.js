import { Product } from "../../models/index.js"

export const getProductsByCatagoryId = async(req,res)=>{
    const {catagoryId} = req.params

    try {
        const products = await Product.find({catagory:catagoryId})
            .select("-catagory")
            .exec()
        return res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"error occured",
            error
        })
    }
}