import jwt from 'jsonwebtoken'
import { Customer, DeliveryPartner } from '../../models/index.js'

export const generateToken = (user) => {
    const accessToken = jwt.sign(
        {userId:user._id,role:user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"365d"}
    )
    const refreshToken = jwt.sign(
        {userId:user._id,role:user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"365d"}
    )
    return {accessToken,refreshToken}
}

export const loginCustomer = async (req,res) => {
    try {
        const {phone} = req.body;
        let customer = await Customer.findOne({phone})

        if(!customer){
            customer = new Customer({
                phone,
                role:"Customer",
                isActivated:true,
            })
            await customer.save()
        }
        
        const {accessToken,refreshToken} = generateToken(customer);

        return res.send({
            success:true,
            message:customer ? "login successful":"Customer Created and logged in",
            accessToken,
            refreshToken,
            customer
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"an error occured",
            error
        })
    }
}

export const loginDeliveryPartner = async (req,res) => {
    try {
        const {email,password} = req.body;
        let deliveryPartner = await DeliveryPartner.findOne({email})

        if(!deliveryPartner){
            return res.status(404).send({
                success:false,
                message:"delivery partner not found"
            })
        }
        
        const isMatch = password === deliveryPartner.partner

        
        if(!isMatch){
            return res.status(400).send({
                success:false,
                message:"Invalid Credentials"
            })
        }
        
        const {accessToken,refreshToken} = generateToken(customer);
        
        return res.send({
        success:true,
            message:"login successful",
            accessToken,
            refreshToken,
            deliveryPartner
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"an error occured",
            error
        })
    }
}

export const refreshToken = async(req,res) => {
    const {refreshToken} = req.body

    if(!refreshToken){
        return res.status(401).send({
            success:false,
            message:"Refresh Token Required"
        })
    }

    try {
        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
        let user;
        if(decoded.role === "Customer"){
            user = await Customer.findById(decoded.userId)
        }else if(decoded.role === "DeliveryPartner"){
            user = await DeliveryPartner.findById(decoded.userId)
        }else{
            return res.status(403).send({
                success:false,
                message:"Invalid Token Role"
            })
        }

        if(!user){
            return res.status(404).send({
                success:false,
                message:"Invalid Refresh Token"
            })
        }

        if(!user.isActivated){
            return res.status(404).send({
                success:false,
                message:"User is not activated"
            })
        }
        
        const {accessToken,refreshToken:newRefreshToken} = generateToken(user)
        
        return res.status(200).send({
            success:true,
            message:"Token Refreshed",
            accessToken,
            refreshToken:newRefreshToken
        })
    } catch (error) {
        return res.status(403).send({
            success:false,
            message:"invalid refresh token"
        })
    }
}

export const fetchUser = async(req,res) => {
    try{
        const {userId,role} = req.user
        let user;

        if(!userId){
            return res.status(403).send({
                success:false,
                message:"Error getting userid"
            })
        }
        if(decoded.role === "Customer"){
            user = await Customer.findById(decoded.userId)
        }else if(decoded.role === "DeliveryPartner"){
            user = await DeliveryPartner.findById(decoded.userId)
        }else{
            return res.status(403).send({
                success:false,
                message:"Invalid Token Role"
            })
        }

        if(!user){
            return res.status(404).send({
                success:false,
                message:"User not found"
            })
        }
        
        return res.status(200).send({
            success:true,
            message:"User found",
            user
        })

    }catch(error){
        return res.status(500).send({
            message:"An error occured",
            success:false
        })
    }
}