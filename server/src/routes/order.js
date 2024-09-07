import fastify from "fastify";
import { verifyToken } from "../middleware/auth.js";
import { confirmOrder, createOrder, getOrderId, getOrders, updateOrderStatus } from "../controllers/order/order.js";

export const orderRoutes = async(fastify,options)=>{
    fastify.addHook("preHandler",async(req,res)=>{
        const isAuthenticated = await verifyToken(req,res)
        if(!isAuthenticated){
            return res.status(401).send({
                success:true,
                message:"Unauthenticated"
            })
        }
    })
    fastify.post("/order/createorder",{preHandler:[verifyToken]},createOrder)
    fastify.post("/order/:orderId/status",{preHandler:[verifyToken]},updateOrderStatus)
    fastify.post("/order/getorders",{preHandler:[verifyToken]},getOrders)
    fastify.post("/order/:orderId/confirm",{preHandler:[verifyToken]},confirmOrder)
    fastify.post("/order/:orderId",{preHandler:[verifyToken]},getOrderId)
}

