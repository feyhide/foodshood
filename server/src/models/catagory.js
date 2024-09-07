import mongoose from "mongoose";

const catagorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true 
    }
})

export const Catagory = mongoose.model("Catagory",catagorySchema)