import { Branch, Customer, DeliveryPartner, Order } from "../../models/index.js";

export const createOrder = async(req,res) => {
    try {
        const {userId} = req.user
        const {items,branch,totalPrice} = req.body;

        const customerData = await Customer.findById(userId)
        const branchData  = await Branch.findById(branch)

        if(!customerData){
            return res.status(404).send({
                success:false,
                message:"customer not found"
            })
        }
        if(!branchData){
            return res.status(404).send({
                success:false,
                message:"branch not found"
            })
        }

        const newOrder = new Order({
            customer:userId,
            items:items.map((item)=>({
                id:item.id,
                item:item.item,
                count:item.count
            })),
            branch,
            totalPrice,
            deliveryLocation:{
                latitude:customerData.liveLocation.latitude,
                longitude:customerData.liveLocation.longitude,
                address:customerData.address || "No address available"
            },
            pickupLocation:{
                latitude:branchData.location.latitude,
                longitude:branchData.location.longitude,
                address:branchData.address || "No address available"
            }
        })
        const savedOrder = await newOrder.save()
        return res.status(201).send({
            success:true,
            savedOrder
        }) 
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"error occured",
            error
        })
    }
}

export const updateOrderStatus = async(req,res) => {
    try {
        const {orderId} = req.params
        const {userId} = req.user
        const {status,deliveryPersonLocation} = req.body

        const deliveryPerson = await DeliveryPartner.findById(userId)

        if(!deliveryPerson){
            return res.status(404).send({
                success:false,
                message:"deliveryPerson not found"
            })
        }

        const order = await Order.findById(orderId)
        if(!order){
            return res.status(404).send({
                success:false,
                message:"order not found"
            })
        }

        if(["cancelled","delivered"].includes(order.status)){
            return res.status(404).send({
                success:false,
                message:"order cannot be updated"
            })
        }

        if(order.deliveryPartner.toString() !== userId){
            return res.status(404).send({
                success:false,
                message:"only authorized delivery partner can update their order"
            })
        }

        order.status = status
        order.deliveryPersonLocation = deliveryPersonLocation

        await order.save()

        return res.status(201).send({
            success:true,
            order
        }) 

    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"error occured",
            error
        })
    }
}

export const confirmOrder = async(req,res) => {
    try {
        const {orderId} = req.params
        const {userId} = req.user
        const {deliveryPersonLocation} = req.body

        const deliveryPerson = await DeliveryPartner.findById(userId)

        if(!deliveryPerson){
            return res.status(404).send({
                success:false,
                message:"deliveryPerson not found"
            })
        }

        const order = await Order.findById(orderId)
        if(!order){
            return res.status(404).send({
                success:false,
                message:"order not found"
            })
        }

        if(order.status !== 'available'){
            return res.status(404).send({
                success:false,
                message:"order not available"
            })
        }

        order.status = "confirmed"
        order.deliveryPartner = userId
        order.deliveryPersonLocation = {
            latitude:deliveryPersonLocation?.latitude,
            longitude:deliveryPersonLocation?.longitude,
            address:deliveryPersonLocation?.address || "No address available"
        }

        await order.save()

        return res.status(201).send({
            success:true,
            order
        }) 

    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"error occured",
            error
        })
    }
}

export const getOrders = async(req,res) => {
    try {
        const {status,customerId,deliveryPartnerId,branchId} = req.query
        let query = {}

        if(status){
            query.status = status
        }
        if(customerId){
            query.customer = customerId
        }
        if(deliveryPartnerId){
            query.deliveryPartner = deliveryPartnerId
            query.branchId = branchId
        }

        const orders = await Order.find(query).populate(
            "customer branch items.item deliveryPartner"
        )

        if(!orders){
            return res.status(404).send({
                success:false,
                message:"order not found"
            })
        }

        return res.status(201).send({
            success:true,
            orders
        }) 

    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"error occured",
            error
        })
    }
}

export const getOrderId = async(req,res) => {
    try {
        const {orderId} = req.params


        const order = await Order.findById(orderId).populate(
            "customer branch items.item deliveryPartner"
        )

        if(!order){
            return res.status(404).send({
                success:false,
                message:"order not found"
            })
        }

        return res.status(201).send({
            success:true,
            order
        }) 

    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"error occured",
            error
        })
    }
}