import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/footer'

const Main = () => {
  return (
    <div className="bg-prigmayBG">
      <Navbar />
    <div className='min-h-screen'>
    <Outlet />
    </div>
      <Footer/>
    </div>
  )
}

export default Main