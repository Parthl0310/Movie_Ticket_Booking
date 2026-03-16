import express from "express";
import { GetFavorite, GetUserBooking, updateFavorite } from "../Controllers/usercontroller.js";

const userRouter=express.Router();

userRouter.get('/bookings',GetUserBooking)
userRouter.post('/update-favorite',updateFavorite)
userRouter.get('/favorites',GetFavorite)

export default userRouter;