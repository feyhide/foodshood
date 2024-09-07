import jwt from 'jsonwebtoken'

export const verifyToken = async(req,res)=>{
    try {
        const authHeader = req.headers["authorization"]
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(500).send({success:false,message:"Access Token requried"})
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded;
        return res.status(500).send({success:true})
    } catch (error) {
        return res.status(403).send({success:false,message:"invalid or expired token"})
    }
}