import { clerkClient } from "@clerk/express";

export const protectAdmin=async(req,res,next)=>{
    try {
        const {userId}=req.auth();
        const user=await clerkClient.users.getUser(userId);
        if(user.privateMetadata.role !== 'admin'){
            res.json({
                success:'False',
                message:"You Are Not Authorized"
            })
        }

        next();
    } catch (error) {
        console.log(error);
        res.json({
            success:'False',
            message:error.message
        })
    }
}