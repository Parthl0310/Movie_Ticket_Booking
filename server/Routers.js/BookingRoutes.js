import express from "express";
import { CreateBooking, getOccupiedSeats } from "../Controllers/bookingcontroller.js";

const bookingRouter=express.Router();

bookingRouter.post('/create',CreateBooking)
bookingRouter.get('/seats/:showId',getOccupiedSeats)


export default bookingRouter;