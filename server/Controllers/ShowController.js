import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import https from "https";

const agent = new https.Agent({
  keepAlive: true
});

const NowPlayingMoive =async (req,res) => {
    try {
        const data=await axios.get('https://api.themoviedb.org/3/movie/now_playing',{
            httpsAgent: agent,
            headers:{
                Authorization:`Bearer ${process.env.TMDB_API_KEY}`
            }
        })

        const movies=data.data.results;
        res.json({success:true,movie:movies})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// API to New Show Database
const Addshow=async (req,res)=>{
    try {
        const {movieId,showInput,showPrice}=req.body
        // console.log(movieId);
        // console.log(showInput);
        // console.log(showPrice);
        
        let movie=await Movie.findById(movieId);
        if(!movie){
            const [movieDetailResponse,movieCreditResponse]=await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
                    headers:{
                        Authorization:`Bearer ${process.env.TMDB_API_KEY}`
                    }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{
                    headers:{
                        Authorization:`Bearer ${process.env.TMDB_API_KEY}`
                    }
                })
            ])
            
            const movieData=movieDetailResponse.data;
            const movieCredit=movieCreditResponse.data;

            // console.log(movieData);
            // console.log(movieCredit);

            const moviedetail={
                _id:movieId,
                title:movieData.title,
                overview:movieData.overview,
                poster_path:movieData.poster_path,
                backdrop_path:movieData.backdrop_path,
                release_date:movieData.release_date,
                original_language:movieData.original_language,
                tagline:movieData.tagline || "",
                genre:movieData.genres,
                casts:movieCredit.cast,
                vote_average:movieData.vote_average,
                runtime:movieData.runtime
            }

            movie=await Movie.create(moviedetail)
        }

        const addToShow=[];
        showInput.forEach(show => {
            const showDate=show.date;
            show.time.forEach(time=>{
                const dateTimeString=`${showDate}T${time}`;
                const showDetails={
                    movie:movie._id,
                    showdatetime:new Date(dateTimeString),
                    showprice:showPrice,
                    occupiedseats:{},
                }
                addToShow.push(showDetails);
            })
        });

        if(addToShow.length > 0){
            await Show.insertMany(addToShow);
        }

        res.json({
            success:true,
            message:"Shows Created success Fully"
        })

    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })

    }
}

const GetShows=async (req,res)=>{
    try {
        const shows=await Show.find({showdatetime:{$gte:new Date()}}).populate('movie').sort({showdatetime:1});

        // filter unique shows
        const uniqueshows=new Set(shows.map(show=>{
            return show.movie;
        }))

        res.json({
            success:true,
            shows:Array.from(uniqueshows)
        })
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}

// get single Shows
const GetShow=async (req,res)=>{
    try {
        const {movieId}=req.params;

        const shows=await Show.find({movie:movieId,showdatetime:{$gte :new Date()}})

        const movie=await Movie.findById(movieId);
        const datetime={};
        shows.forEach((show)=>{
            const date=show.showdatetime.toISOString().split("T")[0];
            if(!datetime[date]){
                datetime[date]=[]
            }
            datetime[date].push({time:show.showdatetime,showId:show._id});
        })

        res.json({
            success:true,
            movie,
            datetime
        })  
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}

export {NowPlayingMoive,Addshow,GetShows,GetShow};