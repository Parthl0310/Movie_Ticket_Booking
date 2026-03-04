import NavBar from './components/NavBar'
import { Routes,Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import Footer from './components/Footer'
import {Toaster} from 'react-hot-toast'
import Layout from './pages/Admin/Layout'
import Dashboard from './pages/Admin/Dashboard'
import Addshows from './pages/Admin/Addshows'
import Listshows from './pages/Admin/Listshows'
import ListBookings from './pages/Admin/ListBookings'

const App = () => {

  const isAdmineRoute =useLocation().pathname.startsWith('/admin')
  return (
    <>
      <Toaster/>
      {!isAdmineRoute && <NavBar/>}
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/movies' element={<Movies/>}></Route>
        <Route path='/movies/:id' element={<MovieDetails/>}></Route>
        <Route path='/movies/:id/:date' element={<SeatLayout/>}></Route>
        <Route path='/myBookings' element={<MyBookings/>}></Route>
        <Route path='/favorite' element={<Favorite/>}></Route>

        <Route path='/admin/*' element={<Layout/>}>
          <Route index element={<Dashboard/>} />
          <Route path='add-shows' element={<Addshows/>} />
          <Route path='list-shows' element={<Listshows/>} />
          <Route path='list-Bookings' element={<ListBookings/>} />
        </Route>

      </Routes>
      
      {!isAdmineRoute && <Footer/>}
    </>
  )
}

export default App