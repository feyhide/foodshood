import fastify from "fastify";
import { getAllCatagories } from "../controllers/product/catagory.js";
import { getProductsByCatagoryId } from "../controllers/product/product.js";

export const catagoryRoutes = async(fastify,options)=>{
    fastify.get("/catagories",getAllCatagories)
}

export const productRoutes = async(fastify,options)=>{
    fastify.get("/products/:catagoryId",getProductsByCatagoryId)
}