import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { GetAllBookings, GetAllShows, GetDashboardData, isAdmin } from "../Controllers/adminController.js";

const adminRouter=express.Router();

adminRouter.get('/is-admin',protectAdmin,isAdmin);
adminRouter.get('/dashboard',protectAdmin,GetDashboardData)
adminRouter.get('/all-shows',protectAdmin,GetAllShows)
adminRouter.get('/all-bookings',protectAdmin,GetAllBookings)


export default adminRouter;