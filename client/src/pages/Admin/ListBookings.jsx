import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/Admin/Title';
import { List } from 'lucide-react';
import { dateformat } from '../../lib/dateformat';
import { useAppcontext } from '../../context/Appcontext';
import toast from 'react-hot-toast';

const ListBookings = () => {
  const {axios,user,getToken}=useAppcontext()

  const currency=import.meta.env.VITE_CURRENCY

  const [booking,setbooking]=useState([]);
  const [loading,setloading]=useState(true);

  const getbooking=async ()=>{
    try {
      const {data}=await axios.get('/api/admin/all-bookings',{
        headers:{
          Authorization:`Bearer ${await getToken()}`
        }
      })
      // console.log(data)
      if(data.success){
        setbooking(data.bookings)
        setloading(false);
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Error Accures in Fetching The Data Of All Bookings",error)
    }
  };

  useEffect(()=>{
    if(user){
      getbooking();
    }
  },[user])

  return !loading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium pl-5'>User Name</th>
              <th className='p-2 font-medium'>Movie Name</th>
              <th className='p-2 font-medium'>Show Time</th>
              <th className='p-2 font-medium'>Seats</th>
              <th className='p-2 font-medium'>Amount</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
            {
              booking.map((item,index)=>(
                <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10'>
                    <td className='p-2 min-w-45 pl-5'>{item.user.name}</td>
                    <td className='p-2 '>{item.show.movie.title}</td>
                    <td className='p-2 '>{dateformat(item.show.showsatetime)}</td>
                    <td className='p-2 '>{Object.keys(item.bookedSeats).map((seat)=> item.bookedSeats[seat]).join(", ")}</td>
                    <td className='p-2 '>{currency}{item.amount}</td>
                                      
                </tr>
              ))
            }
          </tbody>
        </table>

      </div>
    </>
  ) : < Loading/>
}

export default ListBookings