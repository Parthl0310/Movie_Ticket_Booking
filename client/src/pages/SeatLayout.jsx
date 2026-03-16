import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {assets} from '../assets/assets'
import Loading from '../components/Loading'
import {ClockIcon,ArrowRightIcon} from 'lucide-react'
import isotimeformate from '../lib/isotimeformat'
import BlurCircle from  '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppcontext } from '../context/Appcontext'

const SeatLayout = () => {
  const {axios,getToken,user}=useAppcontext()
  const grouprows=[["A","B"],["C","D"],["E","F"],["G","H"],["I","J"]]

  const {id,date}=useParams();
  const[seatselected,setseatselected]=useState([])
  const[timeselected,settimeselected]=useState(null)
  const [show,setshow]=useState(null);
  const nevi=useNavigate();
  const [occupiedseats,setoccupiedseats]=useState([])

  const getshow=async()=>{
    try {
      const {data}=await axios.get(`/api/show/${id}`,{
        headers:{
          Authorization: `Bearer ${await getToken()}`
        }
      })
      // console.log(data)
      if(data.success){
        setshow({
          movie:data.movie,
          datetime:data.datetime
        })
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Error Accured While Fetching The Show Data",error);
    }
  }
  // console.log(timeselected);
  const getoccupiedseats=async()=>{
    try {
      const {data}=await axios.get(`/api/booking/seats/${timeselected.showId}`)
      console.log(data)
      if(data.success){
        setoccupiedseats(data.occupiedseats);
        console.log(occupiedseats)
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error Accured In Fetching Data Of Occupied Seats",error);
    }
  }

  const bookTickets=async()=>{
    try {
      if(!user){
        return toast.error("Please Login First")
      }
      
      if(!timeselected || !seatselected.length){
        return toast.error("Please Select Time or Seat First")
      }

      const {data}=await axios.post('api/booking/create',{showId:timeselected.showId
        ,selectedSeats:seatselected
      },{
        headers:{
          Authorization:`Bearer ${await getToken()}`  
        }
      })
      console.log(data);
      if(data.success){
        window.location.href=data.url;
      }
      else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error("Error Accured While Making Booking")
    }
  }

  const handleseatclick=(seatid)=>{
    if(!timeselected) return toast("please Select time first")
    if(!seatselected.includes(seatid) && seatselected.length>4){
      return toast("you can Select only 5 seats")
    }
    if(occupiedseats.includes(seatid)){
      return toast("This seat is already booked")
    }
    setseatselected((prev)=>prev.includes(seatid) ? prev.filter(seat=>
      seat !== seatid) : [...prev,seatid])
  }

  const renderseats=(row,count=9)=>(
    <div key={row} className='flex gap-2 mt-2'>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {
          Array.from({length:count},(_,i)=>{
            const seatid=`${row}${i+1}`;
            return (
              <button key={seatid} onClick={()=>handleseatclick(seatid)}
              className={`h-8 w-8 rounded border border-primary/60
              cursor-pointer ${seatselected.includes(seatid) && "bg-primary text-white"}
                ${occupiedseats.includes(seatid) && "opacity-50"}
              `}>
                {seatid}
              </button>
            )
          }
        )}
      </div>
    </div>
  )

  useEffect(()=>{
    if(user){
      getshow()
    }
  },[user])
  useEffect(()=>{
    if(timeselected){
      getoccupiedseats()
    }
  },[timeselected])

  return show ?(
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 placeholder-sky-30
    md:pt-50'>
      {/* Available Timings */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg
      py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div>
          {show.datetime[date].map((item)=>(
            <div key={item.time} onClick={()=>settimeselected(item)}  className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md
            cursor-pointer transition ${timeselected?.time === item.time ?
              "bg-primary text-white" : "hover:bg-primary/20"
            }`}>
              <ClockIcon className='w-4 h-4'/>
              <p className='text-sm'>{isotimeformate(item.time)}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Seat Layout */}
      <div className='relative flex-1 flex flex-col items-center max:md:mt-16'>
          <BlurCircle top="-100px" left='-100px' />
          <BlurCircle bottom="0" right='0' />
          <h1 className='text-2xl font-semibold mb-4'>Select Your Seat</h1>
          <img src={assets.screenImage} alt="Screen" />
          <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>
          <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
            <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
              {grouprows[0].map(row=>renderseats(row))}
            </div>
            <div className='grid grid-cols-2 gap-11'>
              {
                grouprows.slice(1).map((group,idx)=>(
                  <div key={idx}>
                    {group.map((row) => renderseats(row))}
                  </div>
                ))
              }
            </div>
          </div>
          <button onClick={bookTickets} className='flex items-center
          gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull 
          transition rounded-full font-medium cursor-pointer active:scale-95'>
            Proceed To Ckeckout
            <ArrowRightIcon strokeWidth={3} className='w-4 h-4' />
          </button>
      </div>
    </div>
  ) : (
    <Loading/>
  )
}

export default SeatLayout