import { Catagory, Product } from "../../models/index.js"

export const getAllCatagories = async(req,res)=>{
    try {
        const catagories = await Catagory.find()

        return res.status(200).send({
            success:true,
            catagories
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"error occured",
            error
        })
    }
}