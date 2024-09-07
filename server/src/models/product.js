import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true 
    },
    price:{
        type:Number,
        required:true 
    },
    discountedPrice:{
        type:Number
    },
    quantity:{
        type:String,
        required:true 
    },
    catagory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Catagory",
        required:true
    }
    
})

export const Product = mongoose.model("Product",productSchema)