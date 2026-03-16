import React, { useEffect } from 'react'
import AdminNavbar from '../../components/Admin/AdminNavbar'
import AdminSidebar from '../../components/Admin/Adminsidebar'
import { Outlet } from 'react-router-dom'
import { useAppcontext } from '../../context/Appcontext.jsx'
import Loading from '../../components/Loading'

const Layout = () => {
  const {isAdmin,fetchisAdmin}=useAppcontext();

  useEffect(()=>{
    fetchisAdmin()
  },[])
  return isAdmin ? (
    <>
        <AdminNavbar />
        <div className='flex'>
            <AdminSidebar/>
            <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)]
            overflow-y-auto'>
                <Outlet/>
            </div>
        </div>
    </>
  ) : <Loading/>
}

export default Layout