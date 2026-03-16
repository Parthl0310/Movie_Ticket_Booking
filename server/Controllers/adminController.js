//Api for check if user is Admin

import { populate } from "dotenv";
import Booking from "../models/Booking.js"
import Show from "../models/Show.js";
import User from "../models/User.js";

const isAdmin=async(req,res)=>{
    res.json({
        success:true,
        isAdmin:true
    })
}

//Api To Get DashBoardData

const GetDashboardData=async(req,res)=>{
    try {
        const bookings=await Booking.find({isPaid:true});
        const activeShows=await Show.find({showdatetime:{$gte:new Date()}}).populate('movie');
        const totalUser=await User.countDocuments();
        const dashBoardData={
            totalBookings:bookings.length,
            totalRevenue:bookings.reduce((acc,booking)=> acc+booking.amount,0),
            activeShows,
            totalUser,
        }
        console.log(activeShows)
        res.json({
            success:true,
            dashBoardData
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}

// Api to Get All Shows

const GetAllShows=async(req,res)=>{
    try {
        const shows=await Show.find({showdatetime:{$gte:new Date()}}).populate('movie').sort({showdatetime:1});
        res.json({
            success:true,
            shows
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}

// Api to Get All Bookings

const GetAllBookings=async (req,res)=>{
    try {
        const bookings=await Booking.find({}).populate('user').populate({
            path:"show",
            populate:{path:"movie"}
        }).sort({createdAt:-1})

        res.json({
            success:true,
            bookings
        })

    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}

export {isAdmin,GetDashboardData,GetAllShows,GetAllBookings}