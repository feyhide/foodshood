import { Customer, DeliveryPartner } from "../../models/index.js"

export const updateUser = async(req,res) => {
    try {
        const {userId} = req.user
        const updateData = req.body

        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId)

        if(!user){
            return res.status(404).send({
                success:false,
                message:"User not found"
            })
        }

        let UserModel;
        if(user.role === "Customer"){
            UserModel = Customer
        }else if(user.role === "DeliveryPartner"){
            UserModel = DeliveryPartner
        }else{
            return res.status(400).send({
                success:false,
                message:"Invalid User Role"
            })
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {$set:updateData},
            {new:true,runValidators:true}
        )

        if(!updatedUser){
            return res.status(404).send({
                success:false,
                message:"User not found"
            })
        }

        return res.status(200).send({
            success:true,
            message:"User updated",
            updatedUser
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"error occured",
            error
        })
    }
}