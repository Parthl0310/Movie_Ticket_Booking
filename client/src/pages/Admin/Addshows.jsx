import React, { useEffect, useState } from "react";
import Title from "../../components/Admin/Title";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import { kconverter } from "../../lib/kconverter";

const Addshows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [nowplayingmovies, setnowplayingmovies] = useState([]);
  const [selectmovie, setselectmovie] = useState(null);
  const [datetimeselection, setdatetimeselection] = useState({});
  const [datetimeinput, setdatetimeinput] = useState("");
  const [showprice, setshowprice] = useState("");

  const fetchnowplayindmovies = async () => {
    setnowplayingmovies(dummyShowsData);
  };

  const handledatetimeadd=()=>{
    if(!datetimeinput) return;
    const [date,time]=datetimeinput.split("T");
    if(!date || !time) return;

    setdatetimeselection((prev)=>{
      const times=prev[date] || [];
      if(!times.includes(time) ){
        return {...prev,[date]:[...times,time]};
      }
      return prev;
    });
  };

  const handelremovetime=(date,time)=>{
    setdatetimeselection((prev)=>{
      const filteredtimes=prev[date].filter((t)=> t!==time);
      if(filteredtimes.length === 0){
        const { [date]:_, ...rest }=prev;
        return rest;
      }
      return { ...prev,[date]:filteredtimes};
    });
  };

  useEffect(() => {
    fetchnowplayindmovies();
  }, []);

  return nowplayingmovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Show" />
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
      <div className="overflow-x-auto pb-4 no-scrollbar">
        <div className="group flex flex-wrap gap-4 mt-4 w-max ">
          {nowplayingmovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => setselectmovie(movie.id)}
              className={`relative max-w-40 cursor-pointer
            group-hover:not-hover:opacity-40 hover:-translate-y-1 transition
            duration-300`}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={movie.poster_path}
                  alt=""
                  className="w-full
                object-cover brightness-90"
                />
                <div
                  className="text-sm flex items-center justify-between
                p-2 bg-black/70 w-full absolute bottom-0 left-0"
                >
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-gray-300">
                    {kconverter(movie.vote_count)} Votes
                  </p>
                </div>
              </div>
              {selectmovie === movie.id && (
                <div
                  className="absolute top-2 right-2 flex items-center justify-center
                bg-primary h-6 b-6 rounded"
                >
                  <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}
              <p className="font-medium truncate">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Show Price Input */}
      <label className="block text-sm font-medium mb-2">Show Price</label>
      <div
        className="inline-flex items-center gap-2 border border-gray-600
      px-3 py-2 rounded-md"
      >
        <p className="text-gray-400 text-sm">{currency}</p>
        <input
          type="number"
          min={0}
          value={showprice}
          onChange={(e) => setshowprice(e.target.value)}
          placeholder="Enter Show Price"
          className=" outline-none"
        />
      </div>

      {/* Date & Time */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Select Date And Time
        </label>
        <div
          className="inline-flex items-center gap-2 border border-gray-600
      px-3 py-2 rounded-md"
        >
          <input
            type="datetime-local"
            value={datetimeinput}
            onChange={(e) => setdatetimeinput(e.target.value)}
            className=" outline-none rounded-md"
          />
          <button className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg
          hover:bg-primary cursor-pointer" onClick={handledatetimeadd}>
              ADD Time
          </button>
        </div>
      </div>
      {/* Disply Selected Time */}
          {
            Object.keys(datetimeselection).length >0 && (
              <div className="mt-6">
                <h2 className="mb-2">
                  Selected Date-Time
                </h2>
                <ul className="space-y-3">
                  {
                    Object.entries(datetimeselection).map(([date,times])=>(
                      <li key={date}>
                        <div className="font-medium">
                          {date}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm">
                          {times.map((time)=>(
                            <div key={time} className="border border-primary px-2 py-1 flex items-center
                            rounded">
                              <span>{time}</span>
                              <DeleteIcon onClick={()=>handelremovetime(date,time)} width={15} className="ml-2 
                              text-red-500 hover:text-red-700 cursor-pointer"/>
                            </div>
                          ))}
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
            )
          }
          <button className="bg-primary text-white px-8 py-2 mt-6
          rounded hover:bg-primary/90 transition-all cursor-pointer">
            Add Show
          </button>
    </>
  ) : (
    <Loading />
  );
};

export default Addshows;
