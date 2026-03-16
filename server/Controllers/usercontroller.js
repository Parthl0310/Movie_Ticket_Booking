import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import {clerkClient} from "@clerk/express";

// Api controller to get user booking

const GetUserBooking=async (req,res)=>{
    try {
        const {userId}=req.auth();

        const userbookings=await Booking.find({user:userId}).populate({
            path:'show',
            populate:{path:'movie'}
        }).sort({createdAt:-1 })

        res.json({
            success:true,
            userbookings
        })
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}

// Api constroller To add Favourite Movie in cleark User MetaData

const addFavorite=async(req,res)=>{
    try {
        const {movieId}=req.body;
        const userId=req.auth().userId;

        const user=await clerkClient.users.getUser(userId);

        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites=[]
        }

        if(!user.privateMetadata.favorites.includes([movieId])){
            user.privateMetadata.favorites.push(movieId)
        }
        await clerkClient.users.updateUserMetadata(userId,{privateMetadata:user.privateMetadata})

        res.json({
            success:true,
            message:"Favourite Added Successfully"
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}

const updateFavorite=async(req,res)=>{
    try {
        const {movieId}=req.body;
        const userId=req.auth().userId;

        const user=await clerkClient.users.getUser(userId);

        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites=[]
        }

        if(!user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId)
        }
        else{
            user.privateMetadata.favorites= user.privateMetadata.favorites.filter(item=> item!==movieId)
        }

        await clerkClient.users.updateUserMetadata(userId,{privateMetadata:user.privateMetadata})

        res.json({
            success:true,
            message:"Favourite movie Updated Successfully"
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}

const GetFavorite=async(req,res)=>{
    try {
        const user=await clerkClient.users.getUser(req.auth().userId);
        const favorites=await user.privateMetadata.favorites;
        
        //Getting movies from database
        const movies=await Movie.find({_id:{$in:favorites}})

        res.json({
            success:true,
            movies
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}

export {GetUserBooking,addFavorite,updateFavorite,GetFavorite};