import express from "express";
import {NowPlayingMoive,Addshow, GetShows, GetShow} from "../Controllers/ShowController.js"
import { protectAdmin } from "../middleware/auth.js";

const showRouter=express.Router();

showRouter.get('/now-playing',protectAdmin,NowPlayingMoive)
showRouter.post('/add',protectAdmin,Addshow)
showRouter.get('/all',GetShows)
showRouter.get('/:movieId',GetShow)

export default showRouter;