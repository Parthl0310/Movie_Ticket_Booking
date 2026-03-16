import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/Admin/Title';
import { dateformat } from '../../lib/dateformat';
import { useAppcontext } from '../../context/Appcontext';
import toast from 'react-hot-toast';

const Listshows = () => {
  const {axios,getToken,user}=useAppcontext();  
  const currency=import.meta.env.VITE_CURRENCY
  const [shows,setshows]=useState([]);
  const [loading,setloading]=useState(null);

  const getallshows=async()=>{
    try{
      const {data}=await axios.get('/api/admin/all-shows',{
        headers:{
          Authorization:`Bearer ${await getToken()}`
        }
      })
      
      // console.log(data)
      if(data.success){
        setshows(data.shows);
        setloading(false);
      }
      else{
        toast.error(data.message);
      }
    }
    catch(error){
      toast.error("Error Accures in Fetching The Data Of All Shows",error)
      // console.error(error);
    }
  }

  useEffect(()=>{
    if(user){
      getallshows();
    }
  },[user])

  return !loading ? (
    <>
      <Title text1="List" text2="Shows  "></Title>
      <div className='max-w-4xl mt-6 overflow-x-auto '>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium pl-5'>Movie Name</th>
              <th className='p-2 font-medium '>Show Name</th>
              <th className='p-2 font-medium '>Total Bookings</th>
              <th className='p-2 font-medium '>Earnings</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
              {shows.map((show,index)=>(
                <tr key={index} className='border-b border-primary/10 bg-primary/5 even:bg-primary/10' >
                  <td className='p-2 min-w-45 pl-5'>{show.movie.title}</td>
                  <td className='p-2 '>{dateformat(show.showdatetime)}</td>
                  <td className='p-2 '>{Object.keys(show.occupiedseats).length}</td>
                  <td className='p-2 '>{Object.keys(show.occupiedseats ).length * show.showprice}</td>

                </tr>
              ))}
          </tbody>
        </table>

      </div>
    </>
  ) : <Loading/>
}

export default Listshows