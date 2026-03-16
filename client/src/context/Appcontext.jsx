import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL

export const Appcontext = createContext()

export const Appprovider=({children})=>{

    const [isAdmin,setisAdmin]=useState(false)
    const [shows,setshows]=useState([])
    const [favroiteMovie,setfavroiteMovie]=useState([])
    const image_base_url=import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
    const {user}= useUser()
    const {getToken}=useAuth()
    const location= useLocation()
    const nev=useNavigate()
    
    const fetchisAdmin=async ()=>{
        try {
            const {data}=await axios.get('/api/admin/is-admin',{
                headers:{
                    Authorization:`Bearer ${await getToken()}`
                }
            })
            setisAdmin(data.isAdmin)
            // console.log(isAdmin)
            // console.log(location.pathname.startsWith('/admin'))
            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                nev('/')
                toast.error('You are Not authorized to access admin')
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    const fetchshow=async()=>{
        try {
            const {data}=await axios.get('/api/show/all')
            console.log(data);  
            if(data.success){
                setshows(data.shows)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const fetchfavroite=async()=>{
        try {
            const {data}=await axios.get('/api/user/favorites',{
                headers:{
                    Authorization:`Bearer ${await getToken()}`
                }
            });

            if(data.success){
                setfavroiteMovie(data.movies)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error.message);
        }
    }
    
    useEffect(()=>{
        if(user){
            fetchisAdmin()
            fetchfavroite()
        }
    },[user])

    useEffect(()=>{
        fetchshow()
    },[])


    const value={axios,isAdmin,shows,favroiteMovie,user,getToken,nev,fetchfavroite,fetchisAdmin,image_base_url}
    return (
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    )
}

export const useAppcontext=()=>useContext(Appcontext)
